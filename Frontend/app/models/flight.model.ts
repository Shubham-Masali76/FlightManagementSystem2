import { Airport } from './airport.model';

export interface Flight {
  id?: number;
  flightNumber: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  aircraftType: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: FlightStatus;
}

export enum FlightStatus {
  SCHEDULED = 'SCHEDULED',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
  BOARDING = 'BOARDING',
  DEPARTED = 'DEPARTED',
  ARRIVED = 'ARRIVED'
}
