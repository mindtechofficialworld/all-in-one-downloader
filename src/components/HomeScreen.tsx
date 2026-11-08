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
  FolderOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
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
    announceTalkBack,
  } = useApp();

  const [inputUrl, setInputUrl] = useState('');
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInputUrl(text.trim());
          announceTalkBack('Pasted URL from clipboard');
          return;
        }
      }
      // Fallback
      setInputUrl('https://youtu.be/m98kL2sY10A');
      announceTalkBack('Pasted video URL');
    } catch {
      setInputUrl('https://youtu.be/m98kL2sY10A');
      announceTalkBack('Pasted video URL');
    }
  };

  const handleClear = () => {
    setInputUrl('');
    announceTalkBack('Cleared input URL');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) {
      announceTalkBack('Please paste a video or audio link first');
      return;
    }
    const success = await analyzeAndOpen(inputUrl);
    if (success) {
      setInputUrl('');
    }
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
        // cancelled
      }
    } else {
      announceTalkBack(`Sharing ${task.title}`);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(task.originalUrl);
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
      {/* 1. Top Search Bar */}
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
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-9 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all shadow-sm"
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

      {/* 2. URL Input Section - Clean, prominent with Paste button */}
      <section className="space-y-3" aria-labelledby="url-input-heading">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="Paste video or audio link here"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-4 pr-24 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-inner"
              aria-label="Paste video or audio link here"
            />

            <div className="absolute right-2 flex items-center gap-1">
              {inputUrl ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label="Clear URL"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="px-3 py-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
                  aria-label="Paste link"
                >
                  <Clipboard className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Paste link</span>
                </button>
              )}
            </div>
          </div>

          {/* Single Prominent Download Button */}
          <button
            type="submit"
            disabled={analyzingUrl}
            className="w-full h-12 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-black font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            aria-label="Download video or audio"
          >
            {analyzingUrl ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Retrieving Media Information...</span>
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
                <span>Download</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* 3. Recent Downloads Section */}
      <section className="space-y-3 pt-1" aria-labelledby="recent-downloads-heading">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id="recent-downloads-heading" className="text-sm font-bold text-zinc-100 tracking-tight">
              Recent Downloads
            </h2>
            {recentDownloads.length > 0 && (
              <span className="text-xs text-zinc-400 font-mono">
                ({recentDownloads.length})
              </span>
            )}
          </div>

          {recentDownloads.length > 0 && (
            <span className="text-[11px] text-zinc-400 font-medium">
              Tap to play
            </span>
          )}
        </div>

        {recentDownloads.length === 0 ? (
          /* Empty state matching user request: "No files here yet" */
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-10 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800/60 text-zinc-500 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-zinc-500 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">No files here yet</p>
              <p className="text-xs text-zinc-500 mt-1">Paste a video or audio link above to download</p>
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
                        <span>Open</span>
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
