import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
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
  Check,
  CheckSquare,
  Square,
  FolderOpen,
  ExternalLink,
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

  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  // Multi-selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      }
    }
  };

  // Long press detection for multi-selection
  const handleTouchStart = (taskId: string) => {
    longPressTimerRef.current = setTimeout(() => {
      setIsSelectionMode(true);
      setSelectedTaskIds([taskId]);
      announceTalkBack('Selection mode active. 1 item selected.');
    }, 550);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const toggleSelectTask = (taskId: string) => {
    setSelectedTaskIds(prev => {
      if (prev.includes(taskId)) {
        const next = prev.filter(id => id !== taskId);
        if (next.length === 0) {
          setIsSelectionMode(false);
        }
        return next;
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleSelectAllToggle = () => {
    const completedTasks = filteredDownloads.filter(t => t.status === 'completed');
    if (selectedTaskIds.length === completedTasks.length) {
      // Deselect all
      setSelectedTaskIds([]);
      setIsSelectionMode(false);
      announceTalkBack('Deselected all items');
    } else {
      // Select all
      setSelectedTaskIds(completedTasks.map(t => t.id));
      announceTalkBack(`Selected all ${completedTasks.length} items`);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedTaskIds.length === 0) return;
    const task = downloads.find(d => d.id === selectedTaskIds[0]);
    if (task) {
      setTaskToDelete(task);
    }
    setIsSelectionMode(false);
    setSelectedTaskIds([]);
  };

  const handleShareSelected = async () => {
    const selectedTasks = downloads.filter(d => selectedTaskIds.includes(d.id));
    if (selectedTasks.length === 0) return;
    const shareText = selectedTasks.map(t => `${t.title}: ${t.originalUrl}`).join('\n\n');
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedTasks.length} media links`,
          text: shareText,
        });
      } catch {
        // cancelled
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      announceTalkBack('Links copied to clipboard');
    }
    setIsSelectionMode(false);
    setSelectedTaskIds([]);
  };

  const completedFiltered = filteredDownloads.filter(t => t.status === 'completed');
  const allAreSelected = completedFiltered.length > 0 && selectedTaskIds.length === completedFiltered.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-20 relative">
      {/* Top Header Bar */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-zinc-800/60">
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">
          My Files
        </h1>

        <div className="flex items-center gap-1">
          {/* Sort By Button */}
          <button
            onClick={() => setIsSortModalOpen(true)}
            className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Open Sort By menu"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Clean Sort By Popup Menu */}
      {isSortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-100">Sort By</h3>
              <button
                onClick={() => setIsSortModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              {[
                { label: 'A to Z', field: 'name' as SortField, order: 'asc' as SortOrder },
                { label: 'Z to A', field: 'name' as SortField, order: 'desc' as SortOrder },
                { label: 'Largest to Smallest', field: 'size' as SortField, order: 'desc' as SortOrder },
                { label: 'Smallest to Largest', field: 'size' as SortField, order: 'asc' as SortOrder },
                { label: 'Oldest First', field: 'date' as SortField, order: 'asc' as SortOrder },
                { label: 'Newest First', field: 'date' as SortField, order: 'desc' as SortOrder },
              ].map(opt => {
                const isSelected = sortField === opt.field && sortOrder === opt.order;
                return (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSorting(opt.field, opt.order);
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                      isSelected
                        ? 'bg-amber-400/20 text-amber-400 font-bold'
                        : 'text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Categories Horizontal Tabs */}
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
          /* Empty state matching user request: "No files here yet" */
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
              <FolderOpen className="w-8 h-8 text-zinc-600 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-300">
                {downloadsCategory === 'downloading'
                  ? 'No download task'
                  : 'No files here yet'}
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                {downloadsCategory === 'downloading'
                  ? 'Active downloads will appear here with live speed and progress.'
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

            const isSelected = selectedTaskIds.includes(task.id);

            return (
              <div
                key={task.id}
                onMouseDown={() => !isActiveDownload && handleTouchStart(task.id)}
                onMouseUp={handleTouchEnd}
                onTouchStart={() => !isActiveDownload && handleTouchStart(task.id)}
                onTouchEnd={handleTouchEnd}
                className={`bg-zinc-900/90 border rounded-2xl p-3.5 space-y-3 transition-all shadow-sm ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Multi-selection Checkbox */}
                  {isSelectionMode && !isActiveDownload && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSelectTask(task.id);
                      }}
                      className="p-1 -ml-1 text-amber-400 self-center"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 fill-amber-400 text-black" />
                      ) : (
                        <Square className="w-5 h-5 text-zinc-500" />
                      )}
                    </button>
                  )}

                  {/* Thumbnail / Icon */}
                  <div
                    onClick={() => {
                      if (isSelectionMode && !isActiveDownload) {
                        toggleSelectTask(task.id);
                      } else if (!isActiveDownload) {
                        task.fileType === 'video'
                          ? openVideoPlayer(task)
                          : openAudioPlayer(task);
                      } else {
                        // Clicking downloading item opens original social media link
                        window.open(task.originalUrl, '_blank');
                      }
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 cursor-pointer group`}
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
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      if (isSelectionMode && !isActiveDownload) {
                        toggleSelectTask(task.id);
                      } else if (!isActiveDownload) {
                        task.fileType === 'video'
                          ? openVideoPlayer(task)
                          : openAudioPlayer(task);
                      } else {
                        // Clicking downloading item opens original social media link
                        window.open(task.originalUrl, '_blank');
                      }
                    }}
                  >
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

                    {/* Social Media Link Indicator in Downloading Tab */}
                    {isActiveDownload && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-400/90 mt-1 hover:underline">
                        <span>Open original post</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* 3-Dots Menu for completed items */}
                  {!isActiveDownload && !isSelectionMode && (
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

      {/* Multi-Selection Bottom Action Bar */}
      {isSelectionMode && (
        <div className="absolute bottom-2 left-4 right-4 z-40 bg-zinc-900 border border-zinc-700 rounded-2xl p-3 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedTaskIds([]);
              }}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg"
              aria-label="Cancel selection"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-zinc-100">
              {selectedTaskIds.length} Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Dynamic Select All / Deselect All Button */}
            <button
              onClick={handleSelectAllToggle}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-all"
            >
              {allAreSelected ? 'Deselect All' : 'Select All'}
            </button>

            {/* Share Selected */}
            <button
              onClick={handleShareSelected}
              disabled={selectedTaskIds.length === 0}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl disabled:opacity-40"
              aria-label="Share selected"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Delete Selected */}
            <button
              onClick={handleDeleteSelected}
              disabled={selectedTaskIds.length === 0}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow disabled:opacity-40"
              aria-label="Delete selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
