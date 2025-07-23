import { useState } from "react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp";
import Columns from "../components/Columns";
import Wavify from "../components/Wavify";


const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="playfair-font  min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br bg-black relative overflow-hidden">

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/40 to-gray-100/80 rounded-full opacity-40 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-300/40 to-orange-300/80 rounded-full opacity-40 blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative lg:border  border-white/15 lg:bg-black/20 border-0 backdrop-blur-xl flex flex-col lg:flex-row w-full max-w-6xl mx-auto  lg:rounded-2xl shadow-2xl overflow-hidden ">
        
        
        
      <div className="flex items-center justify-center lg:w-1/2 ">
        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className=" flex items-center mt-[70px] sm:min-h-[600px] lg:h-full  lg:mt-[0px]   mb-[100px] lg:mb-0 justify-center lg:w-full border rounded-2xl  max-w-[520px] sm:max-w-[600px] lg:rounded-none border-white/15 lg:border-0   lg:flex w-full  bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900  relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>

          
          <div className="relative z-10 max-w-md p-8 text-center">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto mb-8 group">
              <div className="absolute inset-0 bg-gray-800/30 border border-gray-700/50 rounded-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative z-10 p-6">
                <img 
                  src="i.jpg" 
                  alt="Two podcast hosts recording an episode in a cozy studio with microphones and headphones, sitting at a wooden table in front of a brick wall background." 
                  className="w-full h-full object-cover rounded-xl shadow-2xl transform group-hover:rotate-1 transition-transform duration-500 border border-gray-700/30" 
                />
              </div>
                  <div className="absolute -inset-4 bg-gradient-to-r  rounded-3xl blur-xl opacity-100 transition-opacity duration-500"></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white leading-tight">
                     Start your podcast journey
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">  
                  Capture ideas, host meaningful conversations, and bring your voice to life with powerful recording tools.
              </p>

            </div>
          </div>
        </div>
      </div>
        
        
        {/* SIGNUP FORM - LEFT SIDE */}
      <div className="flex items-center justify-center lg:w-1/2">
        <div className="rounded-2xl lg:h-full   mb-[100px] lg:mb-0 max-w-[520px] sm:max-w-[600px]   lg:rounded-none w-full lg:w-full p-6 sm:p-10 flex flex-col relative  border border-white/15 lg:border-0">
          {/* LOGO */}
          <Wavify/>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl mb-6 shadow-lg animate-bounce backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{error.response.data.message}</span>
              </div>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                  Create an Account
                </h2>
                <p className="text-base text-white/80">
                  Join Wavify and start your Journey! ✨
                </p>
              </div>

              <div className="space-y-5">
                {/* FULLNAME */}

                  <Columns  text="Full Name"   type="text"    holdervalue="John Doe"      value={signupData.fullName}      func={(e) => setSignupData({ ...signupData, fullName: e.target.value })}/>

                  <Columns  text="Email"   type="email"    holdervalue="john@gmail.com"      value={signupData.email}      func={(e) => setSignupData({ ...signupData, email: e.target.value })}/>

                  <Columns  text="Password"   type="password"    holdervalue="********"      value={signupData.password}     func={(e) => setSignupData({ ...signupData, password: e.target.value })}   info="Password must be at least 6 characters long"/>



                <div className="flex items-start gap-3 group">
                  <div className="relative mt-1">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-white border-2  border-gray-600 rounded" 
                      required 
                    />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">
                    I agree to the terms of service and privacy policy
                  </span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center text-white">
                  <button 
                    className="relative px-12 py-4 bg-gradient-to-r      from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800        hover:opacity-90 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 group overflow-hidden"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>

                      </>
                    )}
                  </button>
              </div>

              <div className="text-center ">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-red-500 hover:text-orange-600 transition-colors font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>

      </div>
      </div>

  );
};

export default SignUpPage;