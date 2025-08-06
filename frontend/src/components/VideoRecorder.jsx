import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Pause, Settings, Monitor, Camera, Mic, Download, Volume2, VolumeX } from 'lucide-react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [recordingMode, setRecordingMode] = useState('screen+camera');
  
  // Device states
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMicrophone, setSelectedMicrophone] = useState('');
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const screenStreamRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const noiseReducerRef = useRef(null);

  // Get available devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        setCameras(videoDevices);
        setMicrophones(audioDevices);
        
        if (videoDevices.length > 0) setSelectedCamera(videoDevices[0].deviceId);
        if (audioDevices.length > 0) setSelectedMicrophone(audioDevices[0].deviceId);
      } catch (err) {
        console.error('Error getting devices:', err);
      }
    };
    
    getDevices();
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Noise reduction setup
  const setupNoiseReduction = (audioStream) => {
    if (!noiseReduction) return audioStream;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(audioStream);
      const gainNode = audioContext.createGain();
      const dynamicsCompressor = audioContext.createDynamicsCompressor();
      
      // Configure compressor for noise reduction
      dynamicsCompressor.threshold.value = -40;
      dynamicsCompressor.knee.value = 40;
      dynamicsCompressor.ratio.value = 12;
      dynamicsCompressor.attack.value = 0.003;
      dynamicsCompressor.release.value = 0.25;
      
      gainNode.gain.value = volume / 100;
      
      source.connect(gainNode);
      gainNode.connect(dynamicsCompressor);
      
      const dest = audioContext.createMediaStreamDestination();
      dynamicsCompressor.connect(dest);
      
      audioContextRef.current = audioContext;
      noiseReducerRef.current = { gainNode, dynamicsCompressor };
      
      return dest.stream;
    } catch (err) {
      console.error('Noise reduction setup failed:', err);
      return audioStream;
    }
  };

  // Get camera stream
  const getCameraStream = async () => {
    if (!selectedCamera) return null;
    
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: { 
          deviceId: selectedCamera,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
    } catch (err) {
      console.error('Error accessing camera:', err);
      return null;
    }
  };

  // Get microphone stream
  const getMicrophoneStream = async () => {
    if (!selectedMicrophone) return null;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { 
          deviceId: selectedMicrophone,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      return setupNoiseReduction(stream);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      return null;
    }
  };

  // Get screen stream
  const getScreenStream = async () => {
    try {
      return await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      });
    } catch (err) {
      console.error('Error accessing screen:', err);
      return null;
    }
  };

  // Combine streams
  const combineStreams = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;
    
    const screenStream = await getScreenStream();
    const cameraStream = recordingMode.includes('camera') ? await getCameraStream() : null;
    const micStream = await getMicrophoneStream();
    
    if (!screenStream) {
      throw new Error('Screen capture failed');
    }
    
    screenStreamRef.current = screenStream;
    cameraStreamRef.current = cameraStream;
    audioStreamRef.current = micStream;
    
    const screenVideo = document.createElement('video');
    const cameraVideo = document.createElement('video');
    
    screenVideo.srcObject = screenStream;
    screenVideo.play();
    
    if (cameraStream) {
      cameraVideo.srcObject = cameraStream;
      cameraVideo.play();
      
      // Show camera preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = cameraStream;
      }
    }
    
    // Draw function
    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (screenVideo.readyState === 4) {
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
      }
      
      if (cameraVideo.readyState === 4 && recordingMode.includes('camera')) {
        const camWidth = 300;
        const camHeight = 200;
        const camX = canvas.width - camWidth - 20;
        const camY = 20;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(camX - 5, camY - 5, camWidth + 10, camHeight + 10);
        ctx.drawImage(cameraVideo, camX, camY, camWidth, camHeight);
      }
      
      if (isRecording && !isPaused) {
        requestAnimationFrame(draw);
      }
    };
    
    draw();
    
    // Create combined stream
    const canvasStream = canvas.captureStream(30);
    const combinedStream = new MediaStream();
    
    canvasStream.getVideoTracks().forEach(track => {
      combinedStream.addTrack(track);
    });
    
    if (micStream) {
      micStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
    }
    
    if (screenStream.getAudioTracks().length > 0) {
      screenStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
    }
    
    return combinedStream;
  };

  // Start recording
  const startRecording = async () => {
    try {
      setRecordedChunks([]);
      
      const stream = await combineStreams();
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Failed to start recording. Please check your permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Stop all streams
      [screenStreamRef, cameraStreamRef, audioStreamRef].forEach(ref => {
        if (ref.current) {
          ref.current.getTracks().forEach(track => track.stop());
        }
      });
      
      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  // Download recording
  const downloadRecording = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `screen-recording-${new Date().toISOString()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Update volume
  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    if (noiseReducerRef.current?.gainNode) {
      noiseReducerRef.current.gainNode.gain.value = newVolume / 100;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Advanced Screen Recorder</h1>
          <p className="text-gray-300">Record your screen with camera overlay and professional audio</p>
        </div>

        {/* Main Recording Interface */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl backdrop-blur-sm bg-opacity-90">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-white font-mono text-xl">{formatTime(recordingTime)}</span>
              {isPaused && <span className="text-yellow-400 text-sm">PAUSED</span>}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Recording Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recording Mode */}
                <div>
                  <label className="block text-gray-300 mb-2">Recording Mode</label>
                  <select 
                    value={recordingMode} 
                    onChange={(e) => setRecordingMode(e.target.value)}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                  >
                    <option value="screen">Screen Only</option>
                    <option value="screen+camera">Screen + Camera</option>
                    <option value="camera">Camera Only</option>
                  </select>
                </div>

                {/* Camera Selection */}
                <div>
                  <label className="block text-gray-300 mb-2">Camera</label>
                  <select 
                    value={selectedCamera} 
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                  >
                    {cameras.map(camera => (
                      <option key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Camera ${camera.deviceId}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Microphone Selection */}
                <div>
                  <label className="block text-gray-300 mb-2">Microphone</label>
                  <select 
                    value={selectedMicrophone} 
                    onChange={(e) => setSelectedMicrophone(e.target.value)}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                  >
                    {microphones.map(mic => (
                      <option key={mic.deviceId} value={mic.deviceId}>
                        {mic.label || `Microphone ${mic.deviceId}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Volume Control */}
                <div>
                  <label className="block text-gray-300 mb-2">Volume ({volume}%)</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                    >
                      {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => updateVolume(parseInt(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Noise Reduction */}
                <div className="col-span-full">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={noiseReduction}
                      onChange={(e) => setNoiseReduction(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Enable Noise Reduction</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Camera Preview */}
          {recordingMode.includes('camera') && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Camera Preview</h3>
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                className="w-64 h-48 bg-gray-700 rounded-lg object-cover"
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Start Recording</span>
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={stopRecording}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Square className="w-5 h-5" />
                  <span>Stop</span>
                </button>
              </>
            )}
            
            {recordedChunks.length > 0 && (
              <button
                onClick={downloadRecording}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded-lg">
              <Monitor className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Screen Capture</h4>
              <p className="text-gray-300 text-sm">High-quality screen recording</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <Camera className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Camera Overlay</h4>
              <p className="text-gray-300 text-sm">Picture-in-picture camera</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <Mic className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold">Audio Recording</h4>
              <p className="text-gray-300 text-sm">Crystal clear audio with noise reduction</p>
            </div>
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default ScreenRecorder;