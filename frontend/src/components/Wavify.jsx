import { Flame, Sparkles } from "lucide-react";


const Wavify = () => {
  return (
          <div className="mb-8 flex items-center justify-start gap-3 group">
            <div className="relative">
              <Sparkles className="w-12 h-12   text-red-700 group-hover:rotate-180 transition-transform duration-700" />
              <div className="absolute inset-0 bg-indigo-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <span className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-700 tracking-wider animate-pulse">
                Wavify
            </span>
          </div>


  )
}

export default Wavify