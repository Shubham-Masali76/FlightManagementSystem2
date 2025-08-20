import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingStatus } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) { }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  getBookingByReference(bookingReference: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/reference/${bookingReference}`);
  }

  getBookingsByPassengerName(passengerName: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/passenger/${passengerName}`);
  }

  getBookingsByEmail(email: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/email/${email}`);
  }

  getBookingsByFlightId(flightId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/flight/${flightId}`);
  }

  getBookingsByStatus(status: BookingStatus): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/status/${status}`);
  }

  getUpcomingBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/upcoming`);
  }

  searchBookings(keyword: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  updateBooking(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  cancelBooking(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
