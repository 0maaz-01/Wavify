
import Button from "./Button";
import { reassembleAndDownload, clearAllChunks, clearDatabase   } from "../lib/db";
import { Button2 } from "./Button2";


export default function RightSideBar({isRightSidebarOpen, isMobile, isLoaded, toggleRightSidebar, setIsRightSidebarOpen, selectedDevices, setSelectedDevices, availableDevices}) {



  /*const Button2 = ({text}) => (
      <button
        class="group relative px-6 py-3 mt-6 rounded-xl bg-zinc-900 text-amber-300 font-bold tracking-widest uppercase text-sm border-b-4 border-amber-400/50 border-amber-400 transition-all duration-300 ease-in-out hover:text-amber-200  shadow-[0_15px_30px_rgba(251,191,36,0.25)] active:border-b-0 active:translate-y-1"
      >
        <span class="flex items-center gap-3 relative z-10">

              {text}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 transition-all duration-300 group-hover:translate-x-1"
          >
            <path
              d="M12 4L10.6 5.4L16.2 11H4V13H16.2L10.6 18.6L12 20L20 12L12 4Z"
            ></path>
          </svg>
        </span>
        <div
          class="absolute -inset-1 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 blur-2xl group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 group-hover:opacity-100"
        ></div>
      </button>
  )*/

  /*const Button2 = ({text, func}) => (
      <button  onClick={func}
        className="group relative px-6 py-3 mt-8 rounded-xl bg-zinc-900 text-amber-300 font-bold tracking-widest uppercase text-sm border-b-4 border-amber-400/50 border-amber-400 transition-all duration-300 ease-in-out hover:text-amber-200  shadow-[0_15px_30px_rgba(251,191,36,0.25)] active:border-b-0 active:translate-y-1"
      >
        <span className="flex items-center gap-3 relative z-10">

              {text}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 transition-all duration-300 group-hover:translate-x-1"
          >
            <path
              d="M12 4L10.6 5.4L16.2 11H4V13H16.2L10.6 18.6L12 20L20 12L12 4Z"
            ></path>
          </svg>
        </span>
        <div
          className="absolute -inset-1 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 blur-xl transition-all duration-300 -z-10 opacity-100"
        ></div>
      </button>
  )*/






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

                  <Button2  text="Download"        func={reassembleAndDownload}/>
                  <Button2  text="Remove Chunk"    func={clearAllChunks}/>
                  <Button2  text="Empty Storage"   func={clearDatabase}/>
              </li>
         
          </ul>
        </nav>
      </div>

  );
}