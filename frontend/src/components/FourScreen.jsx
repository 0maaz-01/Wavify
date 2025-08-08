import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';

const FourScreen = () => {
  const [isCallActive, setIsCallActive] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  // Sample user data
  const users = [
    { id: 1, name: 'Sarah Chen', avatar: 'SC', color: 'bg-purple-500' },
    { id: 2, name: 'Mike Johnson', avatar: 'MJ', color: 'bg-blue-500' },
    { id: 3, name: 'Emma Davis', avatar: 'ED', color: 'bg-green-500' },
    { id: 4, name: 'Alex Rodriguez', avatar: 'AR', color: 'bg-orange-500' }
  ];

  const VideoScreen = ({ user, isMainUser = false }) => (
    <div className={`relative ${isMainUser ? 'col-span-2 row-span-2 md:col-span-1 md:row-span-1' : ''} 
                    bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700 
                    hover:border-gray-600 transition-all duration-300`}>
      {/* Video placeholder with animated gradient */}
      <div className="relative w-full h-full min-h-[200px] bg-gradient-to-br from-gray-800 to-gray-900 
                      flex items-center justify-center">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        {/* User avatar */}
        <div className={`${user.color} w-20 h-20 md:w-24 md:h-24 rounded-full 
                         flex items-center justify-center text-white text-xl md:text-2xl font-bold 
                         shadow-xl z-10`}>
          {user.avatar}
        </div>
        
        {/* Video disabled indicator */}
        {!videoEnabled && user.id === 1 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* User info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent 
                      p-3 md:p-4">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium text-sm md:text-base truncate">
            {user.name}
          </span>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-2">
            {user.id === 1 && !micEnabled && (
              <MicOff className="w-4 h-4 text-red-400" />
            )}
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const ControlButton = ({ icon: Icon, active, onClick, activeColor = 'bg-green-500', inactiveColor = 'bg-gray-600' }) => (
    <button
      onClick={onClick}
      className={`${active ? activeColor : inactiveColor} 
                  p-3 md:p-4 rounded-full text-white hover:scale-110 
                  transition-all duration-200 shadow-lg hover:shadow-xl`}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Main video grid */}
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto h-full">
          {/* Grid layout - responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 h-full min-h-[600px]">
            {users.map((user, index) => (
              <VideoScreen 
                key={user.id} 
                user={user} 
                isMainUser={index === 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-gray-900 border-t border-gray-800 p-4 md:p-6">
        <div className="flex items-center justify-center space-x-4 md:space-x-6">
          <ControlButton
            icon={micEnabled ? Mic : MicOff}
            active={micEnabled}
            onClick={() => setMicEnabled(!micEnabled)}
            activeColor="bg-green-500"
            inactiveColor="bg-red-500"
          />
          
          <ControlButton
            icon={videoEnabled ? Video : VideoOff}
            active={videoEnabled}
            onClick={() => setVideoEnabled(!videoEnabled)}
            activeColor="bg-green-500"
            inactiveColor="bg-red-500"
          />
          
          <ControlButton
            icon={isCallActive ? PhoneOff : Phone}
            active={false}
            onClick={() => setIsCallActive(!isCallActive)}
            activeColor="bg-green-500"
            inactiveColor="bg-red-500"
          />
        </div>
        
        {/* Additional controls row for larger screens */}
        <div className="hidden md:flex items-center justify-center mt-4 space-x-6">
          <button className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
            Share Screen
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
            Chat
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
            Participants
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default FourScreen;