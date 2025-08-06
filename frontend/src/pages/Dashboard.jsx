import { Mic, Video, Music, FileText, Play, Eye, Heart, MessageSquare, Edit3, MoreHorizontal, Filter, Plus, Globe, Award, Zap, Timer, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import LeftSideBar from '../components/LeftSideBar';




export default function PodcastDashboard() {

  const user = {
    name: "Alex Thompson",
    email: "alex.thompson@podcaststudio.com",
    role: "Podcast Host & Producer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    joinDate: "March 2022",
    plan: "Pro Plan",
    stats: {
      totalRecordings: 47,
      totalDuration: "156h 23m",
      subscribers: "12.4K",
      avgRating: 4.8,
      totalViews: "2.1M",
      monthlyListeners: "45.2K",
      revenue: "$3,240",
      growthRate: "+12.5%"
    }
  };


  const recentEpisodes = [
    { 
      id: 1, title: "The Future of AI in Content Creation", duration: "1h 23m", status: "published", 
      views: "12.4K", likes: 847, comments: 123, publishDate: "2 days ago",
      thumbnail: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=80&h=80&fit=crop"
    },
    { 
      id: 2, title: "Building Sustainable Startups", duration: "45m", status: "processing", 
      views: "0", likes: 0, comments: 0, publishDate: "Processing...",
      thumbnail: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=80&h=80&fit=crop"
    },
    { 
      id: 3, title: "The Art of Remote Leadership", duration: "1h 15m", status: "draft", 
      views: "0", likes: 0, comments: 0, publishDate: "Draft",
      thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=80&h=80&fit=crop"
    }
  ];


  const contentLibrary = {
    chunks: { total: 127, recent: 15, size: "450 MB" },
    videos: { total: 34, recent: 8, size: "12.3 GB" },
    audios: { total: 89, recent: 23, size: "2.1 GB" },
    recordings: { total: 47, recent: 3, size: "8.7 GB" }
  };

  const navItems = [
    { id: 'chunks', label: 'Audio Chunks', icon: FileText, count: contentLibrary.chunks.total, color: 'bg-blue-500', desc: 'Edited segments' },
    { id: 'videos', label: 'Videos', icon: Video, count: contentLibrary.videos.total, color: 'bg-green-500', desc: 'Video content' },
    { id: 'audios', label: 'Audio Files', icon: Music, count: contentLibrary.audios.total, color: 'bg-purple-500', desc: 'Music & SFX' },
    { id: 'recording', label: 'Live Recording', icon: Mic, count: 0, color: 'bg-red-500', desc: 'Record new content' }
  ];





  return (
    <div className="min-h-screen bg-black">

      <LeftSideBar/>

      <div className="flex">

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Enhanced User Profile */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-20 h-20 rounded-xl object-cover ring-4 ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      {user.name}
                    </h2>
                    <p className="text-slate-400">{user.email}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>






          {/* Content Library Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(contentLibrary).map(([key, data]) => {
              const item = navItems.find(nav => nav.id === key) || navItems.find(nav => nav.id === 'recording');
              return (
                <div key={key} className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${item?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center`}>
                      {item?.icon && <item.icon className="w-6 h-6 text-white" />}
                    </div>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{item?.label || 'Content'}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Total Files</span>
                      <span className="text-sm font-medium text-white">{data.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Recent</span>
                      <span className="text-sm font-medium text-green-400">+{data.recent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Size</span>
                      <span className="text-sm font-medium text-white">{data.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-white py-2 px-3 rounded-lg text-sm transition-all">
                      View All
                    </button>
                    <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>







          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Episodes */}
            <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Episodes</h3>
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-all flex items-center">
                    <Plus className="w-4 h-4 mr-1" />
                    New Episode
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {recentEpisodes.map((episode) => (
                  <div key={episode.id} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all">
                    <img 
                      src={episode.thumbnail} 
                      alt={episode.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{episode.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-400">{episode.duration}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          episode.status === 'published' ? 'bg-green-500/20 text-green-400' :
                          episode.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {episode.status}
                        </span>
                        <span className="text-sm text-slate-400">{episode.publishDate}</span>
                      </div>
                      {episode.status === 'published' && (
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-400">{episode.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-400">{episode.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-400">{episode.comments}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>




          {/* Advanced Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                  <p className="text-sm text-purple-400">Smart editing and optimization</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Auto Noise Reduction</p>
                      <p className="text-xs text-slate-400">Applied to 3 episodes</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-400">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Timer className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Smart Timestamps</p>
                      <p className="text-xs text-slate-400">Auto-generate chapters</p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-400">Processing</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Auto Transcription</p>
                      <p className="text-xs text-slate-400">Generate show notes</p>
                    </div>
                  </div>
                  <button className="text-xs text-purple-400 hover:text-purple-300">Enable</button>
                </div>
              </div>
            </div>

            {/* Distribution & Publishing */}
            <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Distribution</h3>
                  <p className="text-sm text-green-400">Multi-platform publishing</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-white">Spotify</span>
                  </div>
                  <span className="text-xs text-green-400">Connected</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-white">Apple Podcasts</span>
                  </div>
                  <span className="text-xs text-green-400">Connected</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium text-white">YouTube</span>
                  </div>
                  <button className="text-xs text-yellow-400 hover:text-yellow-300">Setup</button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-white">Google Podcasts</span>
                  </div>
                  <button className="text-xs text-gray-400 hover:text-gray-300">Connect</button>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}