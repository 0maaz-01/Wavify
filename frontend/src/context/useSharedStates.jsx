import { useState, useRef, useContext, createContext } from 'react';
import useUploadChunks from '../hooks/useUploadChunks';


const SharedStatesContext = createContext(); 

export const SharedStatesProvider = ({ children }) => {

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allRecordings, setAllRecordings] = useState(false);



  const openSidebarCount = (isLeftSidebarOpen ? 1 : 0) + (isRightSidebarOpen ? 1 : 0) + (isBottomDrawerOpen ? 1 : 0);



    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [error2, setError] = useState('');
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
    const tempRef = useRef([]);


    const { mutate: uploadChunk, isPending, isError, error, isSuccess } = useUploadChunks();

    const recordingTimeRef = useRef(recordingTime);

  
  


  return (
      <SharedStatesContext.Provider
          value={{
              isLeftSidebarOpen, setIsLeftSidebarOpen,
              isRightSidebarOpen, setIsRightSidebarOpen,
              isBottomDrawerOpen, setIsBottomDrawerOpen,
              isMobile, setIsMobile, isLoaded, setIsLoaded,
              allRecordings, setAllRecordings,
              openSidebarCount, recordings, setRecordings,
              isRecording, setIsRecording, 
              isPaused, setIsPaused, 
              error2, setError, status, setStatus, 
              recordingTime, setRecordingTime, 
              cameraEnabled, setCameraEnabled,
              micEnabled, setMicEnabled,
              availableDevices, setAvailableDevices,
              selectedDevices, setSelectedDevices,
              videoRef, mediaRecorderRef, streamRef,
              chunksRef, timerRef, tempRef,
              uploadChunk, isPending,
              isError, error, isSuccess,
              recordingTimeRef
          }}
      >
          {children}
      </SharedStatesContext.Provider>
  );
}


export const SharedStatesData = () => useContext(SharedStatesContext);