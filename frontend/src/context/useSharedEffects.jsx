import { useEffect } from 'react';
import { SharedStatesData } from './useSharedStates';
import { FunctionData } from './Function';


export default function useSharedEffects() {

  const { setIsMobile, setIsLeftSidebarOpen, setIsRightSidebarOpen, setIsBottomDrawerOpen, setIsLoaded, selectedDevices, isRecording, isPaused, timerRef, setRecordingTime   } = SharedStatesData();
  const { initializeDevices, initializeCamera } = FunctionData();


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

}