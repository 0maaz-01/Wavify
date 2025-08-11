import LeftSideBar from '../components/LeftSideBar';
import RightSideBar from '../components/RightSideBar';
import BottomBar from '../components/BottomBar';
import MainContent from '../components/MainContent';
import { SharedStatesData } from '../context/useSharedStates';
import useSharedEffects from '../context/useSharedEffects';



const RecorderPage = () => {
    const { isMobile, openSidebarCount, setIsBottomDrawerOpen, setIsRightSidebarOpen, setIsLeftSidebarOpen
          } = SharedStatesData();

    useSharedEffects();
  

  return (
    <div className=" bg-black relative    playfair-font ">
      {/* Overlay - Only on mobile and only when at least one sidebar is open */}
      {isMobile && openSidebarCount > 0 && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={() => {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
            setIsBottomDrawerOpen(false);
          }}
        />
      )}


      <MainContent/>

      <LeftSideBar/>

      <RightSideBar/>

      <BottomBar/>

    </div>
  );
}

export default RecorderPage;