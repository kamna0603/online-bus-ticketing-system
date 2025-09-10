import React from 'react';
import { MapPin, Calendar, Clock, Users, DollarSign, ArrowRight } from 'lucide-react';
import { BusTrip } from '../types/bus';
import { formatDate } from '../utils/helpers';

interface TripCardProps {
  trip: BusTrip;
  onSelect: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelect }) => {
  const isAvailable = trip.availableSeats > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>{trip.from}</span>
              <ArrowRight className="w-5 h-5 text-gray-400" />
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
              <span>{trip.availableSeats} available</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>From ${trip.basePrice}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {trip.busType.charAt(0).toUpperCase() + trip.busType.slice(1)}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isAvailable ? 'Available' : 'Sold Out'}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <button
            onClick={onSelect}
            disabled={!isAvailable}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isAvailable
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Select Seats' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
};