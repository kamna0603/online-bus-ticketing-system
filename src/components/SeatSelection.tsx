import React, { useEffect, useState } from 'react';
import { useBusData } from '../contexts/BusDataContext';
import { useNotification } from '../contexts/NotificationContext';
import { BusTrip } from '../types/bus';
import { ArrowLeft, User } from 'lucide-react';

interface SeatSelectionProps {
  trip: BusTrip;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  onBack: () => void;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({ 
  trip, 
  selectedSeats, 
  onSeatSelect, 
  onBack 
}) => {
  const { holdSeat, releaseSeat } = useBusData();
  const { addNotification } = useNotification();
  const [currentTrip, setCurrentTrip] = useState(trip);

  // Update trip data when seats change
  useEffect(() => {
    setCurrentTrip(trip);
  }, [trip]);

  const handleSeatClick = (seatId: string) => {
    const seat = currentTrip.seats.find(s => s.id === seatId);
    if (!seat) return;

    if (seat.status === 'sold') {
      addNotification({
        type: 'error',
        message: 'This seat has already been sold'
      });
      return;
    }

    if (seat.status === 'held' && !selectedSeats.includes(seatId)) {
      addNotification({
        type: 'warning',
        message: 'This seat is temporarily held by another passenger'
      });
      return;
    }

    if (selectedSeats.includes(seatId)) {
      // Remove from selection and release hold
      const newSelectedSeats = selectedSeats.filter(id => id !== seatId);
      onSeatSelect(newSelectedSeats);
      releaseSeat(trip.id, seatId);
      
      addNotification({
        type: 'info',
        message: `Seat ${seat.number} released`
      });
    } else {
      // Add to selection and place hold
      if (selectedSeats.length >= 4) {
        addNotification({
          type: 'warning',
          message: 'Maximum 4 seats can be selected at once'
        });
        return;
      }

      const newSelectedSeats = [...selectedSeats, seatId];
      onSeatSelect(newSelectedSeats);
      holdSeat(trip.id, seatId);
      
      addNotification({
        type: 'success',
        message: `Seat ${seat.number} held for 10 minutes`
      });
    }
  };

  const getSeatColor = (seat: any) => {
    if (selectedSeats.includes(seat.id)) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    
    switch (seat.status) {
      case 'available':
        return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400';
      case 'held':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = currentTrip.seats.find(s => s.id === seatId);
    return total + (seat?.price || 0);
  }, 0);

  // Generate seat layout (4 seats per row, with aisle in middle)
  const seatsPerRow = 4;
  const rows = Math.ceil(currentTrip.seats.length / seatsPerRow);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to trips</span>
          </button>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {currentTrip.from} → {currentTrip.to}
            </div>
            <div className="text-sm text-gray-600">{currentTrip.date} at {currentTrip.time}</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Your Seats</h3>
          
          {/* Legend */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 border-2 border-blue-600 rounded"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span className="text-sm text-gray-600">Held</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">Sold</span>
            </div>
          </div>

          {/* Bus layout */}
          <div className="max-w-md mx-auto">
            {/* Driver area */}
            <div className="bg-gray-100 rounded-t-3xl p-4 mb-4 text-center">
              <User className="w-6 h-6 mx-auto text-gray-400" />
              <div className="text-xs text-gray-500 mt-1">Driver</div>
            </div>
            
            {/* Seats */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center space-x-2">
                  {/* Left side seats */}
                  <div className="flex space-x-2">
                    {Array.from({ length: 2 }, (_, seatIndex) => {
                      const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
                      const seat = currentTrip.seats.find(s => s.number === seatNumber);
                      
                      if (!seat) return null;
                      
                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          className={`w-10 h-10 border-2 rounded font-medium text-sm transition-colors ${getSeatColor(seat)}`}
                          disabled={seat.status === 'sold'}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Aisle */}
                  <div className="w-8"></div>
                  
                  {/* Right side seats */}
                  <div className="flex space-x-2">
                    {Array.from({ length: 2 }, (_, seatIndex) => {
                      const seatNumber = rowIndex * seatsPerRow + seatIndex + 3;
                      const seat = currentTrip.seats.find(s => s.number === seatNumber);
                      
                      if (!seat) return null;
                      
                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          className={`w-10 h-10 border-2 rounded font-medium text-sm transition-colors ${getSeatColor(seat)}`}
                          disabled={seat.status === 'sold'}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  Selected Seats: {selectedSeats.map(seatId => {
                    const seat = currentTrip.seats.find(s => s.id === seatId);
                    return seat?.number;
                  }).join(', ')}
                </div>
                <div className="text-sm text-gray-600">
                  Held for 10 minutes - Complete booking to secure seats
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</div>
                <button
                  onClick={() => onSeatSelect(selectedSeats)}
                  className="mt-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue to Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};