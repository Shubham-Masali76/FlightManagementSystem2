import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Flight } from '../../models/flight.model';
import { Airport } from '../../models/airport.model';
import { FlightService } from '../../services/flight.service';
import { AirportService } from '../../services/airport.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="page-header">
      <h1 class="page-title">Search Flights</h1>
      <p class="page-subtitle">Find available flights for your journey</p>
    </div>

    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Flight Search</mat-card-title>
          <mat-card-subtitle>Enter your travel details</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="searchFlights()" class="form-container">
            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>From</mat-label>
                <mat-select formControlName="departureCode" required>
                  <mat-option *ngFor="let airport of airports" [value]="airport.code">
                    {{ airport.code }} - {{ airport.city }}, {{ airport.country }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="searchForm.get('departureCode')?.hasError('required')">
                  Departure airport is required
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>To</mat-label>
                <mat-select formControlName="arrivalCode" required>
                  <mat-option *ngFor="let airport of airports" [value]="airport.code">
                    {{ airport.code }} - {{ airport.city }}, {{ airport.country }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="searchForm.get('arrivalCode')?.hasError('required')">
                  Arrival airport is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Departure Date</mat-label>
                <input matInput [matDatepicker]="departurePicker" formControlName="departureDate" required>
                <mat-datepicker-toggle matSuffix [for]="departurePicker"></mat-datepicker-toggle>
                <mat-datepicker #departurePicker></mat-datepicker>
                <mat-error *ngIf="searchForm.get('departureDate')?.hasError('required')">
                  Departure date is required
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Number of Passengers</mat-label>
                <input matInput type="number" formControlName="passengers" min="1" max="10" required>
                <mat-error *ngIf="searchForm.get('passengers')?.hasError('required')">
                  Number of passengers is required
                </mat-error>
                <mat-error *ngIf="searchForm.get('passengers')?.hasError('min')">
                  Minimum 1 passenger required
                </mat-error>
                <mat-error *ngIf="searchForm.get('passengers')?.hasError('max')">
                  Maximum 10 passengers allowed
                </mat-error>
              </mat-form-field>
            </div>

            <div class="action-buttons">
              <button mat-raised-button color="primary" type="submit" [disabled]="searchForm.invalid || loading">
                <mat-icon>search</mat-icon>
                Search Flights
              </button>
              <button mat-button type="button" (click)="resetForm()">
                <mat-icon>clear</mat-icon>
                Reset
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Search Results -->
      <mat-card *ngIf="searched" class="results-card">
        <mat-card-header>
          <mat-card-title>Search Results</mat-card-title>
          <mat-card-subtitle>{{ flights.length }} flights found</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="loading-container" *ngIf="loading">
            <mat-spinner></mat-spinner>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <table mat-table [dataSource]="flights" *ngIf="!loading && !error" class="mat-table">
            <!-- Flight Number Column -->
            <ng-container matColumnDef="flightNumber">
              <th mat-header-cell *matHeaderCellDef>Flight Number</th>
              <td mat-cell *matCellDef="let flight">{{ flight.flightNumber }}</td>
            </ng-container>

            <!-- Route Column -->
            <ng-container matColumnDef="route">
              <th mat-header-cell *matHeaderCellDef>Route</th>
              <td mat-cell *matCellDef="let flight">
                {{ flight.departureAirport.code }} → {{ flight.arrivalAirport.code }}
              </td>
            </ng-container>

            <!-- Departure Time Column -->
            <ng-container matColumnDef="departureTime">
              <th mat-header-cell *matHeaderCellDef>Departure</th>
              <td mat-cell *matCellDef="let flight">
                {{ formatDateTime(flight.departureTime) }}
              </td>
            </ng-container>

            <!-- Arrival Time Column -->
            <ng-container matColumnDef="arrivalTime">
              <th mat-header-cell *matHeaderCellDef>Arrival</th>
              <td mat-cell *matCellDef="let flight">
                {{ formatDateTime(flight.arrivalTime) }}
              </td>
            </ng-container>

            <!-- Aircraft Column -->
            <ng-container matColumnDef="aircraft">
              <th mat-header-cell *matHeaderCellDef>Aircraft</th>
              <td mat-cell *matCellDef="let flight">{{ flight.aircraftType }}</td>
            </ng-container>

            <!-- Seats Column -->
            <ng-container matColumnDef="seats">
              <th mat-header-cell *matHeaderCellDef>Available Seats</th>
              <td mat-cell *matCellDef="let flight">
                {{ flight.availableSeats }}/{{ flight.totalSeats }}
              </td>
            </ng-container>

            <!-- Price Column -->
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price per Seat</th>
              <td mat-cell *matCellDef="let flight">{{ flight.price | currency }}</td>
            </ng-container>

            <!-- Total Price Column -->
            <ng-container matColumnDef="totalPrice">
              <th mat-header-cell *matHeaderCellDef>Total Price</th>
              <td mat-cell *matCellDef="let flight">
                {{ (flight.price || 0) * (searchForm.get('passengers')?.value || 0) | currency }}
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let flight">
                <mat-chip [class]="'status-' + flight.status.toLowerCase()">
                  {{ flight.status }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let flight">
                <button mat-raised-button color="primary" [routerLink]="['/bookings/new']" 
                        [queryParams]="{flightId: flight.id, passengers: searchForm.get('passengers')?.value}">
                  <mat-icon>book</mat-icon>
                  Book Now
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="!loading && !error && flights.length === 0 && searched" class="no-data">
            <p>No flights found for your search criteria.</p>
            <p>Try adjusting your search parameters.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      position: relative; /* <-- THIS IS THE ONLY CHANGE */
    }

    .results-card {
      margin-top: 2rem;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
    }

    .mat-table {
      width: 100%;
    }

    .mat-header-row {
      background-color: var(--primary-color) !important;
      color: white !important;
    }

    .mat-row:hover {
      background-color: var(--hover-color) !important;
    }

    .status-scheduled {
      background-color: #e8f4f8 !important;
      color: #2c5aa0 !important;
    }

    .status-delayed {
      background-color: #fff4e6 !important;
      color: #d97706 !important;
    }

    .status-cancelled {
      background-color: #fef2f2 !important;
      color: #dc2626 !important;
    }

    .status-boarding {
      background-color: #f0fdf4 !important;
      color: #16a34a !important;
    }

    .status-departed {
      background-color: #faf5ff !important;
      color: #9333ea !important;
    }

    .status-arrived {
      background-color: #f0fdfa !important;
      color: #0d9488 !important;
    }
  `]
})
export class FlightSearchComponent implements OnInit {
  searchForm: FormGroup;
  airports: Airport[] = [];
  flights: Flight[] = [];
  loading = false;
  error = '';
  searched = false;
  displayedColumns: string[] = [
    'flightNumber', 'route', 'departureTime', 'arrivalTime', 
    'aircraft', 'seats', 'price', 'totalPrice', 'status', 'actions'
  ];

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private airportService: AirportService
  ) {
    this.searchForm = this.fb.group({
      departureCode: ['', Validators.required],
      arrivalCode: ['', Validators.required],
      departureDate: ['', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.loadAirports();
  }

  loadAirports(): void {
    this.airportService.getAllAirports().subscribe({
      next: (airports) => {
        this.airports = airports;
      },
      error: (error) => {
        console.error('Error loading airports:', error);
      }
    });
  }

  searchFlights(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      this.error = '';
      this.searched = true;

      const formValue = this.searchForm.value;
      const departureDate = new Date(formValue.departureDate);
      departureDate.setHours(0, 0, 0, 0);

      this.flightService.searchFlights(
        formValue.departureCode,
        formValue.arrivalCode,
        departureDate.toISOString(),
        formValue.passengers
      ).subscribe({
        next: (flights) => {
          this.flights = flights;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to search flights. Please try again.';
          this.loading = false;
          console.error('Error searching flights:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.searchForm.reset({
      departureCode: '',
      arrivalCode: '',
      departureDate: '',
      passengers: 1
    });
    this.flights = [];
    this.searched = false;
    this.error = '';
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  }
}