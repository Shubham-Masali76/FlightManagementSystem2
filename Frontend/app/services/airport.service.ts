import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airport } from '../models/airport.model';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  private apiUrl = 'http://localhost:8080/api/airports';

  constructor(private http: HttpClient) { }

  getAllAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>(this.apiUrl);
  }

  getAirportById(id: number): Observable<Airport> {
    return this.http.get<Airport>(`${this.apiUrl}/${id}`);
  }

  getAirportByCode(code: string): Observable<Airport> {
    return this.http.get<Airport>(`${this.apiUrl}/code/${code}`);
  }

  getAirportsByCity(city: string): Observable<Airport[]> {
    return this.http.get<Airport[]>(`${this.apiUrl}/city/${city}`);
  }

  getAirportsByCountry(country: string): Observable<Airport[]> {
    return this.http.get<Airport[]>(`${this.apiUrl}/country/${country}`);
  }

  searchAirports(keyword: string): Observable<Airport[]> {
    return this.http.get<Airport[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  createAirport(airport: Airport): Observable<Airport> {
    return this.http.post<Airport>(this.apiUrl, airport);
  }

  updateAirport(id: number, airport: Airport): Observable<Airport> {
    return this.http.put<Airport>(`${this.apiUrl}/${id}`, airport);
  }

  deleteAirport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
