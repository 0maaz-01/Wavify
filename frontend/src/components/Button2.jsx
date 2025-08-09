



export const Button2 = ({text, func}) => (
    <button  onClick={func}
        className="group relative px-6 py-3 mt-8 rounded-xl bg-zinc-900 text-amber-300 font-bold tracking-widest uppercase text-sm border-b-4 border-amber-400/50 border-amber-400 transition-all duration-300 ease-in-out hover:text-amber-200  shadow-[0_15px_30px_rgba(251,191,36,0.25)] active:border-b-0 active:translate-y-1"
    >
        <span className="flex items-center gap-3 relative z-10">

              {text}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 transition-all duration-300 group-hover:translate-x-1"
          >
            <path
              d="M12 4L10.6 5.4L16.2 11H4V13H16.2L10.6 18.6L12 20L20 12L12 4Z"
            ></path>
          </svg>
        </span>
        <div
          className="absolute -inset-1 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 blur-xl transition-all duration-300 -z-10 opacity-100"
        ></div>
    </button>
)