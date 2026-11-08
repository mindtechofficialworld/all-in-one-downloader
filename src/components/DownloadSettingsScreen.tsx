import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Folder,
  Check,
  ChevronRight,
  HardDrive,
  Sliders,
  Wifi,
  Sparkles,
} from 'lucide-react';

export const DownloadSettingsScreen: React.FC = () => {
  const { setSettingsSubPage, settings, updateSettings, announceTalkBack } = useApp();

  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [customPath, setCustomPath] = useState(settings.downloadSettings.defaultDownloadLocation);

  const toggleSetting = (
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

  const handleSavePath = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPath.trim()) {
      updateSettings(s => ({
        ...s,
        downloadSettings: {
          ...s.downloadSettings,
          defaultDownloadLocation: customPath.trim(),
        },
      }));
      setIsPathModalOpen(false);
      announceTalkBack(`Download location saved to ${customPath.trim()}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 pb-24 text-zinc-100">
      {/* Top Header with Back button (<) matching user specification */}
      <div className="flex items-center gap-3 py-2 border-b border-zinc-800/80">
        <button
          onClick={() => {
            setSettingsSubPage('main');
            announceTalkBack('Returned to Settings');
          }}
          className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
          aria-label="Back to settings"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Download settings</h1>
      </div>

      {/* Primary Configuration Section */}
      <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden shadow-sm">
        {/* Default Video Quality */}
        <button
          onClick={() => setIsQualityModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
        >
          <div className="space-y-0.5">
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
          onClick={() => setIsAudioModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
        >
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-zinc-100">
              Default Audio Format
            </span>
            <p className="text-[11px] text-zinc-400 uppercase">
              {settings.downloadSettings.defaultAudioFormat} (High Bitrate 320 kbps)
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-500" />
        </button>

        {/* Download Location */}
        <button
          onClick={() => {
            setCustomPath(settings.downloadSettings.defaultDownloadLocation);
            setIsPathModalOpen(true);
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
        >
          <div className="min-w-0 pr-3 space-y-0.5">
            <span className="text-sm font-semibold text-zinc-100">
              Download Location
            </span>
            <p className="text-[11px] text-zinc-400 truncate font-mono">
              {settings.downloadSettings.defaultDownloadLocation}
            </p>
          </div>
          <Folder className="w-5 h-5 text-amber-400 shrink-0" />
        </button>

        {/* Simultaneous Download Limit */}
        <button
          onClick={() => setIsLimitModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/60 transition-colors text-left"
        >
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-zinc-100">
              Simultaneous Download Limit
            </span>
            <p className="text-[11px] text-zinc-400">
              Max {settings.downloadSettings.simultaneousLimit} concurrent downloads
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      {/* Network & Behavior Toggles */}
      <section className="space-y-3" aria-labelledby="behavior-heading">
        <h2 id="behavior-heading" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Download Rules
        </h2>

        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden shadow-sm">
          {/* Download Over Wi-Fi Only */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-zinc-100">
                Download Over Wi-Fi Only
              </span>
              <p className="text-[11px] text-zinc-400">
                Prevent downloading on cellular data to save mobile balance
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.downloadOverWifiOnly}
              onClick={() =>
                toggleSetting('downloadOverWifiOnly', 'Download over Wi-Fi only')
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

          {/* Automatic Clipboard Link Detection */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-zinc-100">
                Auto Clipboard Link Detection
              </span>
              <p className="text-[11px] text-zinc-400">
                Quick prompt when a copied video/audio link is detected
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.autoClipboardDetection}
              onClick={() =>
                toggleSetting('autoClipboardDetection', 'Auto clipboard detection')
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
            <div className="space-y-0.5">
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
                toggleSetting('askBeforeDownloading', 'Ask before downloading')
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

          {/* Background Download Support */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-zinc-100">
                Background Download Support
              </span>
              <p className="text-[11px] text-zinc-400">
                Keep downloading when the app is minimized
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.backgroundDownloadSupport}
              onClick={() =>
                toggleSetting('backgroundDownloadSupport', 'Background download support')
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
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-zinc-100">
                Keep Screen Awake
              </span>
              <p className="text-[11px] text-zinc-400">
                Prevent display timeout while actively downloading
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.downloadSettings.keepScreenAwake}
              onClick={() =>
                toggleSetting('keepScreenAwake', 'Keep screen awake')
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

      {/* Video Quality Modal */}
      {isQualityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-zinc-100">Default Video Quality</h3>
            <div className="space-y-1">
              {['4K', '1080p', '720p', '480p', '360p'].map(quality => (
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
                    {quality}
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
      {isAudioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-zinc-100">Default Audio Format</h3>
            <div className="space-y-1">
              {[
                { id: 'mp3', label: 'MP3 (High Quality 320 kbps)' },
                { id: 'm4a', label: 'M4A (Standard AAC)' },
              ].map(fmt => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    updateSettings(s => ({
                      ...s,
                      downloadSettings: { ...s.downloadSettings, defaultAudioFormat: fmt.id },
                    }));
                    announceTalkBack(`Default audio format set to ${fmt.id.toUpperCase()}`);
                    setIsAudioModalOpen(false);
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
              onClick={() => setIsAudioModalOpen(false)}
              className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Simultaneous Limit Modal */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
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

      {/* Custom Path Edit Modal */}
      {isPathModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-100">Storage Location</h3>
            <form onSubmit={handleSavePath} className="space-y-3">
              <input
                type="text"
                value={customPath}
                onChange={e => setCustomPath(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-400"
                placeholder="/storage/emulated/0/Download/AllInOne"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsPathModalOpen(false)}
                  className="py-2 px-3 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
