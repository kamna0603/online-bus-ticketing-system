import React from 'react';
import { Bus, Users, Settings } from 'lucide-react';

interface BusHeaderProps {
  currentView: 'admin' | 'passenger';
  setCurrentView: (view: 'admin' | 'passenger') => void;
}

export const BusHeader: React.FC<BusHeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BusTicket Pro</h1>
              <p className="text-sm text-gray-600">Real-time booking platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('passenger')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'passenger'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Passenger</span>
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'admin'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Organizer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};