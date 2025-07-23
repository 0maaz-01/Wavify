import { Camera, Square, Play, AlertCircle, Pause, CameraOff, Mic, MicOff, FastForward  } from 'lucide-react';
import Button from './Button';


export default function MainContent({isMobile,  isLoaded,  toggleLeftSidebar,  toggleRightSidebar,  videoRef,  toggleBottomDrawer,  error,  isRecording,  streamRef,  resumeRecording,
                                     pauseRecording,  stopRecording,  toggleCamera,   cameraEnabled,   micEnabled,  toggleMicrophone,  status,  formatTime, recordingTime,
                                     startRecording, isPaused
                                    }) {

    const buttons = [
      { 
        id: 1,
        func: startRecording,
        disable: isRecording || !streamRef.current,
        icon: <Play className="w-4 h-4   "/>,
        clas: "bg-black-100  disabled:text-black  hover:text-black  text-[#40E0D0] group-hover:text-black  disabled:bg-[#40E0D0]  disabled:hover:scale-100  hover:bg-[#40E0D0] group transition-all duration-200 transform hover:scale-105  "
      },
      {
        id: 2,
        func: isPaused ? resumeRecording : pauseRecording,
        disable: "",
        icon: (isPaused ? <FastForward className="w-4 h-4   " /> : <Pause className="w-4 h-4   " />),
        clas: "bg-black-100  text-yellow-300  hover:text-black hover:bg-yellow-300  transition-all duration-200 transform hover:scale-105"
      },
      {
        id: 3,
        func: stopRecording,
        disable: !isRecording,
        icon: <Square className="w-4 h-4  " />,
        clas: "bg-black-100  text-[#FF0000]  hover:text-white  hover:bg-red-600   transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
      },
      {
        id: 4,
        func: toggleCamera,
        disable: isRecording || !streamRef.current,
        icon: cameraEnabled ?   <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />,
        clas: ` transition-colors  transition-all duration-500 transform ${
                                  cameraEnabled 
                                    ? 'bg-black-100 text-white hover:bg-white hover:text-black ' 
                                    : 'bg-white text-black '
                                }`
      },
      {
        id: 5,
        func: toggleMicrophone,
        disable: "",
        icon: micEnabled ?   <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />,
        clas: ` transition-colors ${
                                  micEnabled 
                                    ? 'bg-black-100  text-[#00FF00]  hover:text-black    hover:bg-[#00FF00]' 
                                    : 'bg-[#00FF00]   text-black    '
                                }`
      },
    ];
                          
         





  return (
      <div className="">
        {/* Top Bar */}
        <header className={`bg-black    shadow-sm border-b  sticky top-0 z-30 transform transition-all duration-700 ease-out ${
          !isMobile && isLoaded 
            ? 'translate-y-0 opacity-100' 
            : !isMobile 
            ? '-translate-y-4 opacity-0' 
            : 'translate-y-0 opacity-100'
        }`}>
          <div className="flex items-center px-4 py-3 ">
            <Button func={toggleLeftSidebar} icon="Menu"/>
            <h1 className="text-xl font-semibold flex-1">Dashboard</h1>
            <Button func={toggleBottomDrawer} icon="up"/>
            <Button func={toggleRightSidebar} icon="settings"/>
          </div>
        </header>

        {/* Main Content Area */}
        <div className={`  transform transition-all duration-700 ease-out ${
          !isMobile && isLoaded 
            ? 'opacity-100' 
            : !isMobile 
            ? 'opacity-0' 
            : 'opacity-100'
        }`}>
                <div className="   ">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-[#000000] backdrop-blur-lg  rounded-2xl shadow-2xl overflow-hidden">

                        {/* Main Content */}
                        <div className="p-6">
                          {/* If there is an error than this will show the error. */}
                          {error && (
                            <div className="mb-6 p-4 bg-red-700 border border-red-200 rounded-lg flex items-center gap-3">
                              <AlertCircle className="w-5 h-5 text-white" />
                              <span className="text-white">{error}</span>
                            </div>
                          )}


                          {/* Video Preview */}
                          <div className="mb-6">
                            <video
                              ref={videoRef}
                              autoPlay
                              muted
                              playsInline            //  [#1f1e1e]
                              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg bg-[#1f1e1e]     scale-x-[-1]"
                            />
                          </div>

                          {/* Recording Controls */}
                          <div className="flex flex-col items-center gap-4 mb-6 ">

                            {/* Device Controls    [#282727]*/}
                            <div className=" flex flex-wrap gap-2 sm:gap-4 justify-center bg-[#1f1e1e] border-white/10 border-1 pl-4 pr-4 p-2 rounded-full">

                                {buttons.map((info, index) => (
                                    <button
                                      key={index}
                                      onClick={info.func}
                                      // if the user is recording or the camera/min are not selected then disable the Start Recording Button 
                                      disabled={info.disable}
                                      className={`flex items-center   border-1 border-white/20   cursor-pointer      px-2.5 py-2.5  sm:px-4 sm:py-4 rounded-full   ${info.clas}`}
                                    >
                                      {info.icon}
                                    </button>
                                ))}

                            </div>

                            {/* Status and Timer */}
                            <div className="text-center">
                              <div className={`text-lg font-semibold ${
                                isRecording ? (isPaused ? 'text-yellow-600' : 'text-[#40E0D0]') : 'text-green-600'
                              }`}>
                                {status}
                              </div>
                              {isRecording && (
                                <div className={`text-2xl font-mono mt-2 ${isPaused ? 'text-yellow-600' : 'text-[#40E0D0]'}`}>
                                  {formatTime(recordingTime)} {isPaused && '(Paused)'}
                                </div>
                              )}
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>
        </div>
      </div>
  );
}