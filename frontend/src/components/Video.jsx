import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, Download, Trash2, Play, Pause } from 'lucide-react';

const Video = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [currentRecordingTime, setCurrentRecordingTime] = useState(0);
  const [error, setError] = useState('');
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunkSaveIntervalRef = useRef(null);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError('');
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('Error accessing camera:', err);
    }
  };

  // Save current chunks as a video
  const saveCurrentChunks = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toLocaleString();
      const newVideo = {
        id: Date.now(),
        url,
        blob,
        timestamp,
        duration: currentRecordingTime,
        isPartial: isRecording
      };
      
      setSavedVideos(prev => [...prev, newVideo]);
      setRecordedChunks([]);
      return newVideo;
    }
    return null;
  };

  // Start recording
  const startRecording = async () => {
    if (!streamRef.current) {
      await initializeCamera();
    }

    if (streamRef.current) {
      try {
        const mediaRecorder = new MediaRecorder(streamRef.current, {
          mimeType: 'video/webm;codecs=vp8,opus'
        });
        
        mediaRecorderRef.current = mediaRecorder;
        setRecordedChunks([]);
        setCurrentRecordingTime(0);

        // Collect chunks
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks(prev => [...prev, event.data]);
          }
        };

        // Start recording and request data every 2 seconds
        mediaRecorder.start(2000);
        setIsRecording(true);
        
        // Timer for recording duration
        timerRef.current = setInterval(() => {
          setCurrentRecordingTime(prev => prev + 1);
        }, 1000);

        // Auto-save chunks every 10 seconds
        chunkSaveIntervalRef.current = setInterval(() => {
          saveCurrentChunks();
        }, 10000);

        setError('');
      } catch (err) {
        setError('Failed to start recording');
        console.error('Recording error:', err);
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear intervals
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (chunkSaveIntervalRef.current) {
        clearInterval(chunkSaveIntervalRef.current);
      }

      // Save final chunks
      setTimeout(() => {
        saveCurrentChunks();
      }, 100);
    }
  };

  // Download video
  const downloadVideo = (video) => {
    const a = document.createElement('a');
    a.href = video.url;
    a.download = `recording_${video.id}.webm`;
    a.click();
  };

  // Delete video
  const deleteVideo = (videoId) => {
    setSavedVideos(prev => {
      const updated = prev.filter(v => v.id !== videoId);
      // Clean up object URLs
      const videoToDelete = prev.find(v => v.id === videoId);
      if (videoToDelete) {
        URL.revokeObjectURL(videoToDelete.url);
      }
      return updated;
    });
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera();
    
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (chunkSaveIntervalRef.current) {
        clearInterval(chunkSaveIntervalRef.current);
      }
      // Clean up object URLs
      savedVideos.forEach(video => URL.revokeObjectURL(video.url));
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Progressive Video Recorder</h1>
        
        {/* Camera Preview */}
        <div className="relative mb-6">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full max-w-2xl mx-auto rounded-lg bg-black"
            style={{ aspectRatio: '16/9' }}
          />
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              REC {formatTime(currentRecordingTime)}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Recording controls */}
        <div className="flex justify-center gap-4 mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Camera size={20} />
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Square size={20} />
              Stop Recording
            </button>
          )}
        </div>

        {/* Auto-save info */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
          <p className="text-sm">
            <strong>Auto-save enabled:</strong> Video chunks are automatically saved every 10 seconds while recording. 
            Even if recording stops unexpectedly, your footage will be preserved.
          </p>
        </div>
      </div>

      {/* Saved Videos */}
      {savedVideos.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Videos</h2>
          
          <div className="space-y-4">
            {savedVideos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <video
                    src={video.url}
                    className="w-32 h-18 rounded object-cover"
                    controls={false}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Recording {video.id}
                      {video.isPartial && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          Partial
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{video.timestamp}</p>
                    <p className="text-sm text-gray-600">Duration: {formatTime(video.duration)}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadVideo(video)}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;