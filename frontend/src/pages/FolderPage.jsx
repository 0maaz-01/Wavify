import { useState, useEffect } from 'react';
import { Folder, Music, Video, Search, FolderOpen, Zap, Sparkles, ArrowLeft, ChevronLeft, Check } from 'lucide-react';



const FolderPage = () => {
  const [currentPath, setCurrentPath] = useState(['This PC']);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mock file system data
  const fileSystem = {
    'This PC': {
      type: 'folder',
      children: {
        'Desktop': { type: 'folder', children: {}},
        'Documents': { type: 'folder', children: {}},
        'Downloads': { type: 'folder', children: {}},
        'Pictures': { type: 'folder', children: {}},
        'Music': { type: 'folder', children: {}},
        'Videos': { type: 'folder', children: {}},
        'Projects': { type: 'folder', children: {} },
        'Work': { type: 'folder', children: {} },
        'Personal': { type: 'folder', children: {} },
        'Archive': { type: 'folder', children: {} },
        'Backups': { type: 'folder', children: {} },
        'Templates': { type: 'folder', children: {} },
        'Screenshots': { type: 'folder', children: {} },
        'Notes': { type: 'folder', children: {} },
        'Invoices': { type: 'folder', children: {} },
        'Presentations': { type: 'folder', children: {} },
        'Research': { type: 'folder', children: {} },
        'Books': { type: 'folder', children: {} },
        'Code': { type: 'folder', children: {} },
        'Snippets': { type: 'folder', children: {} },
        'Courses': { type: 'folder', children: {} },
        'Clients': { type: 'folder', children: {} },
        'Meetings': { type: 'folder', children: {} },
        'Ideas': { type: 'folder', children: {} },
        'Logs': { type: 'folder', children: {} },
        'Configs': { type: 'folder', children: {} },
      }
    }
  };

  const getFileIcon = (item, name) => {
    const isHovered = hoveredItem === name;
    
    if (item.type === 'folder') {
      return isHovered 
        ? <img src ="/Folder.png"/>
        : <img src ="/Folder.png"/>;
    }

    const ext = item.extension?.toLowerCase();
    const baseClasses = "w-8 h-8 transition-all duration-300";
    const hoverClasses = isHovered ? "scale-110 drop-shadow-lg" : "";
    
    switch (ext) {
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'm3u':
        return <Music className={`${baseClasses} ${hoverClasses} text-purple-400`} />;
      case 'mp4':
      case 'avi':
      case 'mkv':
      case 'mov':
        return <Video className={`${baseClasses} ${hoverClasses} text-orange-400`} />;
      default:
        return <img src="/Folder.png" className="size-20"/>
        // return <File className={`${baseClasses} ${hoverClasses} text-gray-400`} />;
    }
  };

  const getCurrentFolder = () => {
    let current = fileSystem;
    for (const path of currentPath) {
      current = current[path];
    }
    return current.children || {};
  };

  const navigateToFolder = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
    setSelectedItems(new Set());
  };



  const toggleItemSelection = (itemName) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } 
    else {
      newSelected.add(itemName);
    }
    setSelectedItems(newSelected);
  };

  const handleItemDoubleClick = (itemName, item) => {
    if (item.type === 'folder') {
      navigateToFolder(itemName);
    }
  };

  const currentFolder = getCurrentFolder();
  const filteredItems = Object.entries(currentFolder).filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );




  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden relative  playfair-font ">


      {/* Window Title Bar */}
      <div className="bg-[#212020]  border-b border-white/10 px-4 py-3 shadow-2xl relative z-10">
        <div className="flex items-center justify-end">

          <div className="">
              <a href = "/podcast">
                  <img src="/Left-Arrow.png" className="size-8"/>
              </a>
          </div>


          {/* Search Bar */}
          <div className="w-full flex justify-end">
              <div className="flex items-center space-x-3  ">
                <div className="relative  ">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isSearchFocused ? ' scale-110' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search Folder"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}

                    className="pl-10 pr-4 py-2.5 border border-gray-600/50 rounded-xl text-sm w-64  bg-white/10 backdrop-blur-lg text-gray-200 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-red-500/50  transition-all duration-300 "
                  />
                  {searchQuery && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Sparkles className="w-4 h-4 text-red-500 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 relative z-10">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <div className=" rounded-3xl p-12 max-w-md mx-auto shadow-2xl   transition-all duration-500 hover:scale-110 scale-105">
              <div className="relative flex items-center justify-center">
                <img src="/Folder.png" className="animate-bounce  max-w-[200px]   sm:max-w-[250px]   md:max-w-[300px] lg:max-w-[350px]"/>
              </div>
              <h3 className=" font-semibold mb-2 text-gray-200    text-2xl    sm:text-4xl">This folder is empty</h3>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-6">
            {filteredItems.map(([name, item]) => (
              <div
                key={name}
                onClick={() => toggleItemSelection(name)}
                onDoubleClick={() => handleItemDoubleClick(name, item)}
                onMouseEnter={() => setHoveredItem(name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 ${
                  selectedItems.has(name) 
                    ? 'bg-cyan-500/20 backdrop-blur-xl shadow-2xl shadow-cyan-500/30 border-2 border-cyan-400/50 scale-105 animate-pulse' 
                    : ''
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    {getFileIcon(item, name)}
                    {hoveredItem === name && (
                      <>
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-lg animate-pulse"></div>
                        <div className="absolute -inset-1 bg-cyan-400/20 rounded-lg animate-ping"></div>
                      </>
                    )}
                  </div>
                  <div className="text-center w-full">
                    <div className="text-sm font-medium text-gray-200 truncate w-full mb-1 group-hover:text-cyan-300 transition-colors duration-300" title={name}>
                      {name}
                    </div>
                    {item.type === 'file' && (
                      <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">{item.size}</div>
                    )}
                  </div>
                </div>
                
                {selectedItems.has(name) && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500  rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 font-bold text-white" />
                  </div>
                )}

                {hoveredItem === name && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#212020]  border-t border-white/10 px-6 py-3 shadow-2xl relative z-10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-300">
            <span className="font-medium flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-white">{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}</span>
            </span>
            {selectedItems.size > 0 && (
              <span className="text-orange-600 font-medium flex items-center space-x-2 animate-pulse">
                <Zap className="w-4 h-4" />
                <span className="text-white">{selectedItems.size} selected</span>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};



export default FolderPage;
