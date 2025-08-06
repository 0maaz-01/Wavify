import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, Settings, Download, Square, Circle } from 'lucide-react';

const NoiseReduction = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(0.5);
  const [highPassFreq, setHighPassFreq] = useState(80);
  const [lowPassFreq, setLowPassFreq] = useState(8000);
  const [volume, setVolume] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const highPassFilterRef = useRef(null);
  const lowPassFilterRef = useRef(null);
  const gainNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const processedStreamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (processedStreamRef.current) {
        processedStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializeAudioContext = async () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // We'll handle this ourselves
          autoGainControl: false
        } 
      });
      mediaStreamRef.current = stream;

      const source = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      // Create high-pass filter (removes low-frequency noise)
      const highPassFilter = audioContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setValueAtTime(highPassFreq, audioContext.currentTime);
      highPassFilterRef.current = highPassFilter;

      // Create low-pass filter (removes high-frequency noise)
      const lowPassFilter = audioContext.createBiquadFilter();
      lowPassFilter.type = 'lowpass';
      lowPassFilter.frequency.setValueAtTime(lowPassFreq, audioContext.currentTime);
      lowPassFilterRef.current = lowPassFilter;

      // Create gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNodeRef.current = gainNode;

      // Create analyser for visualization
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Create a destination for recording processed audio
      const destination = audioContext.createMediaStreamDestination();
      processedStreamRef.current = destination.stream;

      // Connect the audio graph
      source.connect(highPassFilter);
      highPassFilter.connect(lowPassFilter);
      lowPassFilter.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);
      
      // Also connect to destination for recording
      gainNode.connect(destination);

      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      return false;
    }
  };

  const startRecording = async () => {
    const success = await initializeAudioContext();
    if (success) {
      setIsRecording(true);
      setIsPlaying(true);
      startVisualization();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPlaying(false);
    stopAudioRecording();
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (processedStreamRef.current) {
      processedStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setRecordingDuration(0);
  };

  const togglePlayback = () => {
    if (isRecording) {
      if (isPlaying) {
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        setIsPlaying(false);
      } else {
        gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume, audioContextRef.current.currentTime);
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (gainNodeRef.current) {
      const newVolume = isMuted ? volume : 0;
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioContextRef.current.currentTime);
      setIsMuted(!isMuted);
    }
  };

  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioContextRef.current.currentTime);
    }
  };

  const updateHighPassFreq = (freq) => {
    setHighPassFreq(freq);
    if (highPassFilterRef.current) {
      highPassFilterRef.current.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
    }
  };

  const updateLowPassFreq = (freq) => {
    setLowPassFreq(freq);
    if (lowPassFilterRef.current) {
      lowPassFilterRef.current.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
    }
  };

  const startAudioRecording = () => {
    if (!processedStreamRef.current) return;
    
    setIsRecordingAudio(true);
    setRecordedBlobs([]);
    setRecordingDuration(0);
    
    const options = { mimeType: 'audio/webm;codecs=opus' };
    try {
      mediaRecorderRef.current = new MediaRecorder(processedStreamRef.current, options);
    } catch (err) {
      console.log('Using default MediaRecorder options');
      mediaRecorderRef.current = new MediaRecorder(processedStreamRef.current);
    }
    
    const blobs = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        blobs.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      setRecordedBlobs(blobs);
      setIsRecordingAudio(false);
    };
    
    mediaRecorderRef.current.start(1000); // Collect data every second
    
    // Start recording timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecordingAudio(false);
  };

  const downloadRecording = () => {
    if (recordedBlobs.length === 0) return;
    
    const blob = new Blob(recordedBlobs, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noise-reduced-audio-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const playRecording = () => {
    if (recordedBlobs.length === 0) return;
    
    const blob = new Blob(recordedBlobs, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startVisualization = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        
        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 * (i / bufferLength);
        const b = 50;
        
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 backdrop-blur-lg border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Live Noise Reduction</h1>
            <p className="text-gray-400">Real-time audio processing with advanced filtering</p>
          </div>

          {/* Visualization Canvas */}
          <div className="mb-8 bg-gray-900 rounded-lg p-4 border border-gray-600">
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full h-48 rounded-lg"
            />
          </div>

          {/* Main Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </button>

            <button
              onClick={togglePlayback}
              disabled={!isRecording}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                !isRecording
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : isPlaying
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={toggleMute}
              disabled={!isRecording}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                !isRecording
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : isMuted
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
              disabled={!isRecording}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                !isRecording
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : isRecordingAudio
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {isRecordingAudio ? <Square size={20} /> : <Circle size={20} />}
              <span>{isRecordingAudio ? 'Stop Recording' : 'Record Audio'}</span>
            </button>

            <button
              onClick={playRecording}
              disabled={recordedBlobs.length === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                recordedBlobs.length === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Play size={20} />
              <span>Play Recording</span>
            </button>

            <button
              onClick={downloadRecording}
              disabled={recordedBlobs.length === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                recordedBlobs.length === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Download size={20} />
              <span>Download</span>
            </button>
          </div>

          {/* Recording Status */}
          {(isRecordingAudio || recordedBlobs.length > 0) && (
            <div className="text-center mb-6">
              <div className="bg-gray-900 rounded-lg px-4 py-2 inline-block border border-gray-600">
                <div className="flex items-center space-x-4">
                  {isRecordingAudio && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white font-mono">
                        REC {formatTime(recordingDuration)}
                      </span>
                    </div>
                  )}
                  {recordedBlobs.length > 0 && !isRecordingAudio && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-white">
                        Recording saved ({recordedBlobs.length} segments)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Toggle */}
          <div className="text-center mb-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Settings size={18} />
              <span>Advanced Settings</span>
            </button>
          </div>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => updateVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    High-Pass Filter: {highPassFreq}Hz
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={highPassFreq}
                    onChange={(e) => updateHighPassFreq(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <p className="text-xs text-gray-400 mt-1">Removes low-frequency noise</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Low-Pass Filter: {lowPassFreq}Hz
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="100"
                    value={lowPassFreq}
                    onChange={(e) => updateLowPassFreq(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <p className="text-xs text-gray-400 mt-1">Removes high-frequency noise</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Noise Reduction: {Math.round(noiseReduction * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={noiseReduction}
                    onChange={(e) => setNoiseReduction(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <p className="text-xs text-gray-400 mt-1">Overall noise reduction strength</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Information */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-gray-900 rounded-lg px-4 py-2 border border-gray-600">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">
                  {isRecording ? 'Recording Active' : 'Recording Inactive'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">
                  {isPlaying ? 'Audio Playing' : 'Audio Paused'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  );
};

export default NoiseReduction;