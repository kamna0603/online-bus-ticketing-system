export interface PassengerInfo {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  bookedAt: string;
}

export interface Seat {
  id: string;
  number: number;
  status: 'available' | 'held' | 'sold';
  price: number;
  holdExpiry: string | null;
  passengerInfo: PassengerInfo | null;
}

export interface BusTrip {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  busType: 'standard' | 'luxury' | 'sleeper';
  basePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookingWindow: number; // hours before departure
  seats: Seat[];
  createdAt: string;
}