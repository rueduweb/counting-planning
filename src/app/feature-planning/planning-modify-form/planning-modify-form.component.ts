import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

import { PersonService } from '../../core/services/person.service';
import { Person } from '../../core/models/person.model';
import { AVAILABLE_DATES } from '../../core/constants/persons.constant';
import { dateRangeValidator } from '../../shared/utils/date-range.validator';
import { sundayValidator } from '../../shared/utils/day.validator';

@Component({
  selector: 'app-planning-modify-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './planning-modify-form.component.html',
  styleUrl: './planning-modify-form.component.scss'
})
export class PlanningModifyFormComponent implements OnInit{

  form!: FormGroup;
  private fb = inject(FormBuilder);

  private personService = inject(PersonService);

  public person = input.required<Person>();

  public closed = output<void>();

  public modified = output<Person>();

  readonly availableDates = signal<Date[]>(AVAILABLE_DATES);

  ngOnInit(): void {

    const p = this.person();

    this.form = this.fb.group({

      name: new FormControl(
        {
          value: p.name,
          disabled: true
        },
        Validators.required
      ),

      selectedDate: new FormControl<Date | null>(null),

      dates: this.fb.array(p.dates.map(date => new FormControl(date)))
    });

  }

  get dates(): FormArray<FormControl<Date | null>> {
    return this.form.get('dates') as FormArray<FormControl<Date | null>>;
  }

  // Useful for displaying only the available dates in the Mat Datepicker.
  dateFilter = (date: Date | null): boolean => {

    if (!date) return false;

    return this.availableDates().some(d =>
      d.toDateString() === date.toDateString()
    );

  };


  addDate(): void {

    const date = this.form.controls['selectedDate'].value;

    if (!date) {
      return;
    }

    // Vérifie que la date n'existe pas déjà
    const alreadyExists = this.dates.controls.some(control => {

      const current = control.value;

      if (!current) {
        return false;
      }

      return new Date(current).toDateString() === new Date(date).toDateString();

    });

    if (alreadyExists) {
      return;
    }

    // Ajout de la date
    this.dates.push(
      new FormControl(date)
    );

    // Réinitialisation du champ Date
    this.form.controls['selectedDate'].reset();

  }

  onSubmit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const person: Person = {

      id: this.person().id,

      name: this.person().name,

      dates: this.dates.controls.map( d => d.value!)

    };

    this.personService.update(person);

    this.modified.emit(person);

    this.closed.emit();

  }

  removeDate(index: number): void {

    this.dates.removeAt(index);

  }

  cancel(): void {

    this.form.reset();
    this.closed.emit();
  }

}
