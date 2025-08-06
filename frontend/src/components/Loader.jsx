export default function Loader({ text, isError = false}) {
  
 
  if (isError) {
    return (
      <div className="playfair-font relative inline-block rounded-xl shadow-lg p-4 w-64 hover:shadow-xl">
        <div className="absolute inset-0 bg-red-900/40 backdrop-blur-lg rounded-xl flex items-center justify-center border border-red-400/30">
          <div className="flex flex-col items-center space-y-3">
            
            <div className="relative">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-white">{text}</p>
            </div>
          </div>
        </div>
        
        <div className="opacity-30">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10"></div>
          </div>
        </div>
      </div>
    );
  }

 
  return (
    <div className="playfair-font relative inline-block rounded-xl shadow-lg p-4 w-64 transform transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-black backdrop-blur-lg rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">

          <div className="relative">
              <div className="w-8 h-5"></div>
              <div className="absolute top-1 left-1 w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-white animate-pulse">{text}</p>
          </div>
        </div>
      </div>
      <div className="w-10 h-10 "/>
    </div>
  );
}