import { useState, useRef, useEffect } from 'react';
import LeftSideBar from '../components/LeftSideBar';
import RightSideBar from '../components/RightSideBar';
import BottomBar from '../components/BottomBar';
import MainContent from '../components/MainContent';



export default function RecorderPage() {

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allRecordings, setAllRecordings] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileSize = window.innerWidth < 640;
      setIsMobile(isMobileSize);
      
      // On larger screens, show sidebars by default
      if (!isMobileSize) {
        setIsLeftSidebarOpen(true);
        setIsRightSidebarOpen(true);
        setIsBottomDrawerOpen(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Trigger animations after component mounts
    setTimeout(() => setIsLoaded(true), 100);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
    // On mobile, close other sidebars when opening left
    if (isMobile && !isLeftSidebarOpen) {
      setIsRightSidebarOpen(false);
      setIsBottomDrawerOpen(false);
    }
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
    // On mobile, close other sidebars when opening right
    if (isMobile && !isRightSidebarOpen) {
      setIsLeftSidebarOpen(false);
      setIsBottomDrawerOpen(false);
    }
  };

  const toggleBottomDrawer = () => {
    setIsBottomDrawerOpen(!isBottomDrawerOpen);
    setAllRecordings(false);
    // On mobile, close other sidebars when opening bottom
    if (isMobile && !isBottomDrawerOpen) {
      setIsLeftSidebarOpen(false);
      setIsRightSidebarOpen(false);
    }
  };

  const showAllRecordings = () => {
    setAllRecordings(!allRecordings);
  };



  const openSidebarCount = (isLeftSidebarOpen ? 1 : 0) + (isRightSidebarOpen ? 1 : 0) + (isBottomDrawerOpen ? 1 : 0);


    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Initializing...');
    const [recordingTime, setRecordingTime] = useState(0);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [micEnabled, setMicEnabled] = useState(true);
  

    const [availableDevices, setAvailableDevices] = useState({
        cameras: [],
        microphones: []
    });
  
  
    const [selectedDevices, setSelectedDevices] = useState({
        camera: '',
        microphone: ''
    });
    
  
  
  
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
  
  
  
  
    // Initialize devices and camera on component mount ////////////////////////////////////////////////////////////
    useEffect(() => {
        initializeDevices();
  
    }, []);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
    // Reinitialize camera when device selection changes
    useEffect(() => {
      if (selectedDevices.camera || selectedDevices.microphone) {
        initializeCamera();
      }
    }, [selectedDevices]);
  
  
  
  
    // Timer for recording duration
    useEffect(() => {
      // if we are recording the video ,    this cases will account for the conditions where timer starts from the beginning and after pause
      if (isRecording && !isPaused) {
        timerRef.current = setInterval(() => {
          // then increase the counts by one second
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } 
      else {
        // if the video is paused then stop the timer.
        clearInterval(timerRef.current);
      }
      
      // this condition will work when the above two conditions doesn't and this will work when the recording is stopped and timer will be set to zero.
      return () => clearInterval(timerRef.current);
    }, [isRecording, isPaused]);

  
  
    const initializeDevices = async () => {
      try {
        // Get list of available devices,  
        //            (	unique ID to select device )     (which type of device is this)        (name of the device)                 ( Devices from the same hardware group (e.g. built-in mic + cam )) 
        // devices =  [ { deviceId  : "1",                kind : "videoinput",                 label  : "Integrated Webcam",         groupId : "abx" },
        //              { deviceId  : "2",                kind  : "audioinput",                label  : "Integrated Mic",            groupId : "abc" }
        // ]
        const devices = await navigator.mediaDevices.enumerateDevices();;
  
        // Filter out cameras from the available devices.
        const cameras = devices.filter(device => device.kind === 'videoinput');
        const microphones = devices.filter(device => device.kind === 'audioinput');
        
        // keep the list of cameras and microphone in Available Devices
        setAvailableDevices({ cameras, microphones });
        
        // If there are more than 2 cameras and no camera is selected.
        if (cameras.length > 0 && !selectedDevices.camera) {
          // select the first camera, deviceId is the reference to the camera
          setSelectedDevices(prev => ({ ...prev, camera: cameras[0].deviceId }));
        }
        if (microphones.length > 0 && !selectedDevices.microphone) {
          setSelectedDevices(prev => ({ ...prev, microphone: microphones[0].deviceId }));
        }
        
        await initializeCamera();
      } 
      
      catch (err) {
        console.error('Error initializing devices:', err);
        setError('Failed to initialize media devices');
      }
    };
  
  
    const initializeCamera = async () => {
      try {
        // streamRef.current contains the reference of the selected devices, so this line will stop recording from the previously selected the camera/mic.
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
  
        const constraints = {
          video: cameraEnabled ? {               // keep the id of the selected camera exactly as it is in the device id if the camera is enabled
            deviceId: selectedDevices.camera ? { exact: selectedDevices.camera } : undefined, // undefined if no camera is selected and that will happen when there is no camera attached to the device bcoz in the above initializeDevices function we have selected the first camera that is the device for recording
            width: { ideal: 1280 },           // ideal: You're requesting a video stream that tries to be 1280x720 (HD), if available.
            height: { ideal: 720 },           // It won’t fail if the exact resolution isn’t available—it will fall back to the closest supported size
  
            frameRate: { ideal: 30 }          // frame rate represents number of frames displayed per second
          } : false,    
                                // false when the permission to access the devices is denied.
  
          audio: micEnabled ? {
            deviceId: selectedDevices.microphone ? { exact: selectedDevices.microphone } : undefined,
            echoCancellation: true,      //  Reduces echo from your own speaker being picked up by the mic. Great for video calls.
            noiseSuppression: true,      //  Removes background noise like fan or keyboard sounds.
            autoGainControl: true,       //  Automatically adjusts input volume for consistent audio levels.
            sampleRate: 44100            //  Sets the preferred audio sample rate (44100 Hz is CD quality).
          } : false
        };
  
        // store the reference of the selected devices in stream
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          // keep the reference of the selected devices in the current of streamRef
          streamRef.current = stream;
  
          // videoRef.current -> .current (it is a react property that comes from the useRef hook) represents the reference of the devices (camera/mic) which is being used currently to record the video. This device's reference comes from the ref that is being assigned in the video tag on the 543 line.
          // .srcObject comes from the video tag, srcObject represents the devices (camera/mic) that is being currently used for recording.
          if (videoRef.current) {
            videoRef.current.srcObject = stream; // setting the devices for the recording
          }
          setStatus('Ready to record');
          setError('');
      } 
      catch (err) {
          console.error('Error accessing media devices:', err);
          setError(`Failed to access camera/microphone: ${err.message}`);
          setStatus('Media access failed');
      }
    };
  
  
    const toggleCamera = async () => {
      setCameraEnabled(!cameraEnabled);
      
      // If there is any selected device (camera/mic) then
      if (streamRef.current) {
        // get the selected camera
        const videoTrack = streamRef.current.getVideoTracks()[0];
        // videoTrack represents the camera, so we are disabling the camera
        if (videoTrack) {
          videoTrack.enabled = !cameraEnabled;
        }
      }
      
      // If turning camera off during recording, we need to reinitialize
      if (!cameraEnabled) {
        await initializeCamera();
      }
    };
  
  
    const toggleMicrophone = async () => {
      setMicEnabled(!micEnabled);
      
      if (streamRef.current) {
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !micEnabled;
        }
      }
      
      // If turning microphone off during recording, we need to reinitialize
      if (!micEnabled) {
        await initializeCamera();
      }
    };
  
  
    const startRecording = () => {
  
      // If no device ( camera/mic ) is selected return error.
      if (!streamRef.current) {
        setError('Camera not initialized');
        return;
      }
  
      chunksRef.current = [];
      
      // MediaRecorder options for better quality
      const options = {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecorder: 2500000, // 2.5 Mbps
        audioBitsPerSecond: 128000   // 128 kbps
      };
  
      try {
        // Creating a new recording session with some conditions that are present in options and recording it.
        mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
      } 
      catch (err) {
        // If it fails with our conditions then retry with the default ones.
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      }
  
      // The data that is recorded by this setup is passed as an event and when the size is more than zero it is stored in chunksRef
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
  
      mediaRecorderRef.current.onstop = () => {
        // the chunks that were stored in the chunksRef will get stiched into one single video.
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        // creating the url for the video.
        const url = URL.createObjectURL(blob);
        // creating the timestamp for the video.
        const timestamp = new Date().toLocaleString();
        
        const newRecording = {
          id: Date.now(),       // the id of the video is today's date
          url: url,             // setting the url for the recording as the url created by stitching.
          blob: blob,           // storing the stiched blob here
          timestamp: timestamp, 
          duration: recordingTime,
          size: blob.size         
        };
        
        setRecordings(prev => [...prev, newRecording]);    // adding the new recording to the list of recorded videos.
        setStatus('Recording saved successfully');
        setRecordingTime(0);
      };
  
      mediaRecorderRef.current.onpause = () => {
        setStatus('Recording paused');
      };
  
      mediaRecorderRef.current.onresume = () => {
        setStatus('Recording resumed');
      };
  
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setStatus('Recording in progress...');
    };
  
  
    const pauseRecording = () => {
      // if there is a recording set up and it is recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        // then pause the video
        mediaRecorderRef.current.pause();  
        setIsPaused(true);
      }
    };
  
  
    const resumeRecording = () => {
      // if there is a recording set up and the state is paused
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        // then resume the video
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      }
    };

  
    const stopRecording = () => {
      // if there is a recording set up and the state is inactive ( inactive refers to the state when the recording is stopped or before recording starts )
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        // stop the recording
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setIsPaused(false);
      setStatus('Processing recording...');
    };
  
  
    const downloadRecording = (recording) => {
      const a = document.createElement('a');               // 1. Create a link (<a>) element
      a.href = recording.url;                              // 2. Set the href to the Blob URL
      a.download = `recording_${recording.id}.webm`;       // 3. Set the file name for the download
      a.click();                                           // 4. Programmatically click the link to trigger the download
    };
  
  
    const playRecording = (recording) => {
      // Creates a video element in javascript similar to <video/> tag in html.
      const video = document.createElement('video');
      video.src = recording.url;     // setting url of the recording as the source of the video 
      video.controls = true;         // to add the controls in the video player
      video.style.width = '100%';    // take 100% width of the elemnent in which the video is present in 
      video.style.borderRadius = '8px';  
      video.play();                 // play the video when the component opens on the user screen
      
      // Create a modal-like overlay, (this is the parent container for the video element)
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
      `;
      
  
      const container = document.createElement('div');
      container.style.cssText = `
        max-width: 800px;
        width: 100%;
        background: white;
        border-radius: 12px;
        padding: 20px;
      `;
      
  
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.cssText = `
        margin-top: 10px;
        padding: 8px 16px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      `;
      

      // when the user clicks on close button remove the overlay container
      closeBtn.onclick = () => {
        document.body.removeChild(overlay);
        video.pause();
      };
      
  
      // adding video and close button inside the container and container inside the overlay and overlay in the document body (body represents hmtl <body/>).
      container.appendChild(video);
      container.appendChild(closeBtn);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
      
      // When you click inside the overlay and not on the part in which video is present then this overlay will be closed and the video will be paused.
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          video.pause();
        }
      };
    };
  
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // padstart --  to add 06 seconds instead of 6 to the timer.
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
      // take only first two digits after the decimal.
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  
  


  return (
    <div className=" bg-black relative    playfair-font ">
      {/* Overlay - Only on mobile and only when at least one sidebar is open */}
      {isMobile && openSidebarCount > 0 && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={() => {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
            setIsBottomDrawerOpen(false);
          }}
        />
      )}


      <MainContent     isMobile={isMobile}      isLoaded={isLoaded}     toggleLeftSidebar={toggleLeftSidebar}    toggleRightSidebar={toggleRightSidebar}     videoRef={videoRef}   toggleBottomDrawer={toggleBottomDrawer}     error={error}   isRecording={isRecording}    streamRef={streamRef}
                       isPaused={isPaused}      resumeRecording={resumeRecording}     pauseRecording={pauseRecording}      stopRecording={stopRecording}     toggleCamera={toggleCamera}      cameraEnabled={cameraEnabled}    micEnabled={micEnabled}     toggleMicrophone={toggleMicrophone}    
                       status={status}          formatTime={formatTime}      recordingTime={recordingTime}      startRecording={startRecording}       
      />

      <LeftSideBar     isMobile={isMobile}      isLoaded={isLoaded}     isLeftSidebarOpen={isLeftSidebarOpen}             toggleLeftSidebar={toggleLeftSidebar}      setIsLeftSidebarOpen={setIsLeftSidebarOpen} />

      <RightSideBar    isMobile={isMobile}      isLoaded={isLoaded}     isRightSidebarOpen={isRightSidebarOpen}           toggleRightSidebar={toggleRightSidebar}    setIsRightSidebarOpen={setIsRightSidebarOpen}   selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} availableDevices={availableDevices}/>

      <BottomBar       isMobile={isMobile}      allRecordings={allRecordings}       showAllRecordings={showAllRecordings}    isLoaded={isLoaded}     isBottomDrawerOpen={isBottomDrawerOpen}           toggleBottomDrawer={toggleBottomDrawer}    recordings={recordings}     formatTime={formatTime}   formatFileSize={formatFileSize}   playRecording={playRecording}   downloadRecording={downloadRecording}/>

    </div>
  );
}