import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Settings } from 'lucide-react';

const TwoScreen = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);

  // Simulate video feed with animated gradient
  const VideoPlaceholder = ({ userName, isLocal = false }) => (
    <div className="relative w-full aspect-video bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl overflow-hidden shadow-lg group">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
      
      {/* Video off overlay */}
      {isVideoOff && isLocal && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <VideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Camera Off</p>
          </div>
        </div>
      )}
      
      {/* Avatar placeholder when video is off */}
      {(!isLocal || !isVideoOff) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
            <span className="text-white text-2xl font-semibold">
              {userName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
      )}
      
      {/* Connection indicator */}
      <div className="absolute top-3 right-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/80 text-xs font-medium">HD</span>
        </div>
      </div>
      
      {/* User name label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium text-sm sm:text-base">
            {userName} {isLocal && '(You)'}
          </h3>
          {isMuted && isLocal && (
            <MicOff className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
    </div>
  );

  const ControlButton = ({ icon: Icon, isActive, onClick, activeColor = 'bg-blue-500', inactiveColor = 'bg-gray-600' }) => (
    <button
      onClick={onClick}
      className={`p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
        isActive ? activeColor : inactiveColor
      } text-white shadow-lg hover:shadow-xl`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold">Video Call</h1>
              <p className="text-gray-400 text-sm">2 participants</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 text-sm font-medium flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* Video Grid Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          {/* Grid Layout - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* User 1 - Local */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <VideoPlaceholder userName="Alex Johnson" isLocal={true} />
            </div>
            
            {/* User 2 - Remote */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <VideoPlaceholder userName="Sarah Chen" />
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <ControlButton
              icon={isMuted ? MicOff : Mic}
              isActive={!isMuted}
              onClick={() => setIsMuted(!isMuted)}
              activeColor="bg-blue-500"
              inactiveColor="bg-red-500"
            />
            
            <ControlButton
              icon={isVideoOff ? VideoOff : Video}
              isActive={!isVideoOff}
              onClick={() => setIsVideoOff(!isVideoOff)}
              activeColor="bg-blue-500"
              inactiveColor="bg-red-500"
            />
            
            <ControlButton
              icon={Settings}
              isActive={true}
              onClick={() => console.log('Settings clicked')}
              activeColor="bg-gray-600"
            />
            
            <div className="w-px h-8 bg-white/20 mx-2"></div>
            
            <ControlButton
              icon={isCallActive ? PhoneOff : Phone}
              isActive={isCallActive}
              onClick={() => setIsCallActive(!isCallActive)}
              activeColor="bg-red-500"
              inactiveColor="bg-green-500"
            />
          </div>
          
          {/* Call Info */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Call duration: 15:32 • Quality: HD
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Optimization - Portrait Mode Indicator */}
      <div className="md:hidden landscape:hidden fixed top-1/2 left-4 right-4 transform -translate-y-1/2 z-50 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
          <p className="text-white text-sm">
            For the best experience, try rotating your device to landscape mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoScreen;