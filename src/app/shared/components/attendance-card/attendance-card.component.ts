import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../../core/models/person.model';

type CardState = {
  border: string;
  text: string;
  bg: string;
  emoji: string;
};

@Component({
  selector: 'app-attendance-card',
  imports: [CommonModule],
  templateUrl: './attendance-card.component.html',
  styleUrl: './attendance-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceCardComponent {
  readonly date = input.required<Date>();

  readonly people = input.required<Person[]>();

  readonly selectedPeople = output<Person>();

  readonly displayedCount = input.required<number>();

  readonly formattedDate = computed(() =>
    new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(this.date())
  );

  readonly state = computed<CardState>(() => {

    const nb = this.displayedCount();

    if (nb > 4) {
      return {
        border: 'border-green-500',
        text: 'text-green-600',
        bg: 'bg-green-500',
        emoji: '😌'
      };
    }

    if (nb === 4) {
      return {
        border: 'border-gray-400',
        text: 'text-gray-500',
        bg: 'bg-gray-400',
        emoji: '😐'
      };
    }

    return {
      border: 'border-red-500',
      text: 'text-red-500',
      bg: 'bg-red-500',
      emoji: '😠'
    };

  });

  callModifyForm(person: Person): void {
    this.selectedPeople.emit(person);
  }

}
