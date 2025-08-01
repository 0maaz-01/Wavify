import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  File, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Archive,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  ChevronDown,
  HardDrive,
  Star,
  Clock,
  Download,
  FolderOpen,
  Settings,
  Maximize2,
  Zap,
  Sparkles
} from 'lucide-react';

const WindowsFolderViewer = () => {
  const [currentPath, setCurrentPath] = useState(['This PC']);
  const [viewMode, setViewMode] = useState('grid');
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
        'Desktop': { type: 'folder', children: {
          'New Document.txt': { type: 'file', extension: 'txt', size: '2 KB', modified: '2025-01-15' },
          'Screenshot.png': { type: 'file', extension: 'png', size: '1.2 MB', modified: '2025-01-14' },
          'Notes.txt': { type: 'file', extension: 'txt', size: '854 bytes', modified: '2025-01-13' },
          'Shortcuts': { type: 'folder', children: {
            'Chrome.lnk': { type: 'file', extension: 'lnk', size: '2 KB', modified: '2025-01-10' },
            'VS Code.lnk': { type: 'file', extension: 'lnk', size: '2 KB', modified: '2025-01-10' },
            'Spotify.lnk': { type: 'file', extension: 'lnk', size: '2 KB', modified: '2025-01-09' },
          }},
          'Project Files': { type: 'folder', children: {
            'index.html': { type: 'file', extension: 'html', size: '4 KB', modified: '2025-01-12' },
            'style.css': { type: 'file', extension: 'css', size: '2 KB', modified: '2025-01-12' },
            'script.js': { type: 'file', extension: 'js', size: '8 KB', modified: '2025-01-12' },
            'assets': { type: 'folder', children: {
              'logo.png': { type: 'file', extension: 'png', size: '45 KB', modified: '2025-01-11' },
              'background.jpg': { type: 'file', extension: 'jpg', size: '234 KB', modified: '2025-01-11' },
              'icon.svg': { type: 'file', extension: 'svg', size: '12 KB', modified: '2025-01-11' },
            }},
            'README.md': { type: 'file', extension: 'md', size: '3 KB', modified: '2025-01-10' },
          }}
        }},
        'Documents': { type: 'folder', children: {
          'Resume.pdf': { type: 'file', extension: 'pdf', size: '156 KB', modified: '2025-01-10' },
          'Budget.xlsx': { type: 'file', extension: 'xlsx', size: '24 KB', modified: '2025-01-08' },
          'Presentation.pptx': { type: 'file', extension: 'pptx', size: '2.1 MB', modified: '2025-01-05' },
          'Personal': { type: 'folder', children: {
            'Journal.docx': { type: 'file', extension: 'docx', size: '45 KB', modified: '2025-01-05' },
            'Ideas.txt': { type: 'file', extension: 'txt', size: '12 KB', modified: '2025-01-04' },
            'Goals 2025.pdf': { type: 'file', extension: 'pdf', size: '89 KB', modified: '2025-01-01' },
          }},
          'Work': { type: 'folder', children: {
            'Report.docx': { type: 'file', extension: 'docx', size: '89 KB', modified: '2025-01-03' },
            'Data.csv': { type: 'file', extension: 'csv', size: '45 KB', modified: '2025-01-01' },
            'Meetings': { type: 'folder', children: {
              'Q1 Planning.pptx': { type: 'file', extension: 'pptx', size: '1.2 MB', modified: '2024-12-28' },
              'Team Notes.docx': { type: 'file', extension: 'docx', size: '34 KB', modified: '2024-12-27' },
              'Action Items.xlsx': { type: 'file', extension: 'xlsx', size: '18 KB', modified: '2024-12-26' },
            }},
            'Templates': { type: 'folder', children: {
              'Invoice Template.xlsx': { type: 'file', extension: 'xlsx', size: '67 KB', modified: '2024-12-20' },
              'Letter Template.docx': { type: 'file', extension: 'docx', size: '23 KB', modified: '2024-12-19' },
              'Proposal Template.pptx': { type: 'file', extension: 'pptx', size: '456 KB', modified: '2024-12-18' },
            }}
          }}
        }},
        'Downloads': { type: 'folder', children: {
          'installer.exe': { type: 'file', extension: 'exe', size: '45 MB', modified: '2025-01-14' },
          'music.mp3': { type: 'file', extension: 'mp3', size: '3.2 MB', modified: '2025-01-13' },
          'video.mp4': { type: 'file', extension: 'mp4', size: '128 MB', modified: '2025-01-12' },
          'archive.zip': { type: 'file', extension: 'zip', size: '15 MB', modified: '2025-01-11' },
          'Software': { type: 'folder', children: {
            'Chrome Setup.exe': { type: 'file', extension: 'exe', size: '89 MB', modified: '2025-01-10' },
            'Discord Setup.exe': { type: 'file', extension: 'exe', size: '67 MB', modified: '2025-01-09' },
            'Node.js Installer.msi': { type: 'file', extension: 'msi', size: '32 MB', modified: '2025-01-08' },
          }},
          'Temp': { type: 'folder', children: {
            'temp1.tmp': { type: 'file', extension: 'tmp', size: '234 KB', modified: '2025-01-14' },
            'cache.dat': { type: 'file', extension: 'dat', size: '1.2 MB', modified: '2025-01-13' },
            'log.txt': { type: 'file', extension: 'txt', size: '456 KB', modified: '2025-01-12' },
          }}
        }},
        'Pictures': { type: 'folder', children: {
          'family.jpg': { type: 'file', extension: 'jpg', size: '1.5 MB', modified: '2024-12-25' },
          'profile.png': { type: 'file', extension: 'png', size: '856 KB', modified: '2025-01-01' },
          'screenshot_2025.png': { type: 'file', extension: 'png', size: '2.3 MB', modified: '2025-01-15' },
          'Vacation': { type: 'folder', children: {
            'beach1.jpg': { type: 'file', extension: 'jpg', size: '2.1 MB', modified: '2024-12-20' },
            'beach2.jpg': { type: 'file', extension: 'jpg', size: '1.8 MB', modified: '2024-12-20' },
            'sunset.png': { type: 'file', extension: 'png', size: '3.2 MB', modified: '2024-12-21' },
            'memories.txt': { type: 'file', extension: 'txt', size: '5 KB', modified: '2024-12-22' },
          }},
          'Events': { type: 'folder', children: {
            'Birthday Party': { type: 'folder', children: {
              'group_photo.jpg': { type: 'file', extension: 'jpg', size: '3.4 MB', modified: '2024-11-15' },
              'cake.jpg': { type: 'file', extension: 'jpg', size: '2.1 MB', modified: '2024-11-15' },
              'celebration.mp4': { type: 'file', extension: 'mp4', size: '45 MB', modified: '2024-11-15' },
            }},
            'Wedding': { type: 'folder', children: {
              'ceremony.jpg': { type: 'file', extension: 'jpg', size: '4.2 MB', modified: '2024-10-12' },
              'reception.jpg': { type: 'file', extension: 'jpg', size: '3.8 MB', modified: '2024-10-12' },
              'highlights.mp4': { type: 'file', extension: 'mp4', size: '156 MB', modified: '2024-10-12' },
            }}
          }},
          'Screenshots': { type: 'folder', children: {
            'desktop_capture.png': { type: 'file', extension: 'png', size: '1.2 MB', modified: '2025-01-14' },
            'error_message.png': { type: 'file', extension: 'png', size: '456 KB', modified: '2025-01-13' },
            'tutorial_step1.png': { type: 'file', extension: 'png', size: '789 KB', modified: '2025-01-12' },
          }}
        }},
        'Music': { type: 'folder', children: {
          'playlist.m3u': { type: 'file', extension: 'm3u', size: '1 KB', modified: '2024-12-18' },
          'recently_played.txt': { type: 'file', extension: 'txt', size: '3 KB', modified: '2025-01-14' },
          'Favorites': { type: 'folder', children: {
            'song1.mp3': { type: 'file', extension: 'mp3', size: '4.2 MB', modified: '2024-12-15' },
            'song2.mp3': { type: 'file', extension: 'mp3', size: '3.8 MB', modified: '2024-12-16' },
            'acoustic_version.mp3': { type: 'file', extension: 'mp3', size: '5.1 MB', modified: '2024-12-17' },
            'live_recording.mp3': { type: 'file', extension: 'mp3', size: '6.3 MB', modified: '2024-12-18' },
          }},
          'Albums': { type: 'folder', children: {
            'Rock Collection': { type: 'folder', children: {
              'track01.mp3': { type: 'file', extension: 'mp3', size: '4.5 MB', modified: '2024-11-20' },
              'track02.mp3': { type: 'file', extension: 'mp3', size: '3.9 MB', modified: '2024-11-20' },
              'track03.mp3': { type: 'file', extension: 'mp3', size: '4.1 MB', modified: '2024-11-20' },
              'album_art.jpg': { type: 'file', extension: 'jpg', size: '234 KB', modified: '2024-11-20' },
            }},
            'Jazz Essentials': { type: 'folder', children: {
              'smooth_jazz.mp3': { type: 'file', extension: 'mp3', size: '5.2 MB', modified: '2024-10-15' },
              'blues_night.mp3': { type: 'file', extension: 'mp3', size: '4.8 MB', modified: '2024-10-15' },
              'saxophone_solo.mp3': { type: 'file', extension: 'mp3', size: '3.7 MB', modified: '2024-10-15' },
            }}
          }}
        }},
        'Videos': { type: 'folder', children: {
          'tutorial.mp4': { type: 'file', extension: 'mp4', size: '245 MB', modified: '2024-12-10' },
          'meeting_recording.avi': { type: 'file', extension: 'avi', size: '156 MB', modified: '2024-12-05' },
          'funny_clip.mp4': { type: 'file', extension: 'mp4', size: '23 MB', modified: '2025-01-12' },
          'Movies': { type: 'folder', children: {
            'action_movie.mp4': { type: 'file', extension: 'mp4', size: '1.2 GB', modified: '2024-11-28' },
            'comedy_special.mkv': { type: 'file', extension: 'mkv', size: '890 MB', modified: '2024-11-25' },
            'documentary.avi': { type: 'file', extension: 'avi', size: '1.5 GB', modified: '2024-11-20' },
          }},
          'Tutorials': { type: 'folder', children: {
            'Programming': { type: 'folder', children: {
              'react_basics.mp4': { type: 'file', extension: 'mp4', size: '234 MB', modified: '2024-12-01' },
              'javascript_advanced.mp4': { type: 'file', extension: 'mp4', size: '345 MB', modified: '2024-12-02' },
              'css_animations.mp4': { type: 'file', extension: 'mp4', size: '178 MB', modified: '2024-12-03' },
            }},
            'Design': { type: 'folder', children: {
              'photoshop_tips.mp4': { type: 'file', extension: 'mp4', size: '289 MB', modified: '2024-11-30' },
              'ui_ux_principles.mp4': { type: 'file', extension: 'mp4', size: '456 MB', modified: '2024-11-29' },
              'color_theory.mp4': { type: 'file', extension: 'mp4', size: '167 MB', modified: '2024-11-28' },
            }}
          }}
        }}
      }
    }
  };

  const getFileIcon = (item, name) => {
    const isHovered = hoveredItem === name;
    
    if (item.type === 'folder') {
      return isHovered 
        ? <FolderOpen className="w-8 h-8 text-cyan-400 drop-shadow-lg animate-pulse" />
        : <Folder className="w-8 h-8 text-blue-400" />;
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

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedItems(new Set());
    }
  };

  const navigateToPath = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
    setSelectedItems(new Set());
  };

  const toggleItemSelection = (itemName) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x * 0.01 + '%',
            top: mousePosition.y * 0.01 + '%',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: (window.innerWidth - mousePosition.x) * 0.01 + '%',
            bottom: (window.innerHeight - mousePosition.y) * 0.01 + '%',
            transform: 'translate(50%, 50%)'
          }}
        />
      </div>

      {/* Window Title Bar */}
      <div className="bg-gray-800/60 backdrop-blur-xl border-b border-gray-700/50 px-4 py-3 shadow-2xl relative z-10">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`group p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                viewMode === 'grid' 
                  ? 'bg-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/25 animate-pulse' 
                  : 'hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`group p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                viewMode === 'list' 
                  ? 'bg-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/25 animate-pulse' 
                  : 'hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                isSearchFocused ? 'text-cyan-400 scale-110' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search in the darkness..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 pr-4 py-2.5 border border-gray-600/50 rounded-xl text-sm w-64 bg-gray-700/40 backdrop-blur-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-gray-600/40"
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 relative z-10">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-12 max-w-md mx-auto shadow-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105">
              <div className="relative">
                <Folder className="w-24 h-24 mx-auto mb-6 text-gray-600 animate-bounce" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-200">This folder is empty</h3>
              <p className="text-sm text-gray-500">The void awaits your files...</p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
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
                    : 'bg-gray-800/40 backdrop-blur-xl hover:bg-gray-700/50 hover:shadow-2xl border border-gray-700/50 hover:border-cyan-500/50'
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
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-spin shadow-lg">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                )}

                {hoveredItem === name && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-300 border-b border-gray-700/50 bg-gray-700/20">
              <div className="col-span-5">Name</div>
              <div className="col-span-3">Size</div>
            </div>
            <div className="divide-y divide-gray-700/30">
              {filteredItems.map(([name, item]) => (
                <div
                  key={name}
                  onClick={() => toggleItemSelection(name)}
                  onDoubleClick={() => handleItemDoubleClick(name, item)}
                  onMouseEnter={() => setHoveredItem(name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`group grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    selectedItems.has(name) 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-4 border-cyan-400 shadow-lg' 
                      : 'hover:bg-gray-700/30 hover:shadow-lg'
                  }`}
                >
                  <div className="col-span-5 flex items-center space-x-4">
                    {getFileIcon(item, name)}
                    <span className="text-sm font-medium truncate text-gray-200 group-hover:text-cyan-300 transition-colors duration-300">{name}</span>
                  </div>

                  
                  <div className="col-span-10 bg-black flex items-center text-sm text-gray-400  group-hover:text-gray-300 transition-colors duration-300">
                    {item.type === 'file' ? item.size : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800/60 backdrop-blur-xl border-t border-gray-700/50 px-6 py-3 shadow-2xl relative z-10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-300">
            <span className="font-medium flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}</span>
            </span>
            {selectedItems.size > 0 && (
              <span className="text-cyan-400 font-medium flex items-center space-x-2 animate-pulse">
                <Zap className="w-4 h-4" />
                <span>{selectedItems.size} selected</span>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default WindowsFolderViewer;