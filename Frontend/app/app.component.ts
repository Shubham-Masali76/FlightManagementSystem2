import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>Flight Management System</span>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="/flights" routerLinkActive="active">
            <mat-icon>flight</mat-icon>
            <span>Flights</span>
          </a>
          <a mat-list-item routerLink="/flights/search" routerLinkActive="active">
            <mat-icon>search</mat-icon>
            <span>Search Flights</span>
          </a>
          <a mat-list-item routerLink="/bookings" routerLinkActive="active">
            <mat-icon>book</mat-icon>
            <span>Bookings</span>
          </a>
          <a mat-list-item routerLink="/bookings/new" routerLinkActive="active">
            <mat-icon>add</mat-icon>
            <span>New Booking</span>
          </a>
          <a mat-list-item routerLink="/airports" routerLinkActive="active">
            <mat-icon>location_on</mat-icon>
            <span>Airports</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background-color: var(--primary-color) !important;
      color: white !important;
    }

    mat-sidenav-container {
      height: calc(100vh - 64px);
      margin-top: 64px;
    }

    mat-sidenav {
      width: 250px;
      background-color: var(--surface-color);
      border-right: 1px solid var(--border-color);
    }

    .content {
      padding: 20px;
      background-color: var(--background-color);
      min-height: calc(100vh - 104px);
    }

    mat-nav-list a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-primary);
      text-decoration: none;
      transition: background-color 0.3s;
      border-radius: 8px;
      margin: 4px 8px;
    }

    mat-nav-list a:hover {
      background-color: var(--hover-color);
    }

    mat-nav-list a.active {
      background-color: var(--primary-color);
      color: white;
    }

    mat-nav-list a mat-icon {
      margin-right: 8px;
      color: inherit;
    }

    @media (max-width: 768px) {
      mat-sidenav {
        width: 200px;
      }
      
      .content {
        padding: 10px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Flight Management System';
}
