import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
      <div *ngIf="error" class="error-message">{{ error }}</div>

      <mat-card *ngIf="booking && !loading">
        <mat-card-header>
          <mat-card-title>Booking Reference: {{ booking.bookingReference }}</mat-card-title>
          <mat-card-subtitle>For flight {{ booking.flight.flightNumber }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="details">
          <div class="detail-item">
            <span class="label">Passenger Name:</span>
            <span class="value">{{ booking.passengerName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Email:</span>
            <span class="value">{{ booking.email }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Phone Number:</span>
            <span class="value">{{ booking.phoneNumber }}</span>
          </div>
           <div class="detail-item">
            <span class="label">Number of Seats:</span>
            <span class="value">{{ booking.numberOfSeats }}</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 2rem auto; }
    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
    .detail-item { padding: 1rem; background-color: #f9f9f9; border-radius: 8px; }
    .label { font-weight: 500; color: #666; display: block; margin-bottom: 0.5rem; }
    .value { font-weight: 600; font-size: 1.1em; color: #333; }
    .loading-container, .error-message { text-align: center; padding: 3rem; }
  `]
})
export class VviewComponent implements OnInit {
  booking: Booking | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.bookingService.getBookingById(+bookingId).subscribe({
        next: (data) => {
          this.booking = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load booking details.';
          this.loading = false;
        }
      });
    }
  }
}