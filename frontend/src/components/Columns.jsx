const Columns = ({text, type, holdervalue, value, func, info}) => (
      <div className="relative group">
          <label className="block text-sm font-medium mb-2 text-white/80">{text}</label>
              <input
                  type={type}
                  placeholder={holdervalue}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
                  value={value}
                  onChange={func}
                  required
              />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg"></div>
          {info &&                   
              <p className="text-xs text-gray-300 mt-2 flex items-center gap-1">
                    {info}
              </p>
          }
      </div>
  )

export default Columns;