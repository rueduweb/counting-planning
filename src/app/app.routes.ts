import { Routes } from '@angular/router';
import { PlanningComponent } from './feature-planning/planning/planning.component';

export const routes: Routes = [
  { path: '', redirectTo: 'planning', pathMatch: 'full'},
  {
    path: 'planning',
    component: PlanningComponent
  }
];
