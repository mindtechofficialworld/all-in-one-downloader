import React from 'react';
import { Home, FolderDown, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, activeTasksCount, completedTasksCount, announceTalkBack } = useApp();

  const handleTabClick = (tab: 'home' | 'downloads' | 'settings', label: string) => {
    setActiveTab(tab);
    announceTalkBack(`Navigated to ${label} tab`);
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 left-0 right-0 z-40 bg-zinc-950/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 px-2 py-1.5 shadow-lg select-none"
    >
      <div className="grid grid-cols-3 max-w-md mx-auto items-center">
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home', 'Home')}
          className={`flex flex-col items-center justify-center min-h-[52px] py-1 transition-all rounded-xl relative ${
            activeTab === 'home'
              ? 'text-amber-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 font-medium'
          }`}
          aria-label="Home Tab"
          aria-selected={activeTab === 'home'}
          role="tab"
        >
          <div className="relative">
            <Home
              className={`w-5 h-5 transition-transform ${
                activeTab === 'home' ? 'scale-110' : ''
              }`}
            />
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Home</span>
        </button>

        {/* Tab 2: Downloads */}
        <button
          onClick={() => handleTabClick('downloads', 'Downloads')}
          className={`flex flex-col items-center justify-center min-h-[52px] py-1 transition-all rounded-xl relative ${
            activeTab === 'downloads'
              ? 'text-amber-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 font-medium'
          }`}
          aria-label={`Downloads Tab, ${activeTasksCount > 0 ? `${activeTasksCount} active tasks` : `${completedTasksCount} items`}`}
          aria-selected={activeTab === 'downloads'}
          role="tab"
        >
          <div className="relative">
            <FolderDown
              className={`w-5 h-5 transition-transform ${
                activeTab === 'downloads' ? 'scale-110' : ''
              }`}
            />
            {/* Red/Amber badge matching reference screenshot badge "2" */}
            {(activeTasksCount > 0 || completedTasksCount > 0) && (
              <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-in fade-in">
                {activeTasksCount > 0 ? activeTasksCount : completedTasksCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Downloads</span>
        </button>

        {/* Tab 3: Settings */}
        <button
          onClick={() => handleTabClick('settings', 'Settings')}
          className={`flex flex-col items-center justify-center min-h-[52px] py-1 transition-all rounded-xl relative ${
            activeTab === 'settings'
              ? 'text-amber-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 font-medium'
          }`}
          aria-label="Settings Tab"
          aria-selected={activeTab === 'settings'}
          role="tab"
        >
          <div className="relative">
            <SettingsIcon
              className={`w-5 h-5 transition-transform ${
                activeTab === 'settings' ? 'scale-110' : ''
              }`}
            />
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Settings</span>
        </button>
      </div>
    </nav>
  );
};
