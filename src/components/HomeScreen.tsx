import React, { useState } from 'react';
import {
  Search,
  Clipboard,
  X,
  ArrowDownToLine,
  Loader2,
  Share2,
  Film,
  Music,
  Play,
  MoreVertical,
  Trash2,
  Edit2,
  Info,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_URLS } from '../services/mediaParser';
import { formatBytes, formatDate } from '../services/downloadEngine';
import { DownloadTask } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    downloads,
    analyzeAndOpen,
    analyzingUrl,
    openVideoPlayer,
    openAudioPlayer,
    setTaskToDelete,
    setTaskToRename,
    setFileInfoTask,
    setIsShareSheetOpen,
    announceTalkBack,
  } = useApp();

  const [inputUrl, setInputUrl] = useState('');
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          announceTalkBack('Pasted URL from clipboard');
        }
      } else {
        // Fallback to sample URL
        setInputUrl('https://youtu.be/m98kL2sY10A');
        announceTalkBack('Pasted sample URL');
      }
    } catch {
      // If permission denied in iframe, use sample
      setInputUrl('https://youtu.be/m98kL2sY10A');
      announceTalkBack('Pasted sample URL');
    }
  };

  const handleClear = () => {
    setInputUrl('');
    announceTalkBack('Cleared input URL');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) {
      announceTalkBack('Please enter or paste a video link first');
      return;
    }
    const success = await analyzeAndOpen(inputUrl);
    if (success) {
      setInputUrl('');
    }
  };

  const handleQuickSample = async (sampleUrl: string, sampleLabel: string) => {
    setInputUrl(sampleUrl);
    announceTalkBack(`Selected sample: ${sampleLabel}`);
    await analyzeAndOpen(sampleUrl);
  };

  const handleNativeShare = async (task: DownloadTask) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: `Check out ${task.title} downloaded with All in One Downloader!`,
          url: task.originalUrl,
        });
      } catch {
        // cancelled or failed
      }
    } else {
      announceTalkBack(`Sharing ${task.title}`);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(task.originalUrl);
        alert(`Link copied to clipboard:\n${task.originalUrl}`);
      }
    }
  };

  // Recent completed downloads or filtered if searching
  const recentDownloads = downloads
    .filter(t => t.status === 'completed')
    .filter(t => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        t.title.toLowerCase().includes(q) ||
        t.format.toLowerCase().includes(q) ||
        t.fileType.toLowerCase().includes(q)
      );
    })
    .slice(0, 15);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-24">
      {/* A. Top Search Bar */}
      <div className="relative">
        <label htmlFor="search-downloads" className="sr-only">
          Search downloaded files
        </label>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
          <input
            id="search-downloads"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search downloaded files..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-10 pr-9 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Android APK Ready & Share Sheet Section */}
      <div className="space-y-2.5">
        {/* Direct APK Download Card */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-amber-400/15 to-zinc-900 border-2 border-emerald-400/60 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-black flex items-center justify-center shrink-0 shadow-md font-bold">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 bg-emerald-400 text-black text-[10px] font-extrabold rounded-full uppercase">
                  APK READY
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">v1.0.0</span>
              </div>
              <h4 className="text-sm font-extrabold text-zinc-100 truncate mt-0.5">
                AllInOneDownloader.apk
              </h4>
              <p className="text-[11px] text-emerald-400 font-medium">
                GitHub Actions ने आपका APK सफलतापूर्वक बना दिया है (~6.1 MB)
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <a
              href="/AllInOneDownloader.apk"
              download="AllInOneDownloader.apk"
              className="px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              aria-label="Download built Android APK"
            >
              <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              <span>डाउनलोड APK</span>
            </a>

            <a
              href="https://github.com/mindtechofficialworld/all-in-one-downloader/actions"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-zinc-400 hover:text-zinc-200 text-center underline"
            >
              GitHub पर देखें →
            </a>
          </div>
        </div>

        {/* Share Sheet Simulator */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-zinc-200">
                Android Share Sheet Integration
              </h5>
              <p className="text-[10px] text-zinc-400 truncate">
                YouTube, TikTok, Facebook से सीधे लिंक शेयर टेस्ट करें
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShareSheetOpen(true)}
            className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 font-semibold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1"
            aria-label="Test Android Share Intent"
          >
            <span>Test Share</span>
          </button>
        </div>
      </div>

      {/* B. URL Input Section */}
      <section className="space-y-3" aria-labelledby="url-input-heading">
        <div className="flex items-center justify-between">
          <h2 id="url-input-heading" className="text-sm font-bold text-zinc-200 tracking-tight">
            Download Online Media
          </h2>
          <span className="text-[11px] text-zinc-400">Audio &amp; Video</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="relative flex items-center">
            <input
              type="url"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="Paste video or audio link here"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-3.5 pr-20 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-inner"
              aria-label="Paste video or audio link here"
            />

            <div className="absolute right-2 flex items-center gap-1">
              {inputUrl ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label="Clear URL"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="px-2 py-1 text-xs font-medium text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 rounded-lg flex items-center gap-1 transition-colors"
                  aria-label="Paste from clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={analyzingUrl}
            className="w-full h-12 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-black font-bold text-sm rounded-2xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            aria-label="Process link and fetch download formats"
          >
            {analyzingUrl ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Retrieving Media Information...</span>
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
                <span>Download Media</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Platform Test Chips */}
        <div className="pt-1">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Try 1-tap viral samples:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_URLS.map(sample => (
              <button
                key={sample.label}
                onClick={() => handleQuickSample(sample.url, sample.label)}
                className="px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-medium text-zinc-300 hover:text-amber-400 transition-all flex items-center gap-1"
                aria-label={`Test ${sample.label}`}
              >
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* C. Recent Downloads Section */}
      <section className="space-y-3 pt-2" aria-labelledby="recent-downloads-heading">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id="recent-downloads-heading" className="text-sm font-bold text-zinc-100 tracking-tight">
              Recent Downloads
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              ({recentDownloads.length})
            </span>
          </div>

          {recentDownloads.length > 0 && (
            <span className="text-[11px] text-zinc-400 font-medium">
              Tap to play
            </span>
          )}
        </div>

        {recentDownloads.length === 0 ? (
          /* Friendly Empty State matching prompt */
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-800/80 text-zinc-400 flex items-center justify-center">
              <Film className="w-7 h-7 text-zinc-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">No downloads yet.</p>
              <p className="text-xs text-zinc-400 mt-1">Paste a link to get started.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentDownloads.map(task => (
              <div
                key={task.id}
                className="relative bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800/80 rounded-2xl p-3 flex items-center gap-3 transition-all hover:border-zinc-700 shadow-sm"
              >
                {/* Thumbnail with Play Icon Overlay */}
                <button
                  onClick={() =>
                    task.fileType === 'video' ? openVideoPlayer(task) : openAudioPlayer(task)
                  }
                  className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-950 shrink-0 group focus:outline-none focus:ring-2 focus:ring-amber-400"
                  aria-label={`Play ${task.title}`}
                >
                  <img
                    src={task.thumbnailUrl}
                    alt={task.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-7 h-7 rounded-full bg-amber-400/90 text-black flex items-center justify-center shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  {task.durationFormatted && (
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-[9px] font-mono font-semibold text-white rounded">
                      {task.durationFormatted}
                    </span>
                  )}
                </button>

                {/* Details */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() =>
                    task.fileType === 'video' ? openVideoPlayer(task) : openAudioPlayer(task)
                  }
                >
                  <h3 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-snug">
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1.5 font-medium">
                    <span className="flex items-center gap-1 text-amber-400/90">
                      {task.fileType === 'video' ? (
                        <Film className="w-3 h-3" />
                      ) : (
                        <Music className="w-3 h-3" />
                      )}
                      <span>{task.quality || task.format.toUpperCase()}</span>
                    </span>
                    <span>·</span>
                    <span className="font-mono">{formatBytes(task.totalSizeBytes)}</span>
                    <span>·</span>
                    <span>{formatDate(task.dateCompleted || task.dateAdded)}</span>
                  </div>
                </div>

                {/* Actions Dropdown Toggle */}
                <div className="relative shrink-0">
                  <button
                    onClick={() =>
                      setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id)
                    }
                    className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
                    aria-label={`Actions for ${task.title}`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Context Menu Popover */}
                  {activeMenuTaskId === task.id && (
                    <div className="absolute right-0 top-8 z-30 w-44 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl py-1.5 animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => {
                          setActiveMenuTaskId(null);
                          task.fileType === 'video'
                            ? openVideoPlayer(task)
                            : openAudioPlayer(task);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 text-amber-400" />
                        <span>Play File</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenuTaskId(null);
                          handleNativeShare(task);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Share</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenuTaskId(null);
                          setTaskToRename(task);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Rename</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenuTaskId(null);
                          setFileInfoTask(task);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Info className="w-3.5 h-3.5 text-zinc-400" />
                        <span>File Information</span>
                      </button>

                      <div className="my-1 border-t border-zinc-800" />

                      <button
                        onClick={() => {
                          setActiveMenuTaskId(null);
                          setTaskToDelete(task);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
