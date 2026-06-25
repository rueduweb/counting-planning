import { Injectable, signal } from '@angular/core';
import { Person } from '../models/person.model';

const STORAGE_KEY = 'planning-persons';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  readonly persons = signal<Person[]>([]);

  constructor() {
    this.load();
  }

  create(person: Omit<Person, 'id'>): void {

    const newPerson: Person = {
      ...person,
      id: Date.now()
    };

    this.persons.update(list => [...list, newPerson]);

    this.persist();
  }

  update(person: Person): void {

    this.persons.update(list =>
      list.map(p => p.id === person.id ? person : p)
    );

    this.persist();
  }

  delete(id: number): void {

    this.persons.update(list =>
      list.filter(p => p.id !== id)
    );

    this.persist();
  }

  private persist(): void {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.persons())
    );
  }

  private load(): void {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return;
    }

    const persons = JSON.parse(data);

    this.persons.set(
      persons.map((p: any) => ({
        ...p,
        dates: p.dates.map((d: string) => new Date(d))
      }))
    );
  }
}
