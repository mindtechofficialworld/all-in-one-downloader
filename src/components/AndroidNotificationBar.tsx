import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowDownToLine, CheckCircle2, X, Play, Pause, ChevronUp, Bell } from 'lucide-react';
import { formatBytes } from '../services/downloadEngine';

export const AndroidNotificationBar: React.FC = () => {
  const {
    latestNotification,
    clearLatestNotification,
    isNotificationShadeOpen,
    setIsNotificationShadeOpen,
    downloads,
    pauseDownload,
    resumeDownload,
    openVideoPlayer,
    openAudioPlayer,
    setActiveTab,
    setDownloadsCategory,
  } = useApp();

  const activeDownloads = downloads.filter(d => d.status === 'downloading' || d.status === 'paused');

  return (
    <>
      {/* Floating Heads-Up Notification (Android Toast) */}
      {latestNotification && (
        <div className="absolute top-12 left-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-start justify-between gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 shrink-0">
              {latestNotification.type === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <ArrowDownToLine className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                  All In One Downloader
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">now</span>
              </div>
              <h4 className="text-sm font-semibold text-zinc-100 truncate mt-0.5">
                {latestNotification.title}
              </h4>
              <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5">
                {latestNotification.message}
              </p>
            </div>

            <button
              onClick={clearLatestNotification}
              className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pull-down Android Notification Drawer / Shade */}
      {isNotificationShadeOpen && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-start">
          <div className="bg-zinc-900 border-b border-zinc-800 p-4 rounded-b-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-200">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-sm">Android Notification Shade</span>
              </div>
              <button
                onClick={() => setIsNotificationShadeOpen(false)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                aria-label="Close notification shade"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>

            {/* Content of Shade */}
            <div className="mt-3 space-y-3">
              {activeDownloads.length === 0 ? (
                <div className="text-center py-6 text-zinc-400 text-xs">
                  No active downloads in progress.
                </div>
              ) : (
                activeDownloads.map(task => (
                  <div
                    key={task.id}
                    className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium truncate max-w-[200px]">
                        {task.title}
                      </span>
                      <span className="font-mono text-amber-400 font-semibold">
                        {task.progressPercent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${task.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>
                        {formatBytes(task.downloadedBytes)} / {formatBytes(task.totalSizeBytes)}
                      </span>
                      <span>
                        {task.status === 'paused'
                          ? 'Paused'
                          : `${formatBytes(task.speedBytesPerSec)}/s`}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {task.status === 'paused' ? (
                        <button
                          onClick={() => resumeDownload(task.id)}
                          className="px-3 py-1 bg-amber-400 text-black font-semibold rounded-lg text-xs flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" /> Resume
                        </button>
                      ) : (
                        <button
                          onClick={() => pauseDownload(task.id)}
                          className="px-3 py-1 bg-zinc-800 text-zinc-200 font-medium rounded-lg text-xs flex items-center gap-1 hover:bg-zinc-700"
                        >
                          <Pause className="w-3 h-3" /> Pause
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsNotificationShadeOpen(false);
                  setActiveTab('downloads');
                  setDownloadsCategory('downloading');
                }}
                className="text-xs text-amber-400 hover:underline"
              >
                View all downloads in app
              </button>
              <button
                onClick={() => setIsNotificationShadeOpen(false)}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Clear all
              </button>
            </div>
          </div>

          <div
            className="flex-1"
            onClick={() => setIsNotificationShadeOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
};
