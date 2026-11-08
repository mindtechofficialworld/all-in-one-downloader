import React from 'react';
import { useApp } from '../context/AppContext';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNotificationBar } from './AndroidNotificationBar';
import { BottomNavigation } from './BottomNavigation';
import { DownloadBottomSheet } from './DownloadBottomSheet';
import { BuiltInVideoPlayer } from './BuiltInVideoPlayer';
import { BuiltInAudioPlayer } from './BuiltInAudioPlayer';
import { ShareSheetModal } from './ShareSheetModal';
import { Modals } from './Modals';
import { TalkBackSimulator } from './TalkBackSimulator';
import { HomeScreen } from './HomeScreen';
import { DownloadsScreen } from './DownloadsScreen';
import { SettingsScreen } from './SettingsScreen';
import { Smartphone, Monitor } from 'lucide-react';

export const AndroidFrame: React.FC = () => {
  const { activeTab, viewMode, setViewMode, settingsSubPage } = useApp();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-0 md:p-4 select-none">
      {/* Top Desktop Controls Toolbar */}
      <header className="hidden md:flex items-center justify-between w-full max-w-5xl px-6 py-2.5 mb-2 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-[10px]">
            A
          </div>
          <span className="font-bold text-zinc-200 tracking-tight">ALL IN ONE DOWNLOADER</span>
          <span className="text-zinc-600">·</span>
          <span>Android 14 Material 3 Architecture</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-xl border border-zinc-700/60">
            <button
              onClick={() => setViewMode('phone')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'phone'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Phone View</span>
            </button>

            <button
              onClick={() => setViewMode('fullscreen')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'fullscreen'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Expanded Tablet/Web View</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main
        className={`relative w-full overflow-hidden flex flex-col bg-[#111114] text-zinc-100 transition-all duration-300 ${
          viewMode === 'phone'
            ? 'max-w-[420px] h-[100dvh] md:h-[860px] md:rounded-[44px] md:border-[10px] md:border-zinc-800/90 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] md:ring-1 md:ring-white/10'
            : 'max-w-4xl h-[100dvh] md:h-[880px] md:rounded-3xl md:border border-zinc-800 md:shadow-2xl'
        }`}
      >
        {/* Android Status Bar */}
        <AndroidStatusBar />

        {/* Android Notifications Shade & Floating Banners */}
        <AndroidNotificationBar />

        {/* Screen Content based on Active Tab */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'downloads' && <DownloadsScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </div>

        {/* Bottom Navigation (Hidden on dedicated sub-pages for native Android feel) */}
        {!(activeTab === 'settings' && settingsSubPage !== 'main') && <BottomNavigation />}

        {/* Android Navigation Gesture Bar */}
        <div className="py-1.5 bg-zinc-950 flex justify-center pointer-events-none">
          <div className="w-32 h-1 bg-zinc-600/80 rounded-full" />
        </div>

        {/* Bottom Sheets and Modals */}
        <DownloadBottomSheet />
        <BuiltInVideoPlayer />
        <BuiltInAudioPlayer />
        <ShareSheetModal />
        <Modals />
        <TalkBackSimulator />
      </main>
    </div>
  );
};
