

const PageLoader = () => {


  return (
    <div className="playfair-font min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
    
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const duration = Math.random() * 3 + 2;
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${duration}s infinite ${Math.random() * 2}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          );
        })}
      </div>



  
      <div className="relative z-20 text-center px-8 max-w-lg">
          <div className="space-y-8">
            <div className="relative mx-auto w-32 h-32 mb-12">
             
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-700 via-purple-800 to-pink-800 animate-spin opacity-100 blur-lg "></div>
              
              <div className="absolute inset-4 rounded-full bg-black  shadow-2xl"></div>
              
              
            </div>

            {/* Title*/}
            <div className="space-y-4">
              <h1 className="flex text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-800 to-pink-800  animate-pulse">
                Wavify 
              </h1>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            </div>


          </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .blur-xs {
          filter: blur(2px);
        }
      `}</style>

    </div>
  );
};

export default PageLoader;