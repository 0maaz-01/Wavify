
import Button from "./Button";
import { reassembleAndDownload, clearDatabase   } from "../lib/db";
import { Button2 } from "./Button2";
import { Download, Trash2 } from "lucide-react";
import { SharedStatesData } from "../context/useSharedStates";
import { FunctionData } from "../context/Function";

export default function RightSideBar({}) {

  const { isRightSidebarOpen, isMobile, isLoaded, selectedDevices, setSelectedDevices, availableDevices
        } = SharedStatesData();
  
  const { toggleRightSidebar} = FunctionData();

  return (

      <div className={`fixed right-0 top-0 h-full w-64       bg-[#161616] text-white border-l border-white/20         shadow-lg transform transition-all duration-700 ease-out z-50 ${
        isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } ${!isMobile && isLoaded && isRightSidebarOpen ? 'translate-x-0 opacity-100' : !isMobile && isRightSidebarOpen ? 'translate-x-full opacity-0' : 'opacity-100'}`}>
        
        {/* Right Sidebar Header */}
        <div className="flex items-center justify-between p-4  ">
          <h2 className="text-xl font-semibold ">Settings</h2>
          <Button func={toggleRightSidebar} icon="close"/>
        </div>

        {/* Right Sidebar Navigation */}
        <nav className="mt-4 flex-1">
          <ul className="space-y-2 px-4">

              <li  className={`transform transition-all duration-500 ${
                !isMobile && isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : !isMobile 
                  ? 'translate-y-4 opacity-0' 
                  : 'translate-y-0 opacity-100'
              }`} style={{ 
                transitionDelay: !isMobile && isLoaded ? `${1* 100}ms` : '0ms' 
              }}>

                  <div className=" bg-[#161616] rounded-lg mb-6">
                      <div>
                          <label className="block text-base font-medium  mb-2">
                              Camera
                          </label>
                          <select
                              value={selectedDevices.camera}   // jo selected camera h vo display kro
                              onChange={(e) => setSelectedDevices(prev => ({ ...prev, camera: e.target.value }))}  // agr user select kre value ko to use replace kro
                              className="w-full bg-[#161616]  p-2 border   border-white/20      rounded-lg           "
                          >
                              {/*Available device ke cameras ke name ko display kro*/}
                              {availableDevices.cameras.map(device => (
                                  <option className="bg-black hover:bg-amber-50" key={device.deviceId} value={device.deviceId}>
                                      {/*Agr camera ka name h to use display kro vrna device id ke 8 index tk to display kro*/}
                                      {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                                  </option>
                              ))}
                          </select>
                      </div>
                  </div>


                  <div className=" bg-[#161616] rounded-lg">
                      <label className="block text-base font-medium  mb-2">
                          Microphone
                      </label>
                      <select
                          value={selectedDevices.microphone}
                          onChange={(e) => setSelectedDevices(prev => ({ ...prev, microphone: e.target.value }))}
                          className="w-full  p-2 border bg-[#161616] border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 hover:ring-amber-600 hover:ring-2 hover:border-0 focus:border-transparent"
                      >
                          {availableDevices.microphones.map(device => (
                              <option className="bg-black max-w-[200px]" key={device.deviceId} value={device.deviceId}>
                                  {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                              </option>
                          ))}
                      </select>
                  </div>

                  <Button2  text="Full Podcast"        func={reassembleAndDownload}        icon={<Download className="size-5"/>}/>
                  <Button2  text="Local Chunks"        func={clearDatabase}                icon={<Trash2   className="size-5"/>}/>
              </li>
         
          </ul>
        </nav>
      </div>

  );

}
