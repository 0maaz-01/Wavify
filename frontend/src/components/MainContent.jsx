import { Camera, Square, Play, AlertCircle, Pause, CameraOff, Mic, MicOff, FastForward  } from 'lucide-react';
import Button from './Button';
import useLogout from '../hooks/useLogout';
import useGenerateFolder from '../hooks/useGenerateFolder';
import Loader from './Loader';
import { FunctionData } from '../context/Function';
import { SharedStatesData } from '../context/useSharedStates';


export default function MainContent() {


  const { logoutMutation } = useLogout();
  const { generateFolderMutation, isPending, error } = useGenerateFolder();

  const { isMobile, isRecording, isPaused, isLoaded, videoRef, error2, streamRef, cameraEnabled, 
            micEnabled, status, recordingTime,
        } = SharedStatesData();

  const { pauseRecording, stopRecording,  toggleCamera, toggleMicrophone, formatTime, startRecording, toggleLeftSidebar, 
          toggleRightSidebar, toggleBottomDrawer, resumeRecording } = FunctionData();


  const createFolder = async () => {
    try {
      await generateFolderMutation({ name: "New Folder" });
      startRecording(); // ✅ only runs after folder is created
    } 
    catch (err) {
      console.error("Error creating folder", err);
    }
  };



    const buttons = [
      { 
        id: 1,
        func: createFolder,
        disable: isRecording || !streamRef.current,
        icon: <Play className="w-4 h-4   "/>,
        clas: "     group-hover:text-black  disabled:hidden   hover:bg-[#40E0D0] group transition-all duration-200 transform hover:scale-105  "
      },
      {
        id: 2,
        func: isPaused ? resumeRecording : pauseRecording,
        disable: "",
        icon: (isPaused ? <FastForward className="w-4 h-4   " /> : <Pause className="w-4 h-4   " />),
        clas: "       transition-all duration-200 transform hover:scale-105"
      },
      {
        id: 3,
        func: stopRecording,
        disable: !isRecording,
        icon: <Square className="w-4 h-4  " />,
        clas: "        transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
      },
      {
        id: 4,
        func: toggleCamera,
        disable: isRecording || !streamRef.current,
        icon: cameraEnabled ?   <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />,
        clas: ` transition-colors  transition-all duration-500 transform ${ cameraEnabled ? '    ' : ' text-black '}`
      },
      {
        id: 5,
        func: toggleMicrophone,
        disable: "",
        icon: micEnabled ?   <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />,
        clas: ` transition-colors ${ micEnabled ? '      ' : ' text-black' }`
      },
    ];
                          
         


  return (
      <div className="">
        {/* Top Bar */}
        <header className={` bg-[#262626]   shadow-sm border-b border-white/20 sticky top-0 z-30 transform transition-all duration-700 ease-out ${
          !isMobile && isLoaded 
            ? 'translate-y-0 opacity-100' 
            : !isMobile 
            ? '-translate-y-4 opacity-0' 
            : 'translate-y-0 opacity-100'
        }`}>
          <div className="flex items-center px-4 py-3 ">
            <Button func={toggleLeftSidebar} icon="Menu"/>
            <h1 className="text-xl font-semibold flex-1"></h1>
            <Button func={logoutMutation} icon="logout"/>
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
                          {error2 && (
                            <div className="mb-6 p-4 bg-red-700 border border-red-200 rounded-lg flex items-center gap-3">
                              <AlertCircle className="w-5 h-5 text-white" />
                              <span className="text-white">{error2}</span>
                            </div>
                          )}


                          <div className="mb-6  relative"> 
                            <video
                              ref={videoRef}
                              autoPlay
                              muted
                              playsInline
                              className="w-full max-w-7xl mx-auto rounded-lg shadow-lg bg-[#1f1e1e] scale-x-[-1]"
                            />

                            {(isPending || error) && (
                              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/10 bg-opacity-50 rounded-lg">
                                  {isPending     &&      <Loader  text="Creating Folder for Podcast" />}
                                  {error    &&           <Loader isError="true"   text = "Something went wrong"/>}
                              </div>
                            )}
                          </div>


                          {/* Recording Controls */}
                          <div className="flex flex-col items-center gap-4 mb-6 ">

                            {/* Device Controls    [#282727]*/}
                            <div className=" bg-[#1f1e1e]    flex flex-wrap gap-2 sm:gap-4 justify-center  border-white/10 border-1 pl-4 pr-4 p-2 rounded-full">

                                {buttons.map((info, index) => (
                                    <button
                                      key={index}
                                      onClick={info.func}
                                      // if the user is recording or the camera/min are not selected then disable the Start Recording Button 
                                      disabled={info.disable}
                                      className={`flex items-center disabled:text-black   disabled:bg-white backdrop-blur-lg  bg-black-100  text-white hover:text-black hover:bg-white   border-1 border-white/20   cursor-pointer      px-2.5 py-2.5  sm:px-4 sm:py-4 rounded-full   ${info.clas}`}
                                    >
                                      {info.icon}
                                    </button>
                                ))}

                            </div>

                            {/* Status and Timer */}
                            <div className="text-center text-white">
                              <div>
                                {status}
                              </div>
                              {isRecording && (
                                <div className={`text-2xl font-mono mt-2 `}>
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