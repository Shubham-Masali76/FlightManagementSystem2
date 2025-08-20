import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight, FlightStatus } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) { }

  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  getFlightById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/${id}`);
  }

  getFlightByNumber(flightNumber: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/number/${flightNumber}`);
  }

  getFlightsByDepartureAirport(airportCode: string): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.apiUrl}/departure/${airportCode}`);
  }

  getFlightsByArrivalAirport(airportCode: string): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.apiUrl}/arrival/${airportCode}`);
  }

  getAvailableFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.apiUrl}/available`);
  }

  getFlightsByStatus(status: FlightStatus): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.apiUrl}/status/${status}`);
  }

  searchFlights(departureCode: string, arrivalCode: string, departureDate: string, seats: number = 1): Observable<Flight[]> {
    const params = new HttpParams()
      .set('departureCode', departureCode)
      .set('arrivalCode', arrivalCode)
      .set('departureDate', departureDate)
      .set('seats', seats.toString());
    
    return this.http.get<Flight[]>(`${this.apiUrl}/search`, { params });
  }

  createFlight(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(this.apiUrl, flight);
  }

  updateFlight(id: number, flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/${id}`, flight);
  }

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateFlightStatus(id: number, status: FlightStatus): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }
}
