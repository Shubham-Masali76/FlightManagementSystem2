import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router'; // Import the Router
import { Airport } from '../../models/airport.model';
import { AirportService } from '../../services/airport.service';

@Component({
  selector: 'app-airport-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="page-header">
      <h1 class="page-title">Airport Management</h1>
      <p class="page-subtitle">View and manage all airports</p>
    </div>

    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>All Airports</mat-card-title>
          <mat-card-subtitle>Total: {{ airports.length }} airports</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="search-container">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search Airports</mat-label>
              <input matInput [(ngModel)]="searchTerm" (input)="searchAirports()" placeholder="Search by code, name, city, or country">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="loading-container" *ngIf="loading">
            <mat-spinner></mat-spinner>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <table mat-table [dataSource]="filteredAirports" *ngIf="!loading && !error" class="mat-table">
            <!-- Airport Code Column -->
            <ng-container matColumnDef="code">
              <th mat-header-cell *matHeaderCellDef>Code</th>
              <td mat-cell *matCellDef="let airport">{{ airport.code }}</td>
            </ng-container>

            <!-- Airport Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Airport Name</th>
              <td mat-cell *matCellDef="let airport">{{ airport.name }}</td>
            </ng-container>

            <!-- City Column -->
            <ng-container matColumnDef="city">
              <th mat-header-cell *matHeaderCellDef>City</th>
              <td mat-cell *matCellDef="let airport">{{ airport.city }}</td>
            </ng-container>

            <!-- Country Column -->
            <ng-container matColumnDef="country">
              <th mat-header-cell *matHeaderCellDef>Country</th>
              <td mat-cell *matCellDef="let airport">{{ airport.country }}</td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let airport">
                <button mat-icon-button color="primary" (click)="viewAirport(airport)">
                  <mat-icon>visibility</mat-icon>
                </button>
                
                <!-- EDIT BUTTON REMOVED FROM HERE -->

                <button mat-icon-button color="warn" (click)="deleteAirport(airport)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="!loading && !error && filteredAirports.length === 0" class="no-data">
            <p *ngIf="searchTerm">No airports found matching "{{ searchTerm }}".</p>
            <p *ngIf="!searchTerm">No airports found.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .search-container {
      margin-bottom: 1rem;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
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
  `]
})
export class AirportListComponent implements OnInit {
  airports: Airport[] = [];
  filteredAirports: Airport[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  displayedColumns: string[] = ['code', 'name', 'city', 'country', 'actions'];

  constructor(
    private airportService: AirportService,
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit(): void {
    this.loadAirports();
  }

  loadAirports(): void {
    this.loading = true;
    this.error = '';
    
    this.airportService.getAllAirports().subscribe({
      next: (airports) => {
        this.airports = airports;
        this.filteredAirports = airports;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load airports. Please try again.';
        this.loading = false;
        console.error('Error loading airports:', error);
      }
    });
  }

  searchAirports(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAirports = this.airports;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredAirports = this.airports.filter(airport =>
      airport.code.toLowerCase().includes(term) ||
      airport.name.toLowerCase().includes(term) ||
      airport.city.toLowerCase().includes(term) ||
      airport.country.toLowerCase().includes(term)
    );
  }

  viewAirport(airport: Airport): void {
    // Navigate to a dedicated view page for the airport
    // This assumes you have a route like '/airports/:id'
    this.router.navigate(['/airports', airport.id]);
  }

  // editAirport METHOD REMOVED
  
  deleteAirport(airport: Airport): void {
    if (confirm(`Are you sure you want to delete airport ${airport.code}?`)) {
      this.airportService.deleteAirport(airport.id!).subscribe({
        next: () => {
          this.loadAirports(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting airport:', error);
          alert('Failed to delete airport. Please try again.');
        }
      });
    }
  }
}