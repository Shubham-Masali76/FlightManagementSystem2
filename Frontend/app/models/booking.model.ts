import { Flight } from './flight.model';

export interface Booking {
  id?: number;
  bookingReference: string;
  flight: Flight;
  passengerName: string;
  email: string;
  phoneNumber: string;
  numberOfSeats: number;
  totalAmount: number;
  status: BookingStatus;
  bookingDate: string;
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING'
}
