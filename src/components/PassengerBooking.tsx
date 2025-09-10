import React, { useState } from 'react';
import { useBusData } from '../contexts/BusDataContext';
import { TripCard } from './TripCard';
import { SeatSelection } from './SeatSelection';
import { BookingForm } from './BookingForm';
import { Search, Calendar } from 'lucide-react';
import { BusTrip } from '../types/bus';

export const PassengerBooking: React.FC = () => {
  const { trips } = useBusData();
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    from: '',
    to: '',
    date: ''
  });

  const filteredTrips = trips.filter(trip => {
    if (searchFilters.from && !trip.from.toLowerCase().includes(searchFilters.from.toLowerCase())) return false;
    if (searchFilters.to && !trip.to.toLowerCase().includes(searchFilters.to.toLowerCase())) return false;
    if (searchFilters.date && trip.date !== searchFilters.date) return false;
    return true;
  });

  const handleTripSelect = (trip: BusTrip) => {
    setSelectedTrip(trip);
    setSelectedSeats([]);
  };

  const handleBackToTrips = () => {
    setSelectedTrip(null);
    setSelectedSeats([]);
  };

  return (
    <div className="space-y-6">
      {!selectedTrip ? (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Bus Trip</h2>
            <p className="text-gray-600 mb-6">Search and book bus tickets with real-time seat selection</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input
                  type="text"
                  value={searchFilters.from}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Departure city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input
                  type="text"
                  value={searchFilters.to}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Destination city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={searchFilters.date}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTrips.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
                  <p className="text-gray-600">
                    {trips.length === 0 
                      ? 'No bus trips are currently available.' 
                      : 'Try adjusting your search criteria to find available trips.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              filteredTrips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onSelect={() => handleTripSelect(trip)}
                />
              ))
            )}
          </div>
        </>
      ) : selectedSeats.length === 0 ? (
        <SeatSelection
          trip={selectedTrip}
          selectedSeats={selectedSeats}
          onSeatSelect={setSelectedSeats}
          onBack={handleBackToTrips}
        />
      ) : (
        <BookingForm
          trip={selectedTrip}
          selectedSeats={selectedSeats}
          onBack={() => setSelectedSeats([])}
          onComplete={handleBackToTrips}
        />
      )}
    </div>
  );
};