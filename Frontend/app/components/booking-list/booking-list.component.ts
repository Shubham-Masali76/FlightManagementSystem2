import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Booking, BookingStatus } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="page-header">
      <h1 class="page-title">Booking Management</h1>
      <p class="page-subtitle">View and manage all bookings</p>
    </div>

    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>All Bookings</mat-card-title>
          <mat-card-subtitle>Total: {{ bookings.length }} bookings</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="loading-container" *ngIf="loading">
            <mat-spinner></mat-spinner>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <table mat-table [dataSource]="bookings" *ngIf="!loading && !error" class="mat-table">
            <!-- Booking Reference Column -->
            <ng-container matColumnDef="bookingReference">
              <th mat-header-cell *matHeaderCellDef>Booking Ref</th>
              <td mat-cell *matCellDef="let booking">{{ booking.bookingReference }}</td>
            </ng-container>

            <!-- Flight Column -->
            <ng-container matColumnDef="flight">
              <th mat-header-cell *matHeaderCellDef>Flight</th>
              <td mat-cell *matCellDef="let booking">
                {{ booking.flight.flightNumber }}<br>
                <small>{{ booking.flight.departureAirport.code }} → {{ booking.flight.arrivalAirport.code }}</small>
              </td>
            </ng-container>

            <!-- Passenger Column -->
            <ng-container matColumnDef="passenger">
              <th mat-header-cell *matHeaderCellDef>Passenger</th>
              <td mat-cell *matCellDef="let booking">
                {{ booking.passengerName }}<br>
                <small>{{ booking.email }}</small>
              </td>
            </ng-container>

            <!-- Seats Column -->
            <ng-container matColumnDef="seats">
              <th mat-header-cell *matHeaderCellDef>Seats</th>
              <td mat-cell *matCellDef="let booking">{{ booking.numberOfSeats }}</td>
            </ng-container>

            <!-- Total Amount Column -->
            <ng-container matColumnDef="totalAmount">
              <th mat-header-cell *matHeaderCellDef>Total Amount</th>
              <td mat-cell *matCellDef="let booking">{{ booking.totalAmount | currency }}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let booking">
                <mat-chip [class]="'status-' + booking.status.toLowerCase()">
                  {{ booking.status }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Booking Date Column -->
            <ng-container matColumnDef="bookingDate">
              <th mat-header-cell *matHeaderCellDef>Booking Date</th>
              <td mat-cell *matCellDef="let booking">
                {{ formatDateTime(booking.bookingDate) }}
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let booking">
                <button mat-icon-button color="primary" (click)="viewBooking(booking)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="editBooking(booking)" 
                        *ngIf="booking.status === 'CONFIRMED'">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="cancelBooking(booking)"
                        *ngIf="booking.status === 'CONFIRMED'">
                  <mat-icon>cancel</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="!loading && !error && bookings.length === 0" class="no-data">
            <p>No bookings found.</p>
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

    .status-confirmed {
      background-color: #f0fdf4 !important;
      color: #16a34a !important;
    }

    .status-cancelled {
      background-color: #fef2f2 !important;
      color: #dc2626 !important;
    }

    .status-completed {
      background-color: #e8f4f8 !important;
      color: #2c5aa0 !important;
    }

    .status-pending {
      background-color: #fff4e6 !important;
      color: #d97706 !important;
    }

    small {
      color: var(--text-secondary);
      font-size: 0.8em;
    }
  `]
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  error = '';
  displayedColumns: string[] = [
    'bookingReference', 'flight', 'passenger', 'seats', 
    'totalAmount', 'status', 'bookingDate', 'actions'
  ];

  constructor(
    private bookingService: BookingService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';
    
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load bookings. Please try again.';
        this.loading = false;
        console.error('Error loading bookings:', error);
      }
    });
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  }

  viewBooking(booking: Booking): void {
    console.log('Viewing booking:', booking);
    // TODO: Implement booking detail view dialog
      this.router.navigate(['/bookings', booking.id]);
  }

  editBooking(booking: Booking): void {
    console.log('Editing booking:', booking);
    // TODO: Implement booking edit functionality
      this.router.navigate(['/bookings', booking.id, 'edit']);
  }

  cancelBooking(booking: Booking): void {
    if (confirm(`Are you sure you want to cancel booking ${booking.bookingReference}?`)) {
      this.bookingService.cancelBooking(booking.id!).subscribe({
        next: () => {
          this.loadBookings(); // Reload the list
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          alert('Failed to cancel booking. Please try again.');
        }
      });
    }
  }
}
