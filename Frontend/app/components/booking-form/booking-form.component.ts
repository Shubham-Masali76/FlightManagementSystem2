import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { Flight } from "../../models/flight.model";
import { Booking } from "../../models/booking.model";
import { FlightService } from "../../services/flight.service";
import { BookingService } from "../../services/booking.service";

@Component({
  selector: "app-booking-form",
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  template: `
    <div class="page-header">
      <h1 class="page-title">New Booking</h1>
      <p class="page-subtitle">Create a new flight booking</p>
    </div>

    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Flight Details</mat-card-title>
          <mat-card-subtitle *ngIf="selectedFlight">
            {{ selectedFlight.flightNumber }} -
            {{ selectedFlight.departureAirport.code }} →
            {{ selectedFlight.arrivalAirport.code }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="loading-container" *ngIf="loading">
            <mat-spinner></mat-spinner>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <div *ngIf="selectedFlight && !loading" class="flight-details">
            <div class="flight-info">
              <div class="info-row">
                <span class="label">Flight Number:</span>
                <span class="value">{{ selectedFlight.flightNumber }}</span>
              </div>
              <div class="info-row">
                <span class="label">Route:</span>
                <span class="value"
                  >{{ selectedFlight.departureAirport.code }} →
                  {{ selectedFlight.arrivalAirport.code }}</span
                >
              </div>
              <div class="info-row">
                <span class="label">Departure:</span>
                <span class="value">{{
                  formatDateTime(selectedFlight.departureTime)
                }}</span>
              </div>
              <div class="info-row">
                <span class="label">Arrival:</span>
                <span class="value">{{
                  formatDateTime(selectedFlight.arrivalTime)
                }}</span>
              </div>
              <div class="info-row">
                <span class="label">Aircraft:</span>
                <span class="value">{{ selectedFlight.aircraftType }}</span>
              </div>
              <div class="info-row">
                <span class="label">Available Seats:</span>
                <span class="value"
                  >{{ selectedFlight.availableSeats }}/{{
                    selectedFlight.totalSeats
                  }}</span
                >
              </div>
              <div class="info-row">
                <span class="label">Price per Seat:</span>
                <span class="value">{{
                  selectedFlight.price | currency
                }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="selectedFlight && !loading">
        <mat-card-header>
          <mat-card-title>Passenger Information</mat-card-title>
          <mat-card-subtitle>Enter passenger details</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form
            [formGroup]="bookingForm"
            (ngSubmit)="createBooking()"
            class="form-container"
          >
            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Passenger Name</mat-label>
                <input matInput formControlName="passengerName" required />
                <mat-error
                  *ngIf="bookingForm.get('passengerName')?.hasError('required')"
                >
                  Passenger name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Email</mat-label>
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  required
                />
                <mat-error
                  *ngIf="bookingForm.get('email')?.hasError('required')"
                >
                  Email is required
                </mat-error>
                <mat-error
                  *ngIf="bookingForm.get('email')?.hasError('email')"
                >
                  Please enter a valid email
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phoneNumber" required />
                <mat-error
                  *ngIf="bookingForm.get('phoneNumber')?.hasError('required')"
                >
                  Phone number is required
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Number of Seats</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="numberOfSeats"
                  [min]="1"
                  [max]="selectedFlight.availableSeats || 1"
                  required
                />
                <mat-error
                  *ngIf="
                    bookingForm.get('numberOfSeats')?.hasError('required')
                  "
                >
                  Number of seats is required
                </mat-error>
                <mat-error
                  *ngIf="bookingForm.get('numberOfSeats')?.hasError('min')"
                >
                  Minimum 1 seat required
                </mat-error>
                <mat-error
                  *ngIf="bookingForm.get('numberOfSeats')?.hasError('max')"
                >
                  Maximum {{ selectedFlight.availableSeats }} seats available
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Booking Reference</mat-label>
                <input matInput formControlName="bookingReference" required />
                <mat-error
                  *ngIf="
                    bookingForm.get('bookingReference')?.hasError('required')
                  "
                >
                  Booking reference is required
                </mat-error>
              </mat-form-field>
            </div>

            <div
              class="price-summary"
              *ngIf="bookingForm.get('numberOfSeats')?.value && selectedFlight"
            >
              <h3>Price Summary</h3>
              <div class="price-row">
                <span>Price per seat:</span>
                <span>{{ selectedFlight.price | currency }}</span>
              </div>
              <div class="price-row">
                <span>Number of seats:</span>
                <span>{{ bookingForm.get("numberOfSeats")?.value }}</span>
              </div>
              <div class="price-row total">
                <span>Total Amount:</span>
                <span>{{
                  (selectedFlight.price *
                    (bookingForm.get("numberOfSeats")?.value || 0))
                    | currency
                }}</span>
              </div>
            </div>

            <div class="action-buttons">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="bookingForm.invalid || submitting"
              >
                <mat-icon>book</mat-icon>
                Confirm Booking
              </button>
              <button mat-button type="button" (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Back
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .flight-details {
        margin-top: 1rem;
      }

      .flight-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1rem;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
      }

      .label {
        font-weight: 500;
        color: var(--text-secondary);
      }

      .value {
        font-weight: 600;
        color: var(--text-primary);
      }

      .price-summary {
        background-color: var(--surface-color);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border: 1px solid var(--border-color);
      }

      .price-summary h3 {
        margin: 0 0 1rem 0;
        color: var(--text-primary);
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
      }

      .price-row.total {
        border-top: 2px solid var(--primary-color);
        font-weight: 600;
        font-size: 1.1em;
        color: var(--primary-color);
      }

      @media (max-width: 768px) {
        .flight-info {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  selectedFlight: Flight | null = null;
  loading = false;
  submitting = false;
  error = "";

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      passengerName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      bookingReference: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      numberOfSeats: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const flightId = params["flightId"];
      const passengers = params["passengers"];

      if (flightId) {
        this.loadFlight(flightId);
        if (passengers) {
          this.bookingForm.patchValue({
            numberOfSeats: parseInt(passengers, 10),
          });
        }
      } else {
        this.error = "No flight selected for booking.";
      }
    });
  }

  loadFlight(flightId: string): void {
    this.loading = true;
    this.error = "";

    this.flightService.getFlightById(parseInt(flightId, 10)).subscribe({
      next: (flight) => {
        this.selectedFlight = flight;
        this.loading = false;

        // Update max seats validation
        this.bookingForm
          .get("numberOfSeats")
          ?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(flight.availableSeats),
          ]);
        this.bookingForm.get("numberOfSeats")?.updateValueAndValidity();
      },
      error: (error) => {
        this.error = "Failed to load flight details. Please try again.";
        this.loading = false;
        console.error("Error loading flight:", error);
      },
    });
  }

  createBooking(): void {
    if (this.bookingForm.valid && this.selectedFlight) {
      this.submitting = true;

      const bookingData: Partial<Booking> = {
        flight: this.selectedFlight,
        passengerName: this.bookingForm.value.passengerName,
        email: this.bookingForm.value.email,
        phoneNumber: this.bookingForm.value.phoneNumber,
        numberOfSeats: this.bookingForm.value.numberOfSeats,
        bookingReference: this.bookingForm.value.bookingReference,
      };

      this.bookingService.createBooking(bookingData as Booking).subscribe({
        next: (booking) => {
          this.submitting = false;
          this.snackBar.open(
            `Booking created successfully! Reference: ${booking.bookingReference}`,
            "Close",
            { duration: 5000 }
          );
          this.router.navigate(["/bookings"]);
        },
        error: (error) => {
          this.submitting = false;
          this.error = "Failed to create booking. Please try again.";
          console.error("Error creating booking:", error);
        },
      });
    }
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  }

  goBack(): void {
    this.router.navigate(["/flights"]);
  }
}