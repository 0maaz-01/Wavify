import { useState } from "react";
import useLogin from "../hooks/useLogin";
import Columns from "../components/Columns"
import Wavify from "../components/Wavify";


const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };





  return (
    <div className="font-serif min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>



      <div className="playfair-font  relative lg:border lg:border-white/15 lg:bg-black/20 backdrop-blur-xl flex flex-col lg:flex-row w-full max-w-6xl mx-auto lg:rounded-2xl shadow-2xl overflow-hidden  transition-transform duration-300">


        {/* IMAGE SECTION */}
      <div className="flex items-center justify-center lg:w-1/2 ">
        <div className="border flex lg:w-full lg:max-w-none sm:min-h-[700px] lg:flex h-full  items-center justify-center max-w-[520px] sm:max-w-[600px] border-white/15 rounded-2xl lg:border-0 lg:rounded-none mt-[70px]  lg:mt-[0px]   mb-[100px] lg:mb-0 order:1 lg:order-2  w-full  bg-gradient-to-br from-yellow-900/10 to-purple-900/10  relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 to-orange-700/15"></div>
          
          
          <div className="relative z-10 max-w-lg p-8 text-center">
            <div className="relative aspect-square max-w-sm mx-auto mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-gray-400/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-yellow-500/10 to-purple-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                <img alt="Professional female podcast host with headphones and a microphone, seated in front of a digital world map background, ready to record." className="w-96 rounded-full" src="m.jpg"/>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Give Your Voice a Stage
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                  Record high-quality podcasts effortlessly, share your stories, and connect with your audience—anytime, anywhere.
              </p>
            </div>

          </div>
        </div>
      </div>


      <div className="flex items-center justify-center lg:w-1/2 ">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-full  mb-[100px] sm:min-h-[600px]  max-w-[520px] sm:max-w-[600px] p-6 sm:p-12 flex flex-col relative border border-white/15 rounded-2xl lg:border-0 lg:rounded-none">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-purple-500/5 rounded-l-2xl"></div>
          
          <div className="relative z-10">
            {/* LOGO */}
            <Wavify/>

            {/* ERROR MESSAGE DISPLAY */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm backdrop-blur-sm animate-shake">
                <span>{error.response?.data?.message || "Login failed"}</span>
              </div>
            )}

            <div className="w-full">
              <div onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-white/60 text-lg">
                    Sign in to your account to continue your podcast journey
                  </p>
                </div>

                <div className="space-y-6">

                  <Columns  text="Email"   type="email"    holdervalue="hello@example.com"      value={loginData.email}      func={(e) => setLoginData({ ...loginData, email: e.target.value })}/>

                  <Columns  text="Password"   type="password"    holdervalue="••••••••"      value={loginData.password}      func={(e) => setLoginData({ ...loginData, password: e.target.value })}/>


                  <div className="flex items-center justify-center mt-8">
                    <button
                      type="submit"
                      onClick={handleLogin}
                      className="relative px-12 py-4 bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800 hover:opacity-90 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 group overflow-hidden"
                      disabled={isPending}
                    >
                      <span className="relative z-10">
                        {isPending ? "Signing in..." : "Sign In"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {isPending && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-white/60">
                      Don't have an account?{" "}
                      <a href="/signup" className="text-red-500 hover:text-orange-600 transition-colors font-medium hover:underline">
                        Create one
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    </div>
  );
};

export default LoginPage;