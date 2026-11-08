import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DownloadCloud,
  Bell,
  Moon,
  Sun,
  Globe,
  Info,
  Shield,
  FileText,
  ChevronRight,
  Folder,
  Sliders,
  Check,
  X,
  Smartphone,
  Eye,
} from 'lucide-react';
import { NotificationSettingsScreen } from './NotificationSettingsScreen';

export const SettingsScreen: React.FC = () => {
  const {
    settingsSubPage,
    setSettingsSubPage,
    settings,
    updateSettings,
    toggleTheme,
    talkBackEnabled,
    setTalkBackEnabled,
    announceTalkBack,
  } = useApp();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [isAudioFormatModalOpen, setIsAudioFormatModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  // If inside Notification Settings screen, render that sub-page
  if (settingsSubPage === 'notifications') {
    return <NotificationSettingsScreen />;
  }

  // If inside About page
  if (settingsSubPage === 'about') {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-24 text-zinc-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsSubPage('main')}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-300"
            aria-label="Back to settings"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-lg font-bold">About All in One Downloader</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden shadow-xl border border-zinc-700">
            <img
              src="/app_icon.svg"
              alt="All in One Downloader Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">ALL IN ONE DOWNLOADER</h2>
            <p className="text-xs text-amber-400 font-mono mt-0.5">Version 3.2.0 (Build 402)</p>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
            A modern, fast, and accessible Android media downloader with native Share Sheet integration, customizable audio/video bitrates, and built-in playback engine.
          </p>
        </div>

        <div className="space-y-3 text-xs text-zinc-400">
          <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-2">
            <h3 className="font-semibold text-zinc-200">Architecture &amp; Features</h3>
            <ul className="space-y-1 list-disc pl-4 text-[11px]">
              <li>Android ACTION_SEND Intent &amp; Web Share Target API</li>
              <li>ExoPlayer / Media3 compatible media playback layer</li>
              <li>IndexedDB &amp; LocalStorage persistent download queue</li>
              <li>Multi-resolution video streaming and audio extraction</li>
              <li>WCAG 2.1 AA TalkBack screen reader accessibility</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // If inside Privacy or Terms
  if (settingsSubPage === 'privacy' || settingsSubPage === 'terms') {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-24 text-zinc-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsSubPage('main')}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-300"
            aria-label="Back to settings"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-lg font-bold">
            {settingsSubPage === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
          </h1>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 text-xs text-zinc-300 leading-relaxed">
          <h3 className="font-semibold text-zinc-100">Platform Terms &amp; Compliance</h3>
          <p>
            All in One Downloader respects user privacy and copyright guidelines. The application processes media streams locally on your device and does not upload, log, or track your personal browsing data or downloaded files to external servers.
          </p>
          <p>
            Users are solely responsible for ensuring they have appropriate rights or permissions to download content under applicable local laws and intellectual property rights.
          </p>
        </div>
      </div>
    );
  }

  // Helper toggle for download settings
  const toggleDownloadSetting = (
    key: keyof typeof settings.downloadSettings,
    label: string
  ) => {
    updateSettings(s => {
      const current = s.downloadSettings[key];
      const nextVal = typeof current === 'boolean' ? !current : current;
      announceTalkBack(`${label} ${nextVal ? 'enabled' : 'disabled'}`);
      return {
        ...s,
        downloadSettings: {
          ...s.downloadSettings,
          [key]: nextVal,
        },
      };
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 pb-24 text-zinc-100">
      {/* Top Header matching reference screenshot 3 */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* SECTION 1: GENERAL */}
      <section className="space-y-3" aria-labelledby="general-settings-heading">
        <h2 id="general-settings-heading" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          General
        </h2>

        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden shadow-sm">
          {/* Notification settings item matching reference screenshot 3 */}
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

          {/* Theme item */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
            aria-label={`Theme: ${settings.theme}`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center">
                <Moon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-zinc-100">Theme</span>
                <p className="text-[11px] text-zinc-400 capitalize">
                  {settings.theme === 'dark'
                    ? 'Dark Theme'
                    : settings.theme === 'light'
                    ? 'Light Theme'
                    : 'System Default'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>

          {/* Language item */}
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
            aria-label={`Language: ${settings.language}`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center">
                <Globe className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-zinc-100">Language</span>
                <p className="text-[11px] text-zinc-400">{settings.language}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>

          {/* Accessibility TalkBack Simulation Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center">
                <Eye className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-zinc-100">
                  TalkBack Assistant Simulation
                </span>
                <p className="text-[11px] text-zinc-400">
                  Visual speech announcements for accessibility
                </p>
              </div>
            </div>

            <button
              role="switch"
              aria-checked={talkBackEnabled}
              onClick={() => {
                setTalkBackEnabled(!talkBackEnabled);
                announceTalkBack(`TalkBack simulation ${!talkBackEnabled ? 'enabled' : 'disabled'}`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                talkBackEnabled ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  talkBackEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* About Application */}
          <button
            onClick={() => setSettingsSubPage('about')}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
            aria-label="About Application"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center">
                <Info className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-zinc-100">
                  About Application
                </span>
                <p className="text-[11px] text-zinc-400">v3.2.0 (Build 402)</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>

          {/* Privacy & Terms */}
          <button
            onClick={() => setSettingsSubPage('privacy')}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
            aria-label="Privacy Policy"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-100">
                Privacy Policy
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </section>

      {/* SECTION 2: DOWNLOAD SETTINGS */}
      <section className="space-y-3 pt-2" aria-labelledby="download-settings-heading">
        <h2 id="download-settings-heading" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Download Settings
        </h2>

        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden shadow-sm">
          {/* Default Video Quality */}
          <button
            onClick={() => setIsQualityModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
          >
            <div>
              <span className="text-sm font-semibold text-zinc-100">
                Default Video Quality
              </span>
              <p className="text-[11px] text-zinc-400">
                {settings.downloadSettings.defaultVideoQuality} High Definition
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>

          {/* Default Audio Format */}
          <button
            onClick={() => setIsAudioFormatModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
          >
            <div>
              <span className="text-sm font-semibold text-zinc-100">
                Default Audio Format
              </span>
              <p className="text-[11px] text-zinc-400 uppercase">
                {settings.downloadSettings.defaultAudioFormat} (High Bitrate)
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>

          {/* Download Location */}
          <div className="p-4 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-sm font-semibold text-zinc-100">
                Download Location
              </span>
              <p className="text-[11px] text-zinc-400 truncate font-mono">
                {settings.downloadSettings.defaultDownloadLocation}
              </p>
            </div>
            <Folder className="w-5 h-5 text-amber-400 shrink-0" />
          </div>

          {/* Simultaneous Limit */}
          <button
            onClick={() => setIsLimitModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
          >
            <div>
              <span className="text-sm font-semibold text-zinc-100">
                Simultaneous Download Limit
              </span>
              <p className="text-[11px] text-zinc-400">
                Max {settings.downloadSettings.simultaneousLimit} concurrent downloads
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </button>

          {/* Automatic Clipboard Detection */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-zinc-100">
                Automatic Clipboard Link Detection
              </span>
              <p className="text-[11px] text-zinc-400">
                Auto-prompt when copied video link is detected
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.autoClipboardDetection}
              onClick={() =>
                toggleDownloadSetting('autoClipboardDetection', 'Auto clipboard detection')
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                settings.downloadSettings.autoClipboardDetection ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.downloadSettings.autoClipboardDetection ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Ask Before Downloading */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-zinc-100">
                Ask Before Downloading
              </span>
              <p className="text-[11px] text-zinc-400">
                Always show format &amp; resolution picker sheet
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.askBeforeDownloading}
              onClick={() =>
                toggleDownloadSetting('askBeforeDownloading', 'Ask before downloading')
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                settings.downloadSettings.askBeforeDownloading ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.downloadSettings.askBeforeDownloading ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Download Over Wi-Fi Only */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-zinc-100">
                Download Over Wi-Fi Only
              </span>
              <p className="text-[11px] text-zinc-400">
                Prevent downloading on mobile cellular data
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.downloadOverWifiOnly}
              onClick={() =>
                toggleDownloadSetting('downloadOverWifiOnly', 'Download over Wi-Fi only')
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                settings.downloadSettings.downloadOverWifiOnly ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.downloadSettings.downloadOverWifiOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Background Download Support */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-zinc-100">
                Background Download Support
              </span>
              <p className="text-[11px] text-zinc-400">
                Keep downloading when app is minimized
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.backgroundDownloadSupport}
              onClick={() =>
                toggleDownloadSetting('backgroundDownloadSupport', 'Background download support')
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                settings.downloadSettings.backgroundDownloadSupport ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.downloadSettings.backgroundDownloadSupport ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Keep Screen Awake */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-zinc-100">
                Keep Screen Awake
              </span>
              <p className="text-[11px] text-zinc-400">
                Prevent device screen from sleeping during active download
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.keepScreenAwake}
              onClick={() =>
                toggleDownloadSetting('keepScreenAwake', 'Keep screen awake')
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                settings.downloadSettings.keepScreenAwake ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.downloadSettings.keepScreenAwake ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Theme Selection Modal */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-zinc-100">Select Theme</h3>
            <div className="space-y-1">
              {[
                { id: 'dark', label: 'Dark Theme' },
                { id: 'light', label: 'Light Theme' },
                { id: 'system', label: 'System Default' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    toggleTheme(item.id as any);
                    setIsThemeModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 text-sm font-medium text-left"
                >
                  <span className={settings.theme === item.id ? 'text-amber-400 font-bold' : 'text-zinc-200'}>
                    {item.label}
                  </span>
                  {settings.theme === item.id && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsThemeModalOpen(false)}
              className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-zinc-100">Select Language</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {['English', 'Español', 'Français', 'Deutsch', 'हिन्दी', 'العربية', '日本語'].map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    updateSettings(s => ({ ...s, language: lang }));
                    announceTalkBack(`Language set to ${lang}`);
                    setIsLanguageModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 text-sm font-medium text-left"
                >
                  <span className={settings.language === lang ? 'text-amber-400 font-bold' : 'text-zinc-200'}>
                    {lang}
                  </span>
                  {settings.language === lang && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsLanguageModalOpen(false)}
              className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quality Selection Modal */}
      {isQualityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-zinc-100">Default Video Quality</h3>
            <div className="space-y-1">
              {['1080p', '720p', '480p', '360p'].map(quality => (
                <button
                  key={quality}
                  onClick={() => {
                    updateSettings(s => ({
                      ...s,
                      downloadSettings: { ...s.downloadSettings, defaultVideoQuality: quality },
                    }));
                    announceTalkBack(`Default video quality set to ${quality}`);
                    setIsQualityModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 text-sm font-medium text-left"
                >
                  <span
                    className={
                      settings.downloadSettings.defaultVideoQuality === quality
                        ? 'text-amber-400 font-bold'
                        : 'text-zinc-200'
                    }
                  >
                    {quality} High Definition
                  </span>
                  {settings.downloadSettings.defaultVideoQuality === quality && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsQualityModalOpen(false)}
              className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Audio Format Modal */}
      {isAudioFormatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-zinc-100">Default Audio Format</h3>
            <div className="space-y-1">
              {[
                { id: 'mp3', label: 'MP3 (Universal 256/320kbps)' },
                { id: 'm4a', label: 'M4A (AAC High Fidelity)' },
              ].map(fmt => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    updateSettings(s => ({
                      ...s,
                      downloadSettings: { ...s.downloadSettings, defaultAudioFormat: fmt.id },
                    }));
                    announceTalkBack(`Default audio format set to ${fmt.id.toUpperCase()}`);
                    setIsAudioFormatModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 text-sm font-medium text-left"
                >
                  <span
                    className={
                      settings.downloadSettings.defaultAudioFormat === fmt.id
                        ? 'text-amber-400 font-bold'
                        : 'text-zinc-200'
                    }
                  >
                    {fmt.label}
                  </span>
                  {settings.downloadSettings.defaultAudioFormat === fmt.id && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsAudioFormatModalOpen(false)}
              className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Limit Modal */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-zinc-100">Simultaneous Limit</h3>
            <div className="space-y-1">
              {[1, 2, 3, 5].map(num => (
                <button
                  key={num}
                  onClick={() => {
                    updateSettings(s => ({
                      ...s,
                      downloadSettings: { ...s.downloadSettings, simultaneousLimit: num },
                    }));
                    announceTalkBack(`Simultaneous limit set to ${num}`);
                    setIsLimitModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 text-sm font-medium text-left"
                >
                  <span
                    className={
                      settings.downloadSettings.simultaneousLimit === num
                        ? 'text-amber-400 font-bold'
                        : 'text-zinc-200'
                    }
                  >
                    {num} download{num > 1 ? 's' : ''} at once
                  </span>
                  {settings.downloadSettings.simultaneousLimit === num && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsLimitModalOpen(false)}
              className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
