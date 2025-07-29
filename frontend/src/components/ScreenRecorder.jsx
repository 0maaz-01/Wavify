import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Download, Monitor, Camera, Mic, MicOff, Settings, Info, ChevronDown } from 'lucide-react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingMode, setRecordingMode] = useState('screen');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Device selection states
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMicrophone, setSelectedMicrophone] = useState('');
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  
  const videoRef = useRef(null);
  const recordedVideoRef = useRef(null);
  const cameraPreviewRef = useRef(null);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);






  const getQualityConstraints = () => {
    const constraints = {
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '4K': { width: 3840, height: 2160 }
    };
    return constraints[videoQuality] || constraints['1080p'];
  };

  const getScreenStream = async () => {
    const { width, height } = getQualityConstraints();
    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        mediaSource: 'screen',
        width: { ideal: width },
        height: { ideal: height },
        frameRate: { ideal: 30 }
      },
      audio: audioEnabled
    });
  };

  const getCameraStream = async () => {
    const { width, height } = getQualityConstraints();
    return await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
        width: { ideal: width },
        height: { ideal: height },
        frameRate: { ideal: 30 }
      },
      audio: audioEnabled && selectedMicrophone ? {
        deviceId: { exact: selectedMicrophone }
      } : audioEnabled
    });
  };

  const combineStreams = async (screenStream, cameraStream) => {
    const canvas = canvasRef.current;
    if (!canvas) return screenStream;

    const ctx = canvas.getContext('2d');
    const { width, height } = getQualityConstraints();
    
    canvas.width = width;
    canvas.height = height;

    const screenVideo = document.createElement('video');
    const cameraVideo = document.createElement('video');
    
    screenVideo.srcObject = screenStream;
    cameraVideo.srcObject = cameraStream;
    
    screenVideo.play();
    cameraVideo.play();

    const draw = () => {
      if (screenVideo.readyState === 4 && cameraVideo.readyState === 4) {
        // Draw screen content
        ctx.drawImage(screenVideo, 0, 0, width, height);
        
        // Draw camera in bottom-right corner (20% of screen size)
        const cameraWidth = width * 0.2;
        const cameraHeight = height * 0.2;
        const cameraX = width - cameraWidth - 20;
        const cameraY = height - cameraHeight - 20;
        
        // Add border to camera
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 4;
        ctx.strokeRect(cameraX - 2, cameraY - 2, cameraWidth + 4, cameraHeight + 4);
        
        ctx.drawImage(cameraVideo, cameraX, cameraY, cameraWidth, cameraHeight);
      }
      
      if (isRecording) {
        requestAnimationFrame(draw);
      }
    };

    // Wait for videos to be ready
    await new Promise((resolve) => {
      let readyCount = 0;
      const checkReady = () => {
        readyCount++;
        if (readyCount === 2) resolve();
      };
      screenVideo.addEventListener('loadedmetadata', checkReady);
      cameraVideo.addEventListener('loadedmetadata', checkReady);
    });

    draw();
    
    // Get stream from canvas
    const canvasStream = canvas.captureStream(30);
    
    // Add audio from screen stream
    const audioTracks = screenStream.getAudioTracks();
    audioTracks.forEach(track => canvasStream.addTrack(track));
    
    return canvasStream;
  };

  const startRecording = async () => {
    try {
      setError('');
      setIsProcessing(true);
      
      let mediaStream;
      
      if (recordingMode === 'screen') {
        mediaStream = await getScreenStream();
      } else if (recordingMode === 'camera') {
        mediaStream = await getCameraStream();
      } else if (recordingMode === 'both') {
        const screenStream = await getScreenStream();
        const cameraStream = await getCameraStream();
        mediaStream = await combineStreams(screenStream, cameraStream);
      }
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Create MediaRecorder with better codec support
      let options = { mimeType: 'video/webm;codecs=vp9,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm;codecs=vp8,opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm' };
        }
      }

      const recorder = new MediaRecorder(mediaStream, options);
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        setRecordedChunks(chunks);
        setIsProcessing(false);
        
        const blob = new Blob(chunks, { type: 'video/webm' });
        if (recordedVideoRef.current) {
          recordedVideoRef.current.src = URL.createObjectURL(blob);
        }
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setIsProcessing(false);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Handle stream ending
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].onended = () => {
          stopRecording();
        };
      }

    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };


  const DeviceSelector = ({ devices, selectedDevice, onSelect, label, type }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={selectedDevice}
        onChange={(e) => onSelect(e.target.value)}
        disabled={isRecording}
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
      >
        <option value="">Default {type}</option>
        {devices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `${type} ${device.deviceId.slice(0, 8)}`}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Screen Recorder Pro
          </h1>
          <p className="text-slate-300">Record your screen, camera, or both with professional quality</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-2">
            <Info className="text-red-400" size={20} />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Main Controls */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recording Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Monitor className="text-purple-400" size={20} />
              Recording Controls
            </h2>
            
            {/* Recording Mode */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Recording Mode</label>
              <div className="flex gap-2">
                {[
                  { value: 'screen', label: 'Screen', icon: Monitor },
                  { value: 'camera', label: 'Camera', icon: Camera },
                  { value: 'both', label: 'Both', icon: Monitor }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setRecordingMode(value)}
                    disabled={isRecording}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      recordingMode === value
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Device Settings Toggle */}
            <div className="mb-4">
              <button
                onClick={() => setShowDeviceSettings(!showDeviceSettings)}
                disabled={isRecording}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Settings size={16} />
                Device Settings
                <ChevronDown size={16} className={`transform transition-transform ${showDeviceSettings ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Device Settings */}
            {showDeviceSettings && (
              <div className="mb-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                {(recordingMode === 'camera' || recordingMode === 'both') && (
                  <DeviceSelector
                    devices={cameras}
                    selectedDevice={selectedCamera}
                    onSelect={setSelectedCamera}
                    label="Camera"
                    type="Camera"
                  />
                )}
                
                {audioEnabled && (
                  <DeviceSelector
                    devices={microphones}
                    selectedDevice={selectedMicrophone}
                    onSelect={setSelectedMicrophone}
                    label="Microphone"
                    type="Microphone"
                  />
                )}
              </div>
            )}

            {/* Audio Control */}
            <div className="mb-4">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                disabled={isRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  audioEnabled
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                Audio {audioEnabled ? 'On' : 'Off'}
              </button>
            </div>

            {/* Video Quality */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Video Quality</label>
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value)}
                disabled={isRecording}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="4K">4K (Ultra HD)</option>
              </select>
            </div>



            {/* Main Action Button */}
            <div className="flex gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                           disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg 
                           transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  {isProcessing ? 'Starting...' : 'Start Recording'}
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg 
                           transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Square size={20} />
                  Stop Recording
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              {!isRecording && (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Monitor size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScreenRecorder;