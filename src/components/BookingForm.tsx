import React, { useState } from 'react';
import { useBusData } from '../contexts/BusDataContext';
import { useNotification } from '../contexts/NotificationContext';
import { BusTrip } from '../types/bus';
import { ArrowLeft, CreditCard, User, Mail, Phone } from 'lucide-react';
import { generateId } from '../utils/helpers';

interface BookingFormProps {
  trip: BusTrip;
  selectedSeats: string[];
  onBack: () => void;
  onComplete: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ 
  trip, 
  selectedSeats, 
  onBack, 
  onComplete 
}) => {
  const { purchaseSeats } = useBusData();
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = trip.seats.find(s => s.id === seatId);
    return total + (seat?.price || 0);
  }, 0);

  const selectedSeatNumbers = selectedSeats.map(seatId => {
    const seat = trip.seats.find(s => s.id === seatId);
    return seat?.number;
  }).join(', ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.cardNumber) {
      addNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingId = generateId();
      const passengerInfo = {
        bookingId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bookedAt: new Date().toISOString()
      };

      // Purchase seats
      purchaseSeats(trip.id, selectedSeats, passengerInfo);
      
      // Send confirmation notification
      addNotification({
        type: 'success',
        message: `Booking confirmed! Confirmation sent to ${formData.email}`
      });

      // Mock email and PDF generation
      setTimeout(() => {
        addNotification({
          type: 'info',
          message: 'Booking confirmation email sent with PDF ticket'
        });
      }, 1000);

      setTimeout(() => {
        addNotification({
          type: 'info',
          message: 'Organizer notified of new booking'
        });
      }, 1500);

      onComplete();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to seat selection</span>
          </button>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {trip.from} → {trip.to}
            </div>
            <div className="text-sm text-gray-600">{trip.date} at {trip.time}</div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Booking</h3>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Selected Seats:</span>
              <span className="font-medium">{selectedSeatNumbers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Seats:</span>
              <span className="font-medium">{selectedSeats.length}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="font-medium text-gray-900">Total Amount:</span>
              <span className="font-bold text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Passenger Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Passenger Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Payment Details
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 rounded-lg font-medium transition-colors ${
              isProcessing
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? 'Processing Payment...' : `Pay $${totalPrice.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};