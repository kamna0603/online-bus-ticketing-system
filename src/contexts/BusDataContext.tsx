import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusTrip, Seat, PassengerInfo } from '../types/bus';
import { useNotification } from './NotificationContext';

interface BusDataContextType {
  trips: BusTrip[];
  addTrip: (trip: BusTrip) => void;
  holdSeat: (tripId: string, seatId: string) => void;
  releaseSeat: (tripId: string, seatId: string) => void;
  purchaseSeats: (tripId: string, seatIds: string[], passengerInfo: PassengerInfo) => void;
}

const BusDataContext = createContext<BusDataContextType | undefined>(undefined);

export const BusDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<BusTrip[]>([]);
  const { addNotification } = useNotification();

  // Handle seat hold expiry
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      setTrips(prevTrips => 
        prevTrips.map(trip => ({
          ...trip,
          seats: trip.seats.map(seat => {
            if (seat.status === 'held' && seat.holdExpiry && new Date(seat.holdExpiry) <= now) {
              addNotification({
                type: 'warning',
                message: `Seat ${seat.number} hold expired and has been released`
              });
              return { ...seat, status: 'available', holdExpiry: null };
            }
            return seat;
          }),
          availableSeats: trip.seats.filter(seat => {
            if (seat.status === 'held' && seat.holdExpiry && new Date(seat.holdExpiry) <= now) {
              return true; // Will be available after expiry
            }
            return seat.status === 'available';
          }).length
        }))
      );
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [addNotification]);

  const addTrip = (trip: BusTrip) => {
    setTrips(prev => [...prev, trip]);
  };

  const holdSeat = (tripId: string, seatId: string) => {
    const holdExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id !== tripId) return trip;
        
        const updatedSeats = trip.seats.map(seat => {
          if (seat.id === seatId && seat.status === 'available') {
            return { ...seat, status: 'held', holdExpiry: holdExpiry.toISOString() };
          }
          return seat;
        });
        
        return {
          ...trip,
          seats: updatedSeats,
          availableSeats: updatedSeats.filter(seat => seat.status === 'available').length
        };
      })
    );
  };

  const releaseSeat = (tripId: string, seatId: string) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id !== tripId) return trip;
        
        const updatedSeats = trip.seats.map(seat => {
          if (seat.id === seatId && seat.status === 'held') {
            return { ...seat, status: 'available', holdExpiry: null };
          }
          return seat;
        });
        
        return {
          ...trip,
          seats: updatedSeats,
          availableSeats: updatedSeats.filter(seat => seat.status === 'available').length
        };
      })
    );
  };

  const purchaseSeats = (tripId: string, seatIds: string[], passengerInfo: PassengerInfo) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id !== tripId) return trip;
        
        const updatedSeats = trip.seats.map(seat => {
          if (seatIds.includes(seat.id)) {
            return { 
              ...seat, 
              status: 'sold', 
              holdExpiry: null, 
              passengerInfo 
            };
          }
          return seat;
        });
        
        return {
          ...trip,
          seats: updatedSeats,
          availableSeats: updatedSeats.filter(seat => seat.status === 'available').length
        };
      })
    );
  };

  return (
    <BusDataContext.Provider value={{
      trips,
      addTrip,
      holdSeat,
      releaseSeat,
      purchaseSeats
    }}>
      {children}
    </BusDataContext.Provider>
  );
};

export const useBusData = () => {
  const context = useContext(BusDataContext);
  if (context === undefined) {
    throw new Error('useBusData must be used within a BusDataProvider');
  }
  return context;
};