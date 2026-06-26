import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonService } from '../../core/services/person.service';
import { generateSundays } from '../../shared/utils/sunday-generator';
import { PlanningFormComponent } from '../planning-form/planning-form.component';

@Component({
  selector: 'app-planning',
  imports: [CommonModule, PlanningFormComponent],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanningComponent {

  private personService = inject(PersonService);

  readonly persons = this.personService.persons;

  readonly showModal = signal(false);

  readonly sundays = generateSundays();

  readonly months = computed(() => [
    {
      label: 'Juillet',
      dates: this.sundays.filter(d => d.getMonth() === 6)
    },
    {
      label: 'Août',
      dates: this.sundays.filter(d => d.getMonth() === 7)
    },
    {
      label: 'Septembre',
      dates: this.sundays.filter(d => d.getMonth() === 8)
    }
  ]);

  getPeopleForDate(date: Date) {

    return this.persons().filter(person =>
      person.dates.some(d =>
        new Date(d).toDateString() === date.toDateString()
      )
    );
  }

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

}
