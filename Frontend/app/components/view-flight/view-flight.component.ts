import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Flight } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-view-flight',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  // Use `template` with backticks for multiline HTML
  template: `
    <div class="container">
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div class="error-message" *ngIf="error">
        <h2>Error</h2>
        <p>{{ error }}</p>
      </div>

      <!-- This card will only show when the flight data is successfully loaded -->
      <mat-card *ngIf="flight && !loading">
        <mat-card-header>
          <mat-card-title>Flight Details: {{ flight.flightNumber }}</mat-card-title>
          <mat-card-subtitle>
            From {{ flight.departureAirport.name }} to {{ flight.arrivalAirport.name }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="flight-details">
          <div class="detail-item">
            <span class="label">Status:</span>
            <span class="value">{{ flight.status }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Aircraft:</span>
            <span class="value">{{ flight.aircraftType }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Departure:</span>
            <span class="value">{{ flight.departureTime | date:'medium' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Arrival:</span>
            <span class="value">{{ flight.arrivalTime | date:'medium' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Price per seat:</span>
            <span class="value">{{ flight.price | currency }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Seats:</span>
            <span class="value">{{ flight.availableSeats }} available / {{ flight.totalSeats }} total</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  // Use `styles` with an array of backticked strings for multiline CSS
  styles: [`
    .container {
      max-width: 800px;
      margin: 2rem auto;
    }

    .flight-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .label {
      font-weight: 500;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .value {
      font-weight: 600;
      font-size: 1.1em;
      color: #333;
    }

    .loading-container, .error-message {
      text-align: center;
      padding: 3rem;
    }

    /* Responsive adjustments for smaller screens */
    @media (max-width: 768px) {
      .flight-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ViewFlightComponent implements OnInit {
  flight: Flight | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    const flightId = this.route.snapshot.paramMap.get('id');

    if (flightId) {
      this.flightService.getFlightById(+flightId).subscribe({
        next: (data) => {
          this.flight = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load flight details. The flight may not exist.';
          this.loading = false;
          console.error(err);
        },
      });
    } else {
      this.error = 'No flight ID was provided in the URL.';
      this.loading = false;
    }
  }
}