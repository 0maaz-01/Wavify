import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Users, Settings } from 'lucide-react';

const Screens = () => {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Alex Chen', muted: false, videoOff: false },
    { id: 2, name: 'Sarah Johnson', muted: true, videoOff: false },
    { id: 3, name: 'Mike Rodriguez', muted: false, videoOff: true }
  ]);

  const [localSettings, setLocalSettings] = useState({
    muted: false,
    videoOff: false,
    inCall: true
  });

  // Generate grid classes based on participant count
  const getGridClasses = (count) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (count === 4) return 'grid-cols-2 lg:grid-cols-2';
    if (count === 5) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3';
  };

  const addParticipant = () => {
    if (participants.length >= 6) return;
    
    const names = ['Emma Wilson', 'David Kim', 'Lisa Zhang', 'James Brown', 'Sofia Garcia', 'Ryan O\'Connor'];
    const newParticipant = {
      id: participants.length + 1,
      name: names[participants.length] || `User ${participants.length + 1}`,
      muted: Math.random() > 0.5,
      videoOff: Math.random() > 0.7
    };
    
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = () => {
    if (participants.length <= 1) return;
    setParticipants(participants.slice(0, -1));
  };

  const toggleMute = () => {
    setLocalSettings(prev => ({ ...prev, muted: !prev.muted }));
  };

  const toggleVideo = () => {
    setLocalSettings(prev => ({ ...prev, videoOff: !prev.videoOff }));
  };

  const endCall = () => {
    setLocalSettings(prev => ({ ...prev, inCall: !prev.inCall }));
  };

  const VideoScreen = ({ participant, isLocal = false }) => {
    const { name, muted, videoOff } = participant;
    
    return (
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group">
        {/* Video Feed Area */}
        <div className="aspect-video relative">
          {videoOff || (isLocal && localSettings.videoOff) ? (
            // Camera Off State
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-white font-bold text-xl">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <VideoOff className="text-gray-400 w-6 h-6" />
            </div>
          ) : (
            // Video Feed Placeholder
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
              {/* Simulated video feed with animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              
              {/* Avatar overlay for style */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg opacity-80">
                <span className="text-white font-bold text-sm">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          )}
          
          {/* Status Indicators */}
          <div className="absolute top-4 right-4 flex gap-2">
            {(muted || (isLocal && localSettings.muted)) && (
              <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          {/* Connection Quality Indicator */}
          <div className="absolute bottom-16 left-4">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    i < 3 ? 'bg-green-400 h-3' : 'bg-gray-600 h-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm md:text-base truncate">
              {isLocal ? 'You' : name}
            </h3>
            {isLocal && (
              <div className="text-xs text-green-400 font-medium px-2 py-1 bg-green-400/20 rounded-full">
                Host
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">Video Conference</h1>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{participants.length} participants</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={removeParticipant}
                disabled={participants.length <= 1}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all duration-200"
              >
                Remove
              </button>
              <button
                onClick={addParticipant}
                disabled={participants.length >= 6}
                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all duration-200"
              >
                Add User
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className={`grid gap-4 sm:gap-6 lg:gap-8 h-full ${getGridClasses(participants.length)} transition-all duration-700`}>
          {participants.map((participant, index) => (
            <VideoScreen
              key={participant.id}
              participant={participant}
              isLocal={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-black/50 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20 gap-4">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-all duration-300 shadow-lg ${
                localSettings.muted
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25'
                  : 'bg-gray-700 hover:bg-gray-600 shadow-gray-700/25'
              }`}
            >
              {localSettings.muted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Video Button */}
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-300 shadow-lg ${
                localSettings.videoOff
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25'
                  : 'bg-gray-700 hover:bg-gray-600 shadow-gray-700/25'
              }`}
            >
              {localSettings.videoOff ? (
                <VideoOff className="w-6 h-6 text-white" />
              ) : (
                <Video className="w-6 h-6 text-white" />
              )}
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className={`p-4 rounded-full transition-all duration-300 shadow-lg ${
                localSettings.inCall
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25'
                  : 'bg-green-500 hover:bg-green-600 shadow-green-500/25'
              }`}
            >
              {localSettings.inCall ? (
                <PhoneOff className="w-6 h-6 text-white" />
              ) : (
                <Phone className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Call Status Overlay */}
      {!localSettings.inCall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <PhoneOff className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Call Ended</h2>
            <p className="text-gray-400 mb-6">Thanks for joining the meeting</p>
            <button
              onClick={endCall}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all duration-200"
            >
              Rejoin Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screens;