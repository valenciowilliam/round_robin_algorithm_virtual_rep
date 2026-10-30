import { Cpu, ExternalLink, BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-maroon-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-600 flex items-center justify-center shadow-md shadow-maroon-900/20 text-white">
            <Cpu size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-maroon-950 leading-tight">Round Robin</p>
            <p className="text-[11px] text-maroon-600 font-medium leading-tight">CPU Scheduling Simulator</p>
          </div>
        </div>

        {/* Center label */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon-50 border border-maroon-200/70">
          <span className="w-2 h-2 rounded-full bg-maroon-600 animate-pulse"></span>
          <span className="text-xs font-semibold text-maroon-900">Operating Systems — Mini Project</span>
        </div>

        {/* Right links */}
        <div className="flex items-center gap-2">
          <a
            href="#education"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-maroon-700 hover:text-maroon-950 
                       hover:bg-maroon-50 transition-all duration-200 text-xs font-semibold"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Learn</span>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-maroon-700 hover:text-maroon-950 
                       hover:bg-maroon-50 transition-all duration-200 text-xs font-semibold"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Source</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
