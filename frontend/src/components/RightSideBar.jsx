
import Button from "./Button";

export default function RightSideBar({isRightSidebarOpen, isMobile, isLoaded, toggleRightSidebar, setIsRightSidebarOpen, selectedDevices, setSelectedDevices, availableDevices}) {


  return (

      <div className={`fixed right-0 top-0 h-full w-64       bg-black text-white border-l-2 border-amber-600         shadow-lg transform transition-all duration-700 ease-out z-50 ${
        isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } ${!isMobile && isLoaded && isRightSidebarOpen ? 'translate-x-0 opacity-100' : !isMobile && isRightSidebarOpen ? 'translate-x-full opacity-0' : 'opacity-100'}`}>
        
        {/* Right Sidebar Header */}
        <div className="flex items-center justify-between p-4  ">
          <h2 className="text-xl font-semibold ">Actions</h2>
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

                  <div className=" bg-black rounded-lg mb-6">

                          <div>
                              <label className="block text-base font-medium  mb-2">
                                  Camera
                              </label>
                                  <select
                                    value={selectedDevices.camera}   // jo selected camera h vo display kro
                                    onChange={(e) => setSelectedDevices(prev => ({ ...prev, camera: e.target.value }))}  // agr user select kre value ko to use replace kro
                                    className="w-full  p-2 border  border-gray-300 rounded-lg focus:ring-2    hover:ring-amber-600 hover:ring-2 hover:border-0       focus:border-transparent"
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


                              <div className=" bg-black rounded-lg">
                                <div>
                                  <label className="block text-base font-medium  mb-2">
                                    Microphone
                                  </label>
                                  <select
                                    value={selectedDevices.microphone}
                                    onChange={(e) => setSelectedDevices(prev => ({ ...prev, microphone: e.target.value }))}
                                    className="w-full  p-2 border  border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 hover:ring-amber-600 hover:ring-2 hover:border-0 focus:border-transparent"
                                  >
                                    {availableDevices.microphones.map(device => (
                                      <option className="bg-black max-w-[200px]" key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                            </div>
                          
              </li>
         
          </ul>
        </nav>
      </div>

  );
}