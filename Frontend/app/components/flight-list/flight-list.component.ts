import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterLink } from '@angular/router';
import { Flight } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    RouterLink
  ],
  template: `
    <div class="page-header">
      <h1 class="page-title">Flight Management</h1>
      <p class="page-subtitle">View and manage all flights</p>
    </div>

    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>All Flights</mat-card-title>
          <mat-card-subtitle>Total: {{ flights.length }} flights</mat-card-subtitle>
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
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let flight">{{ flight.price | currency }}</td>
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
                <button mat-icon-button color="primary" [routerLink]="['/bookings/new']" 
                        [queryParams]="{flightId: flight.id}">
                  <mat-icon>book</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="viewFlight(flight)">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="!loading && !error && flights.length === 0" class="no-data">
            <p>No flights found.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
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
export class FlightListComponent implements OnInit {
  flights: Flight[] = [];
  loading = false;
  error = '';
  displayedColumns: string[] = [
    'flightNumber', 'route', 'departureTime', 'arrivalTime', 
    'aircraft', 'seats', 'price', 'status', 'actions'
  ];

  constructor(private flightService: FlightService,private router:Router) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights(): void {
    this.loading = true;
    this.error = '';
    
    this.flightService.getAllFlights().subscribe({
      next: (flights) => {
        this.flights = flights;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load flights. Please try again.';
        this.loading = false;
        console.error('Error loading flights:', error);
      }
    });
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  }

  viewFlight(flight: Flight): void {
    console.log('Viewing flight:', flight);
    this.router.navigate(['/flights', flight.id]);
  }
}
