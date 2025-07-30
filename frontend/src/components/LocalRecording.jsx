import { useEffect, useRef, useState } from 'react';

const LocalRecording = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const dirHandleRef = useRef(null);
  const chunkIndexRef = useRef(0);

  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState('');

  // Get video input devices
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videos = devices.filter((d) => d.kind === 'videoinput');
      setVideoDevices(videos);
      if (videos.length > 0) {
        setSelectedVideoDeviceId(videos[0].deviceId);
      }
    });
  }, []);

  const startRecording = async () => {
    try {
      // Ask user to select a directory
      const dirHandle = await window.showDirectoryPicker();
      dirHandleRef.current = dirHandle;

      // Request user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoDeviceId },
        audio: true,
      });

      mediaStreamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8,opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunkIndexRef.current = 0;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          try {
            const index = chunkIndexRef.current++;
            const fileName = `video-chunk-${index}.webm`;

            const fileHandle = await dirHandleRef.current.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(event.data);
            await writable.close();
          } catch (err) {
            console.error('Failed to write chunk:', err);
          }
        }
      };

      mediaRecorder.start(10000); // Record in 10-second chunks
    } catch (err) {
      console.error('Recording error:', err);
      alert('Error: Please ensure you are using Chrome/Edge and allow permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label htmlFor="videoDevice" className="mr-2 font-medium">Video Device:</label>
        <select
          id="videoDevice"
          value={selectedVideoDeviceId}
          onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
          className="p-2 border rounded"
        >
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full max-w-md border shadow rounded"
      />

      <div className="space-x-2">
        <button
          onClick={startRecording}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Each 10-second video chunk is saved to your selected folder.
        If the browser crashes or is closed, only the current chunk is lost.
      </p>
    </div>
  );
};

export default LocalRecording;