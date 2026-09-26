import React from 'react';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface NavbarProps {
  isBackendConnected?: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({ isBackendConnected }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                Contact Manager
              </h1>
              <p className="text-xs text-slate-500 truncate">
                Simple REST API Demo
              </p>
            </div>
          </div>

          {/* API Health Status Indicator */}
          <div className="flex items-center gap-2">
            {isBackendConnected === true ? (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold shadow-xs"
                title="Express backend is running and reachable on port 5000"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="w-3.5 h-3.5" />
                <span className="truncate">Backend Connected</span>
              </div>
            ) : isBackendConnected === false ? (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold shadow-xs"
                title="Express backend is unreachable. Ensure npm run dev is running in backend/"
              >
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="truncate">Backend Offline</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium">
                <span className="animate-pulse inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                <span>Connecting...</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
