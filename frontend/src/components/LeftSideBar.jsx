import { Home, User, Settings, Mail, FileText } from 'lucide-react';
import Button from './Button';



export default function LeftSideBar({isLeftSidebarOpen,   isMobile,   isLoaded,   toggleLeftSidebar,    setIsLeftSidebarOpen }) {


  const leftMenuItems = [
    { icon: Home, label: 'Dashboard', href: '#' },
    { icon: User, label: 'Profile', href: '#' },
    { icon: FileText, label: 'Documents', href: '#' },
    { icon: Mail, label: 'Messages', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];



  return (  // white/10 backdrop-blur-lg
    <div className={`fixed left-0 top-0 h-full w-64 bg-[#161616] backdrop-blur-3xl text-white border-r border-white/10 shadow-lg transform transition-all duration-700 ease-out z-50 ${
        isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${!isMobile && isLoaded && isLeftSidebarOpen ? 'translate-x-0 opacity-100' : !isMobile && isLeftSidebarOpen ? '-translate-x-full opacity-0' : 'opacity-100'}`}>
        
        {/* Left Sidebar Header */}
        <div className="flex items-center justify-between p-4  ">
          <h2 className="text-xl  font-semibold ">Menu</h2>
          <Button func={toggleLeftSidebar} icon="close"/>
        </div>

        {/* Left Sidebar Navigation */}
        <nav className="mt-4 flex-1">
          <ul className="space-y-2 px-4">
            {leftMenuItems.map((item, index) => (
              <li key={index} className={`transform transition-all duration-500 ${
                !isMobile && isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : !isMobile 
                  ? 'translate-y-4 opacity-0' 
                  : 'translate-y-0 opacity-100'
              }`} style={{ 
                transitionDelay: !isMobile && isLoaded ? `${index * 100}ms` : '0ms' 
              }}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-amber-600 hover:text-black transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    // Only close on mobile
                    if (isMobile) {
                      setIsLeftSidebarOpen(false);
                    }
                  }}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
  );
}