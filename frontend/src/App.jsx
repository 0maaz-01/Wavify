import { Navigate, Route, Routes } from "react-router";

import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import RecorderPage from "./pages/RecorderPage.jsx";
import NavBar from "./components/NavBar.jsx";
import FullScreenVideo from "./components/FullScreenVideo.jsx";



const App = () => {
  const { isLoading, authUser } = useAuthUser();
 
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;


  const HomePage = () => (
    
    <>
        <NavBar/>
        <FullScreenVideo/>
    </>
  );
  

  return (
    <div className="h-screen" >
      <Routes>

        <Route   path="/"  element={<HomePage/>} />


        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> :  <Navigate to = "/podcast" />
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> :  <Navigate to = "/podcast" />
          }
        />

        <Route
          path="/podcast"
          element={
            isAuthenticated ?  <RecorderPage/>   :   <Navigate to = "/login" />
          }
        />

      </Routes>

      <Toaster />
    </div>
  );
};
export default App;

