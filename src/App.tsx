import React, { useState, useEffect } from 'react';
import { BusHeader } from './components/BusHeader';
import { AdminDashboard } from './components/AdminDashboard';
import { PassengerBooking } from './components/PassengerBooking';
import { NotificationProvider } from './contexts/NotificationContext';
import { BusDataProvider } from './contexts/BusDataContext';

function App() {
  const [currentView, setCurrentView] = useState<'admin' | 'passenger'>('passenger');

  return (
    <NotificationProvider>
      <BusDataProvider>
        <div className="min-h-screen bg-gray-50">
          <BusHeader currentView={currentView} setCurrentView={setCurrentView} />
          <main className="container mx-auto px-4 py-6">
            {currentView === 'admin' ? (
              <AdminDashboard />
            ) : (
              <PassengerBooking />
            )}
          </main>
        </div>
      </BusDataProvider>
    </NotificationProvider>
  );
}

export default App;