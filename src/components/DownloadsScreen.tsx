import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Folder,
  Film,
  Music,
  ArrowUpDown,
  Play,
  Pause,
  RotateCcw,
  X,
  Share2,
  Edit2,
  Trash2,
  Info,
  MoreVertical,
  DownloadCloud,
} from 'lucide-react';
import { formatBytes, formatDate } from '../services/downloadEngine';
import { DownloadTask, SortField, SortOrder } from '../types';

export const DownloadsScreen: React.FC = () => {
  const {
    downloadsCategory,
    setDownloadsCategory,
    filteredDownloads,
    downloads,
    sortField,
    sortOrder,
    setSorting,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    retryDownload,
    openVideoPlayer,
    openAudioPlayer,
    setTaskToDelete,
    setTaskToRename,
    setFileInfoTask,
    announceTalkBack,
  } = useApp();

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  const activeDownloadingCount = downloads.filter(
    d => d.status === 'downloading' || d.status === 'paused' || d.status === 'queued'
  ).length;

  interface CategoryTab {
    id: 'all' | 'videos' | 'music' | 'downloading';
    label: string;
    badge?: number;
  }

  const categories: CategoryTab[] = [
    { id: 'all', label: 'All' },
    { id: 'videos', label: 'Videos' },
    { id: 'music', label: 'Music' },
    {
      id: 'downloading',
      label: 'Downloading',
      badge: activeDownloadingCount > 0 ? activeDownloadingCount : undefined,
    },
  ];

  const handleNativeShare = async (task: DownloadTask) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: `Sharing ${task.title} from All in One Downloader`,
          url: task.originalUrl,
        });
      } catch {
        // cancelled
      }
    } else {
      announceTalkBack(`Sharing ${task.title}`);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(task.originalUrl);
        alert(`Media URL copied to clipboard:\n${task.originalUrl}`);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-20">
      {/* Top Header Bar */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">
          My Files
        </h1>

        <div className="flex items-center gap-1">
          {/* Sort By Button */}
          <button
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Open Sort By menu"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">Sort</span>
          </button>
        </div>
      </div>

      {/* Sort Menu Dropdown / Drawer */}
      {isSortMenuOpen && (
        <div className="mx-4 mb-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-xs font-semibold text-zinc-400">
            <span>Sort Files By</span>
            <button
              onClick={() => setIsSortMenuOpen(false)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => {
                setSorting('date', sortOrder === 'desc' ? 'asc' : 'desc');
                setIsSortMenuOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                sortField === 'date'
                  ? 'bg-amber-400/20 text-amber-400 font-semibold'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})
            </button>

            <button
              onClick={() => {
                setSorting('name', sortOrder === 'asc' ? 'desc' : 'asc');
                setIsSortMenuOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                sortField === 'name'
                  ? 'bg-amber-400/20 text-amber-400 font-semibold'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              File Name ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
            </button>

            <button
              onClick={() => {
                setSorting('size', sortOrder === 'desc' ? 'asc' : 'desc');
                setIsSortMenuOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                sortField === 'size'
                  ? 'bg-amber-400/20 text-amber-400 font-semibold'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              File Size ({sortOrder === 'desc' ? 'Largest' : 'Smallest'})
            </button>

            <button
              onClick={() => {
                setSorting('duration', sortOrder === 'desc' ? 'asc' : 'desc');
                setIsSortMenuOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                sortField === 'duration'
                  ? 'bg-amber-400/20 text-amber-400 font-semibold'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              Duration
            </button>
          </div>
        </div>
      )}

      {/* Secondary Categories Horizontal Tabs matching reference screenshot 2 */}
      <div className="px-4 border-b border-zinc-800/80">
        <div className="flex space-x-6 overflow-x-auto no-scrollbar" role="tablist">
          {categories.map(cat => {
            const isActive = downloadsCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setDownloadsCategory(cat.id);
                  announceTalkBack(`Showing ${cat.label} category`);
                }}
                className={`relative pb-3 text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge !== undefined && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[10px] font-bold rounded-full">
                    {cat.badge}
                  </span>
                )}
                {/* Active Indicator Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main List Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filteredDownloads.length === 0 ? (
          /* Empty state matching reference screenshot 2 */
          <div className="py-16 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
              <DownloadCloud className="w-10 h-10 text-zinc-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-300">
                {downloadsCategory === 'downloading'
                  ? 'No download task'
                  : 'No files in this category'}
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                {downloadsCategory === 'downloading'
                  ? 'Active downloads will appear here with live speed and remaining time.'
                  : 'Downloaded videos and audio will be saved and organized here.'}
              </p>
            </div>
          </div>
        ) : (
          filteredDownloads.map(task => {
            const isActiveDownload =
              task.status === 'downloading' ||
              task.status === 'paused' ||
              task.status === 'queued' ||
              task.status === 'failed';

            return (
              <div
                key={task.id}
                className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 space-y-3 transition-all hover:border-zinc-700 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail / Icon */}
                  <div
                    onClick={() => {
                      if (!isActiveDownload) {
                        task.fileType === 'video'
                          ? openVideoPlayer(task)
                          : openAudioPlayer(task);
                      }
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 ${
                      !isActiveDownload ? 'cursor-pointer group' : ''
                    }`}
                  >
                    <img
                      src={task.thumbnailUrl}
                      alt={task.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {!isActiveDownload && (
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                        <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {task.durationFormatted && (
                      <span className="absolute bottom-1 right-1 px-1 bg-black/80 text-[9px] font-mono font-medium rounded text-white">
                        {task.durationFormatted}
                      </span>
                    )}
                  </div>

                  {/* Title and metadata */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-snug">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1 font-medium">
                      <span className="flex items-center gap-1 text-amber-400">
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
                      <span>{task.platform}</span>
                    </div>
                  </div>

                  {/* Menu button for completed items */}
                  {!isActiveDownload && (
                    <div className="relative shrink-0">
                      <button
                        onClick={() =>
                          setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id)
                        }
                        className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

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
                            <span>Play</span>
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
                            <span>Details</span>
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
                  )}
                </div>

                {/* Active Downloading Progress Bar & Controls */}
                {isActiveDownload && (
                  <div className="space-y-2 pt-1 border-t border-zinc-800/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400">
                        {formatBytes(task.downloadedBytes)} / {formatBytes(task.totalSizeBytes)}
                      </span>
                      <span className="font-mono font-bold text-amber-400">
                        {task.progressPercent}%
                      </span>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          task.status === 'paused' ? 'bg-zinc-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${task.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <div>
                        {task.status === 'paused' ? (
                          <span className="text-amber-300 font-semibold">Paused</span>
                        ) : (
                          <span>
                            Speed:{' '}
                            <strong className="text-zinc-200 font-mono">
                              {formatBytes(task.speedBytesPerSec)}/s
                            </strong>{' '}
                            · ETA:{' '}
                            <strong className="text-zinc-200 font-mono">
                              {task.remainingSeconds}s
                            </strong>
                          </span>
                        )}
                      </div>

                      {/* Download controls: Pause, Resume, Cancel, Retry */}
                      <div className="flex items-center gap-1.5">
                        {task.status === 'downloading' && (
                          <button
                            onClick={() => pauseDownload(task.id)}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1"
                            aria-label={`Pause ${task.title}`}
                          >
                            <Pause className="w-3 h-3" />
                            <span>Pause</span>
                          </button>
                        )}

                        {task.status === 'paused' && (
                          <button
                            onClick={() => resumeDownload(task.id)}
                            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-lg text-xs flex items-center gap-1"
                            aria-label={`Resume ${task.title}`}
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Resume</span>
                          </button>
                        )}

                        {task.status === 'failed' && (
                          <button
                            onClick={() => retryDownload(task.id)}
                            className="px-2.5 py-1 bg-amber-400 text-black font-semibold rounded-lg text-xs flex items-center gap-1"
                            aria-label={`Retry ${task.title}`}
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        )}

                        <button
                          onClick={() => cancelDownload(task.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800"
                          aria-label={`Cancel ${task.title}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
