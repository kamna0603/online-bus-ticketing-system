import React, { useState } from 'react';
import { useBusData } from '../contexts/BusDataContext';
import { useNotification } from '../contexts/NotificationContext';
import { MapPin, Calendar, Clock, DollarSign, Users, Bus } from 'lucide-react';
import { generateId } from '../utils/helpers';

export const CreateTrip: React.FC = () => {
  const { addTrip } = useBusData();
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    busType: 'standard',
    basePrice: '',
    totalSeats: 40,
    bookingWindow: 48
  });

  const busTypes = [
    { value: 'standard', label: 'Standard Bus', seats: 40 },
    { value: 'luxury', label: 'Luxury Coach', seats: 36 },
    { value: 'sleeper', label: 'Sleeper Bus', seats: 32 }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.from || !formData.to || !formData.date || !formData.time || !formData.basePrice) {
      addNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    const selectedBusType = busTypes.find(bus => bus.value === formData.busType);
    const totalSeats = selectedBusType?.seats || 40;
    
    // Generate seat layout
    const seats = Array.from({ length: totalSeats }, (_, i) => ({
      id: generateId(),
      number: i + 1,
      status: 'available' as const,
      price: parseFloat(formData.basePrice),
      holdExpiry: null,
      passengerInfo: null
    }));

    const trip = {
      id: generateId(),
      from: formData.from,
      to: formData.to,
      date: formData.date,
      time: formData.time,
      busType: formData.busType,
      basePrice: parseFloat(formData.basePrice),
      totalSeats,
      availableSeats: totalSeats,
      bookingWindow: formData.bookingWindow,
      seats,
      createdAt: new Date().toISOString()
    };

    addTrip(trip);
    addNotification({
      type: 'success',
      message: `Trip from ${formData.from} to ${formData.to} created successfully!`
    });

    // Reset form
    setFormData({
      from: '',
      to: '',
      date: '',
      time: '',
      busType: 'standard',
      basePrice: '',
      totalSeats: 40,
      bookingWindow: 48
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'busType') {
      const selectedBus = busTypes.find(bus => bus.value === value);
      if (selectedBus) {
        setFormData(prev => ({ ...prev, totalSeats: selectedBus.seats }));
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Bus Trip</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              From
            </label>
            <input
              type="text"
              value={formData.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Departure city"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              To
            </label>
            <input
              type="text"
              value={formData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Destination city"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bus className="w-4 h-4 inline mr-1" />
              Bus Type
            </label>
            <select
              value={formData.busType}
              onChange={(e) => handleInputChange('busType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {busTypes.map(bus => (
                <option key={bus.value} value={bus.value}>
                  {bus.label} ({bus.seats} seats)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Base Price ($)
            </label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) => handleInputChange('basePrice', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Booking Window (hours before departure)
          </label>
          <select
            value={formData.bookingWindow}
            onChange={(e) => handleInputChange('bookingWindow', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={24}>24 hours</option>
            <option value={48}>48 hours</option>
            <option value={72}>72 hours</option>
            <option value={168}>1 week</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Create Bus Trip
        </button>
      </form>
    </div>
  );
};