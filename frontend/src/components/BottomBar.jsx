import { Play, Download  } from 'lucide-react';
import Button from './Button';



export default function BottomBar({ isMobile, isLoaded, allRecordings, showAllRecordings, isBottomDrawerOpen, toggleBottomDrawer, recordings, formatTime, formatFileSize, playRecording,   downloadRecording}) {

  return (
    <div className=" relative    playfair-font">

      {/* Bottom Drawer */}
      <div className={`fixed bottom-0 overflow-auto  left-0 right-0 h-60 bg-black border-t-amber-600 border-t-2 text-white shadow-lg transform transition-all duration-700 ease-out z-50 ${
        isBottomDrawerOpen ? 'translate-y-0' : 'translate-y-full'
      } ${!isMobile && isLoaded && isBottomDrawerOpen ? 'translate-y-0 opacity-100' : !isMobile && isBottomDrawerOpen ? 'translate-y-full opacity-0' : 'opacity-100'}
        ${allRecordings? "top-0 h-full translate-y-0  transform transition-all duration-700 ease-in" : "bottom-0 h-60"}
      `}>
        
        {/* Bottom Drawer Header */}
        <div className="flex items-center justify-between p-4  ">
          <Button func={showAllRecordings} icon="up"/>
          <h2 className="text-xl font-semibold   w-full text-center   ">Recorded Videos</h2>
          <Button func={toggleBottomDrawer} icon="close"/>
        </div>

        {/* Bottom Drawer Content */}
        <div className="p-4  ">
          <div className="">
                {recordings.length === 0 ? (
                              <div className="text-center py-8 ">
                                No recordings yet. Start recording to create your first video!
                              </div>
                            ) : (
                              <div className="space-y-3 ">
                                {recordings.map((recording) => (
                                  <div
                                    key={recording.id}
                                    className=" rounded-lg p-4 flex items-center  justify-between bg-black-200  transition-colors"
                                  >
                                    <div className="flex-1">
                                      <div className="font-semibold ">
                                        Recording {recording.id}
                                      </div>
                                      <div className="text-sm ">
                                        {recording.timestamp} • {formatTime(recording.duration)} • {formatFileSize(recording.size)}
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => playRecording(recording)}
                                        className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                      >
                                        <Play className="w-4 h-4" />
                                      </button>
                                      
                                      
                                      <button
                                        onClick={() => downloadRecording(recording)}
                                        className="flex items-center gap-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
          </div>
        </div>
      </div>

    </div>
  );
}