import { Component, computed, inject, output, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PersonService } from '../../core/services/person.service';
import { PERSON_NAMES } from '../../core/constants/persons.constant';
import { dateRangeValidator } from '../../shared/utils/date-range.validator';
import { sundayValidator } from '../../shared/utils/day.validator';
@Component({
  selector: 'app-planning-form',
  imports: [ReactiveFormsModule],
  templateUrl: './planning-form.component.html',
  styleUrl: './planning-form.component.scss'
})
export class PlanningFormComponent {

  readonly closed = output<void>();

  private fb = inject(FormBuilder);

  private personService = inject(PersonService);

  readonly personNames = signal<string[]>(PERSON_NAMES);

  readonly selectedDates = signal<Date[]>([]);

  readonly datesAsText = computed(() =>
    this.selectedDates()
      .map(date =>
        new Intl.DateTimeFormat('fr-FR').format(date)
      )
      .join('\n')
  );

  readonly minDate = '2026-07-05';
  readonly maxDate = '2026-09-27';

  readonly form = this.fb.group({

    name: this.fb.nonNullable.control(
      '',
      [Validators.required, Validators.minLength(3)]
    ),

    date: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        dateRangeValidator(
          new Date('2026-07-05'),
          new Date('2026-09-27')
        ),
        sundayValidator()
      ]
    )
  });

  addDate(): void {

    const value = this.form.controls.date.value;

    if (!value) {
      return;
    }

    const date = new Date(value);

    const alreadyExists = this.selectedDates()
      .some(d => d.toDateString() === date.toDateString());

    if (alreadyExists) {
      return;
    }

    this.selectedDates.update(dates => [
      ...dates,
      date
    ]);

    this.form.controls.date.reset();
  }

  removeDate(index: number): void {
    this.selectedDates.update(dates =>
      dates.filter((_, i) => i !== index)
    );
  }

  submit(): void {

    if (this.form.controls.name.invalid ||
    this.selectedDates().length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Name: ', this.form.controls.name.value);
    console.log('Dates: ', this.selectedDates().values());

    this.personService.create({
      name: this.form.controls.name.value,
      dates: this.selectedDates()
    });

    this.cancel();

  }

  cancel(): void {

    this.form.reset();
    this.selectedDates.set([]);
    this.closed.emit();
  }

}
