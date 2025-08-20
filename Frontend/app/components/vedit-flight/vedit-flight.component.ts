import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
      <div *ngIf="error" class="error-message">{{ error }}</div>

      <mat-card *ngIf="!loading && !error">
        <mat-card-header>
          <mat-card-title>Edit Booking</mat-card-title>
          <mat-card-subtitle *ngIf="booking">
            Reference: {{ booking.bookingReference }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="bookingForm" (ngSubmit)="updateBooking()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Passenger Name</mat-label>
                <input matInput formControlName="passengerName" required />
                <mat-error *ngIf="bookingForm.get('passengerName')?.hasError('required')">
                  Passenger name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required />
                <mat-error *ngIf="bookingForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="bookingForm.get('email')?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phoneNumber" required />
                <mat-error *ngIf="bookingForm.get('phoneNumber')?.hasError('required')">
                  Phone number is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Number of Seats</mat-label>
                <input matInput type="number" formControlName="numberOfSeats" required min="1" />
                <mat-error *ngIf="bookingForm.get('numberOfSeats')?.hasError('required')">
                  Number of seats is required
                </mat-error>
                 <mat-error *ngIf="bookingForm.get('numberOfSeats')?.hasError('min')">
                  At least one seat is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="action-buttons">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="bookingForm.invalid || submitting"
              >
                {{ submitting ? 'Saving...' : 'Save Changes' }}
              </button>
              <button mat-button type="button" (click)="goBack()">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 2rem auto; }
    .loading-container, .error-message { text-align: center; padding: 3rem; }
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    mat-form-field {
      flex: 1; /* Makes form fields share space equally */
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        margin-bottom: 0;
      }
    }
  `]
})
export class VeditComponent implements OnInit {
  bookingForm: FormGroup;
  booking: Booking | null = null;
  bookingId: number | null = null;
  loading = true;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      passengerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      numberOfSeats: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookingId = +id;
      this.bookingService.getBookingById(this.bookingId).subscribe({
        next: (data) => {
          this.booking = data;
          // Populate the form with the fetched data
          this.bookingForm.patchValue(data);
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load booking data. It may no longer exist.';
          this.loading = false;
        },
      });
    }
  }

  updateBooking(): void {
    if (this.bookingForm.invalid || !this.bookingId) {
      return;
    }

    this.submitting = true;
    const updatedData: Booking = {
      ...this.booking!, // Include original data like flight, reference, etc.
      ...this.bookingForm.value, // Overwrite with new form values
      id: this.bookingId
    };

    this.bookingService.updateBooking(this.bookingId,updatedData).subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open('Booking updated successfully!', 'Close', { duration: 3000 });
        // Navigate back to the view page for this booking
        this.router.navigate(['/bookings', this.bookingId]);
      },
      error: () => {
        this.error = 'Failed to update booking. Please try again.';
        this.submitting = false;
      },
    });
  }

  goBack(): void {
    // Navigate back to the view page if possible, otherwise to the list
    if (this.bookingId) {
      this.router.navigate(['/bookings', this.bookingId]);
    } else {
      this.router.navigate(['/bookings']);
    }
  }
}