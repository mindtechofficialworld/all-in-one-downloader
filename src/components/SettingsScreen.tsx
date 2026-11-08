import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowDownToLine,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { NotificationSettingsScreen } from './NotificationSettingsScreen';
import { DownloadSettingsScreen } from './DownloadSettingsScreen';

export const SettingsScreen: React.FC = () => {
  const {
    settingsSubPage,
    setSettingsSubPage,
    announceTalkBack,
  } = useApp();

  // If inside Download Settings screen, render that dedicated sub-page
  if (settingsSubPage === 'download-settings') {
    return <DownloadSettingsScreen />;
  }

  // If inside Notification Settings screen, render that sub-page
  if (settingsSubPage === 'notifications') {
    return <NotificationSettingsScreen />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 pb-24 text-zinc-100">
      {/* Top Header matching reference screenshot 3 */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* SECTION: GENERAL with strictly the requested 2 items */}
      <section className="space-y-3" aria-labelledby="general-settings-heading">
        <h2 id="general-settings-heading" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          General
        </h2>

        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden shadow-sm">
          {/* 1. Download settings */}
          <button
            onClick={() => {
              setSettingsSubPage('download-settings');
              announceTalkBack('Navigated to Download Settings');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
            aria-label="Download settings"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-zinc-100">
                  Download settings
                </span>
                <p className="text-[11px] text-zinc-400">
                  Default quality, location &amp; Wi-Fi
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>

          {/* 2. Notification settings */}
          <button
            onClick={() => {
              setSettingsSubPage('notifications');
              announceTalkBack('Navigated to Notification Settings');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
            aria-label="Notification settings"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-zinc-100">
                  Notification settings
                </span>
                <p className="text-[11px] text-zinc-400">
                  Download progress, alerts &amp; push
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </section>
    </div>
  );
};
