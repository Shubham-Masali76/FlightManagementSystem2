import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/flights', pathMatch: 'full' },
  { path: 'flights', loadComponent: () => import('./components/flight-list/flight-list.component').then(m => m.FlightListComponent) },
  { path: 'flights/search', loadComponent: () => import('./components/flight-search/flight-search.component').then(m => m.FlightSearchComponent) },
  { path: 'bookings', loadComponent: () => import('./components/booking-list/booking-list.component').then(m => m.BookingListComponent) },
  { path: 'bookings/new', loadComponent: () => import('./components/booking-form/booking-form.component').then(m => m.BookingFormComponent) },
  { path: 'airports', loadComponent: () => import('./components/airport-list/airport-list.component').then(m => m.AirportListComponent) },
  { path: 'flights/:id', loadComponent: ()=> import('./components/view-flight/view-flight.component').then(m=> m.ViewFlightComponent) },
  { path: 'bookings/:id', loadComponent: ()=> import('./components/vview-flight/vview-flight.component').then(m=> m.VviewComponent)},
  { path: 'bookings/:id/edit', loadComponent: ()=> import('./components/vedit-flight/vedit-flight.component').then(m=> m.VeditComponent)},
  { path: '**', redirectTo: '/flights' },
];
