import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Bell, Smartphone, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AndroidStatusBar: React.FC = () => {
  const { notifications, isNotificationShadeOpen, setIsNotificationShadeOpen, viewMode, setViewMode } = useApp();
  const [timeStr, setTimeStr] = useState('10:55 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative z-30 select-none bg-zinc-950/80 backdrop-blur-md text-zinc-300 text-xs px-4 py-2 flex items-center justify-between border-b border-zinc-800/60">
      {/* Left: Time and social notification icons matching the reference screenshot */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-zinc-100 tracking-tight">{timeStr}</span>
        
        {/* Subtle status icons */}
        <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 pl-1">
          {unreadCount > 0 && (
            <button
              onClick={() => setIsNotificationShadeOpen(!isNotificationShadeOpen)}
              className="relative p-0.5 text-amber-400 hover:text-amber-300 transition-colors"
              title="Open Android Notification Drawer"
              aria-label="Open Android notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
          )}
        </div>
      </div>

      {/* Center: Camera notch / punch hole */}
      <div className="hidden md:flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-black border border-zinc-800" />
      </div>

      {/* Right: Network, Wi-Fi, VoWiFi, Battery 92% */}
      <div className="flex items-center gap-2 text-zinc-300">
        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
          <span>VoWiFi</span>
          <span className="text-zinc-500 font-sans">|</span>
          <span className="font-semibold text-zinc-300">5G</span>
        </div>
        
        <Wifi className="w-3.5 h-3.5 text-zinc-300" aria-hidden="true" />
        
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono font-medium">92%</span>
          <BatteryMedium className="w-4 h-4 text-zinc-200" aria-hidden="true" />
        </div>

        {/* Viewport switch (Phone frame vs Responsive layout) */}
        <button
          onClick={() => setViewMode(viewMode === 'phone' ? 'fullscreen' : 'phone')}
          className="ml-2 p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
          title={viewMode === 'phone' ? 'Switch to Fullscreen / Tablet layout' : 'Switch to Android Phone Frame'}
          aria-label="Toggle device frame mode"
        >
          {viewMode === 'phone' ? (
            <Monitor className="w-3.5 h-3.5" />
          ) : (
            <Smartphone className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
