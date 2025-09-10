import React from 'react';
import { useBusData } from '../contexts/BusDataContext';
import { MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export const TripsList: React.FC = () => {
  const { trips } = useBusData();

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips created yet</h3>
          <p className="text-gray-600">Create your first bus trip to start accepting bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map(trip => (
        <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>{trip.from}</span>
                  <span className="text-gray-400">→</span>
                  <span>{trip.to}</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(trip.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{trip.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{trip.availableSeats}/{trip.totalSeats} available</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>${trip.basePrice}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {trip.busType.charAt(0).toUpperCase() + trip.busType.slice(1)}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  trip.availableSeats > trip.totalSeats * 0.5
                    ? 'bg-green-100 text-green-800'
                    : trip.availableSeats > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {trip.availableSeats === 0 
                    ? 'Sold Out' 
                    : trip.availableSeats < trip.totalSeats * 0.2
                    ? 'Almost Full'
                    : 'Available'
                  }
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ${(trip.totalSeats - trip.availableSeats) * trip.basePrice}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};