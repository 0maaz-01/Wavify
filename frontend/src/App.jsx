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


        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />


      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
