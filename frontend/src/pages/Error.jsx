import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';


export default function ErrorPage() {

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };



  return (
    <div className="min-h-screen  relative overflow-hidden     playfair-font ">

      <div className={`relative z-10 min-h-screen flex items-center justify-center px-4 transition-all duration-1000 opacity-100 translate-y-0`}>
        <div className="text-center max-w-2xl mx-auto">

          <div className=" relative">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-red-700 rounded-full shadow-2xl ">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
          </div>


          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
          </div>


          <div className="mb-8 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Something Went Wrong
            </h2>
          </div>


          <div className="flex flex-wrap sm:flex-row gap-4 justify-center items-center">
            <a  href="/podcast"
              className="cursor-pointer group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-800 to-red-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
            >
              <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Go Home
            </a>
            
            <button
              onClick={handleGoBack}
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 ease-out"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Go Back
            </button>

            <button
              onClick={handleRefresh}
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 ease-out"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>
          </div>


          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              If you are unable to solve it {" "}
              <a href="https://maazverse.com/contact" className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200">
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>


    </div>
  );
}