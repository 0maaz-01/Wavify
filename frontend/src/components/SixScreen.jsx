import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Settings } from 'lucide-react';



const SixScreen = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);

  // Sample user data
  const users = [
    { id: 1, name: "Alex Chen", isHost: true },
    { id: 2, name: "Sarah Johnson", isHost: false },
    { id: 3, name: "Michael Rodriguez", isHost: false },
    { id: 4, name: "Emily Davis", isHost: false },
    { id: 5, name: "David Thompson", isHost: false },
    { id: 6, name: "Lisa Park", isHost: false }
  ];

  // Generate random colors for video placeholders
  const generateGradient = (id) => {
    const gradients = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-pink-400 to-red-500',
      'from-yellow-400 to-orange-500',
      'from-indigo-400 to-purple-500',
      'from-teal-400 to-green-500'
    ];
    return gradients[id - 1] || gradients[0];
  };

  const VideoScreen = ({ user }) => (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700 aspect-video group hover:shadow-xl transition-all duration-300">
      {/* Video placeholder with gradient background */}
      <div className={`w-full h-full bg-gradient-to-br ${generateGradient(user.id)} flex items-center justify-center relative`}>
        {/* Simulated video content */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* User avatar placeholder */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span className="text-white font-semibold text-lg md:text-xl">
            {user.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>

        {/* Video controls overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-1">
            <button className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Host indicator */}
        {user.isHost && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-medium rounded">
              Host
            </span>
          </div>
        )}
      </div>

      {/* User name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-3">
        <p className="text-white font-medium text-sm md:text-base truncate">
          {user.name}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl md:text-2xl font-bold">Team Meeting</h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>
      </div>

      {/* Video Grid Container */}
      <div className="max-w-7xl mx-auto">
        {/* Main Video Grid */}
        <div className="grid gap-4 mb-6
                        grid-cols-1 sm:grid-cols-2 
                        lg:grid-cols-3 
                        xl:grid-cols-3">
          {users.map((user) => (
            <VideoScreen key={user.id} user={user} />
          ))}
        </div>

        {/* Control Bar */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800 rounded-full px-6 py-3 flex items-center space-x-4 shadow-2xl border border-gray-700">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-all duration-200 ${
                isMuted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Video Button */}
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full transition-all duration-200 ${
                isVideoOff 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>

            {/* End Call Button */}
            <button
              onClick={() => setIsCallActive(!isCallActive)}
              className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Call ended overlay */}
      {!isCallActive && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-white text-2xl font-bold mb-4">Call Ended</h2>
            <p className="text-gray-400 mb-6">Thanks for joining the meeting</p>
            <button
              onClick={() => setIsCallActive(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Rejoin Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SixScreen;