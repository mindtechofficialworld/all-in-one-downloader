import React, { createContext, useContext, useState, useEffect, useRef, useTransition } from 'react';
import {
  AppSettings,
  DownloadStatus,
  DownloadTask,
  FormatOption,
  MediaMetadata,
  NotificationItem,
  SortField,
  SortOrder,
} from '../types';
import {
  getInitialDownloads,
  saveDownloads,
  generatePlayableAudioBlob,
  SAMPLE_STREAM_VIDEO,
  SAMPLE_STREAM_VIDEO_NATURE,
  SAMPLE_STREAM_AUDIO,
} from '../services/downloadEngine';
import { extractUrlFromText, parseMediaUrl } from '../services/mediaParser';

interface AppContextType {
  // Navigation
  activeTab: 'home' | 'downloads' | 'settings';
  setActiveTab: (tab: 'home' | 'downloads' | 'settings') => void;
  downloadsCategory: 'all' | 'videos' | 'music' | 'downloading';
  setDownloadsCategory: (category: 'all' | 'videos' | 'music' | 'downloading') => void;
  settingsSubPage: 'main' | 'notifications' | 'download-settings' | 'about' | 'privacy' | 'terms';
  setSettingsSubPage: (page: 'main' | 'notifications' | 'download-settings' | 'about' | 'privacy' | 'terms') => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Downloads data
  downloads: DownloadTask[];
  filteredDownloads: DownloadTask[];
  activeTasksCount: number;
  completedTasksCount: number;

  // Sorting
  sortField: SortField;
  sortOrder: SortOrder;
  setSorting: (field: SortField, order: SortOrder) => void;

  // Download Actions
  startDownload: (media: MediaMetadata, format: FormatOption) => void;
  pauseDownload: (taskId: string) => void;
  resumeDownload: (taskId: string) => void;
  cancelDownload: (taskId: string) => void;
  retryDownload: (taskId: string) => void;
  deleteDownload: (taskId: string) => void;
  renameDownload: (taskId: string, newTitle: string) => void;

  // Bottom Sheet for Format Selection
  analyzingUrl: boolean;
  activeMediaMetadata: MediaMetadata | null;
  isFormatSheetOpen: boolean;
  openFormatSheet: (metadata: MediaMetadata) => void;
  closeFormatSheet: () => void;
  analyzeAndOpen: (url: string) => Promise<boolean>;

  // Players
  activeVideo: DownloadTask | null;
  openVideoPlayer: (task: DownloadTask) => void;
  closeVideoPlayer: () => void;
  activeAudio: DownloadTask | null;
  openAudioPlayer: (task: DownloadTask) => void;
  closeAudioPlayer: () => void;

  // Modals
  fileInfoTask: DownloadTask | null;
  setFileInfoTask: (task: DownloadTask | null) => void;
  taskToDelete: DownloadTask | null;
  setTaskToDelete: (task: DownloadTask | null) => void;
  taskToRename: DownloadTask | null;
  setTaskToRename: (task: DownloadTask | null) => void;

  // Share Intent Simulation
  isShareSheetOpen: boolean;
  setIsShareSheetOpen: (open: boolean) => void;
  handleIncomingShare: (sharedTextOrUrl: string) => void;

  // Settings & Theme
  settings: AppSettings;
  updateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  toggleTheme: (theme: 'dark' | 'light' | 'system') => void;

  // Notifications
  notifications: NotificationItem[];
  latestNotification: NotificationItem | null;
  clearLatestNotification: () => void;
  isNotificationShadeOpen: boolean;
  setIsNotificationShadeOpen: (open: boolean) => void;

  // Android Viewport & Accessibility
  viewMode: 'phone' | 'fullscreen';
  setViewMode: (mode: 'phone' | 'fullscreen') => void;
  talkBackAnnouncement: string;
  announceTalkBack: (message: string) => void;
  talkBackEnabled: boolean;
  setTalkBackEnabled: (enabled: boolean) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'English',
  notifications: {
    downloadProgress: true,
    downloadCompleted: true,
    recommendedContent: false,
    toolNotifications: false,
    toolbar: false,
  },
  downloadSettings: {
    defaultVideoQuality: '720p',
    defaultAudioFormat: 'mp3',
    defaultDownloadLocation: '/storage/emulated/0/Download/AllInOne',
    simultaneousLimit: 3,
    autoClipboardDetection: true,
    askBeforeDownloading: true,
    downloadOverWifiOnly: false,
    backgroundDownloadSupport: true,
    keepScreenAwake: true,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'downloads' | 'settings'>('home');
  const [downloadsCategory, setDownloadsCategory] = useState<'all' | 'videos' | 'music' | 'downloading'>('all');
  const [settingsSubPage, setSettingsSubPage] = useState<'main' | 'notifications' | 'download-settings' | 'about' | 'privacy' | 'terms'>('main');

  const [searchQuery, setSearchQuery] = useState('');
  const [downloads, setDownloads] = useState<DownloadTask[]>(() => getInitialDownloads());

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [analyzingUrl, setAnalyzingUrl] = useState(false);
  const [activeMediaMetadata, setActiveMediaMetadata] = useState<MediaMetadata | null>(null);
  const [isFormatSheetOpen, setIsFormatSheetOpen] = useState(false);

  // Players
  const [activeVideo, setActiveVideo] = useState<DownloadTask | null>(null);
  const [activeAudio, setActiveAudio] = useState<DownloadTask | null>(null);

  // Modals
  const [fileInfoTask, setFileInfoTask] = useState<DownloadTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<DownloadTask | null>(null);
  const [taskToRename, setTaskToRename] = useState<DownloadTask | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  // Viewport mode (Mobile phone frame vs desktop responsive)
  const [viewMode, setViewMode] = useState<'phone' | 'fullscreen'>('phone');

  // Accessibility TalkBack announcements
  const [talkBackAnnouncement, setTalkBackAnnouncement] = useState<string>('');
  const [talkBackEnabled, setTalkBackEnabled] = useState<boolean>(false);

  const announceTalkBack = (message: string) => {
    setTalkBackAnnouncement(message);
    // Auto-clear after 4 seconds
    setTimeout(() => {
      setTalkBackAnnouncement(prev => (prev === message ? '' : prev));
    }, 4000);
  };

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('all_in_one_settings_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (updater: (prev: AppSettings) => AppSettings) => {
    setSettings(prev => {
      const next = updater(prev);
      localStorage.setItem('all_in_one_settings_v1', JSON.stringify(next));
      return next;
    });
  };

  // Sync theme with HTML document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const toggleTheme = (theme: 'dark' | 'light' | 'system') => {
    updateSettings(s => ({ ...s, theme }));
    announceTalkBack(`Theme set to ${theme}`);
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [latestNotification, setLatestNotification] = useState<NotificationItem | null>(null);
  const [isNotificationShadeOpen, setIsNotificationShadeOpen] = useState(false);

  const pushNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const item: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [item, ...prev].slice(0, 20));
    setLatestNotification(item);

    // Also attempt native Web Notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(item.title, {
          body: item.message,
          icon: '/app_icon.svg',
        });
      } catch {
        // Ignore native notification error in iframe
      }
    }

    announceTalkBack(`Notification: ${item.title}. ${item.message}`);
  };

  const clearLatestNotification = () => {
    setLatestNotification(null);
  };

  // Save downloads on change
  useEffect(() => {
    saveDownloads(downloads);
  }, [downloads]);

  // Handle URL analyze
  const analyzeAndOpen = async (url: string): Promise<boolean> => {
    const extracted = extractUrlFromText(url);
    if (!extracted && !url.trim()) {
      announceTalkBack('Please paste or enter a valid video or audio link');
      return false;
    }
    setAnalyzingUrl(true);
    announceTalkBack('Retrieving media information...');
    try {
      // Simulate real media analysis with smooth animation
      await new Promise(r => setTimeout(r, 650));
      const metadata = await parseMediaUrl(extracted || url);
      setActiveMediaMetadata(metadata);
      setIsFormatSheetOpen(true);
      announceTalkBack(`Found media: ${metadata.title}. Select format to download.`);
      return true;
    } catch (err) {
      announceTalkBack('Failed to retrieve media information. Please check link.');
      return false;
    } finally {
      setAnalyzingUrl(false);
    }
  };

  const openFormatSheet = (metadata: MediaMetadata) => {
    setActiveMediaMetadata(metadata);
    setIsFormatSheetOpen(true);
  };

  const closeFormatSheet = () => {
    setIsFormatSheetOpen(false);
  };

  // Start Download
  const startDownload = (media: MediaMetadata, format: FormatOption) => {
    setIsFormatSheetOpen(false);

    // Generate real playable blob fallback or public domain stream
    let playableUrl = '';
    if (format.type === 'video') {
      playableUrl = media.thumbnailUrl.includes('nature') ? SAMPLE_STREAM_VIDEO_NATURE : SAMPLE_STREAM_VIDEO;
    } else {
      // Create real audio blob
      try {
        const blob = generatePlayableAudioBlob(media.title, media.durationSeconds || 30);
        playableUrl = URL.createObjectURL(blob);
      } catch {
        playableUrl = SAMPLE_STREAM_AUDIO;
      }
    }

    const newTask: DownloadTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      mediaId: media.id,
      title: media.title,
      originalUrl: media.originalUrl,
      platform: media.platform,
      thumbnailUrl: media.thumbnailUrl,
      fileType: format.type,
      format: format.format,
      quality: format.quality || (format.type === 'video' ? '720p' : '320 kbps'),
      totalSizeBytes: format.estimatedSizeBytes,
      downloadedBytes: 0,
      progressPercent: 0,
      speedBytesPerSec: 2.8 * 1024 * 1024, // ~2.8 MB/s
      remainingSeconds: Math.ceil(format.estimatedSizeBytes / (2.8 * 1024 * 1024)),
      status: 'downloading',
      dateAdded: Date.now(),
      localFilePath: `${settings.downloadSettings.defaultDownloadLocation}/${media.title.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.${format.format}`,
      mediaBlobUrl: playableUrl,
      durationFormatted: media.durationFormatted,
      durationSeconds: media.durationSeconds,
    };

    setDownloads(prev => [newTask, ...prev]);

    // Send notification if enabled
    if (settings.notifications.downloadProgress) {
      pushNotification({
        title: 'Downloading started',
        message: `${media.title.substring(0, 40)}... (${format.quality || format.format.toUpperCase()})`,
        type: 'progress',
        taskId: newTask.id,
        progress: 0,
      });
    }

    announceTalkBack(`Started download for ${media.title}. Progress 0%`);
  };

  // Pause / Resume / Cancel / Retry / Delete
  const pauseDownload = (taskId: string) => {
    setDownloads(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'paused', speedBytesPerSec: 0 } : t))
    );
    announceTalkBack('Download paused');
  };

  const resumeDownload = (taskId: string) => {
    setDownloads(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'downloading', speedBytesPerSec: 3.2 * 1024 * 1024 } : t))
    );
    announceTalkBack('Download resumed');
  };

  const cancelDownload = (taskId: string) => {
    setDownloads(prev => prev.filter(t => t.id !== taskId));
    announceTalkBack('Download cancelled');
  };

  const retryDownload = (taskId: string) => {
    setDownloads(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'downloading',
              downloadedBytes: 0,
              progressPercent: 0,
              speedBytesPerSec: 3.1 * 1024 * 1024,
              error: undefined,
            }
          : t
      )
    );
    announceTalkBack('Download retrying');
  };

  const deleteDownload = (taskId: string) => {
    setDownloads(prev => prev.filter(t => t.id !== taskId));
    setTaskToDelete(null);
    announceTalkBack('File deleted successfully');
  };

  const renameDownload = (taskId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setDownloads(prev =>
      prev.map(t => (t.id === taskId ? { ...t, title: newTitle.trim() } : t))
    );
    setTaskToRename(null);
    announceTalkBack(`File renamed to ${newTitle.trim()}`);
  };

  // Active Downloads Tick Engine
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => {
        let changed = false;
        // Check active downloads
        const activeDownloads = prev.filter(t => t.status === 'downloading');
        if (activeDownloads.length === 0) return prev;

        const updated = prev.map(task => {
          if (task.status !== 'downloading') return task;

          changed = true;
          // Calculate realistic dynamic chunk
          const jitter = 0.85 + Math.random() * 0.35; // fluctuating network speed
          const speed = (2.5 + Math.random() * 1.5) * 1024 * 1024 * jitter; // ~2.5 - 4.2 MB/s
          const chunkSize = speed * 0.5; // per 500ms tick
          const newDownloaded = Math.min(task.totalSizeBytes, task.downloadedBytes + chunkSize);
          const newPercent = Math.min(100, Math.round((newDownloaded / task.totalSizeBytes) * 100));
          const remainingBytes = Math.max(0, task.totalSizeBytes - newDownloaded);
          const remainingSec = speed > 0 ? Math.ceil(remainingBytes / speed) : 0;

          if (newPercent >= 100) {
            // Completed!
            if (settings.notifications.downloadCompleted) {
              pushNotification({
                title: 'Download complete',
                message: `${task.title.substring(0, 45)} is ready to play.`,
                type: 'completed',
                taskId: task.id,
                progress: 100,
              });
            }
            return {
              ...task,
              downloadedBytes: task.totalSizeBytes,
              progressPercent: 100,
              speedBytesPerSec: 0,
              remainingSeconds: 0,
              status: 'completed' as DownloadStatus,
              dateCompleted: Date.now(),
            };
          }

          return {
            ...task,
            downloadedBytes: newDownloaded,
            progressPercent: newPercent,
            speedBytesPerSec: speed,
            remainingSeconds: remainingSec,
          };
        });

        return changed ? updated : prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [settings.notifications.downloadCompleted]);

  // Android Native Web Share Target & URL Parameters
  useEffect(() => {
    const handleUrlParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const sharedUrl = searchParams.get('url') || searchParams.get('text') || searchParams.get('link');
      if (sharedUrl) {
        // Clean URL from query string
        const clean = extractUrlFromText(sharedUrl);
        if (clean) {
          analyzeAndOpen(clean);
          // Clean window history without reload
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleUrlParams();
    window.addEventListener('popstate', handleUrlParams);
    return () => window.removeEventListener('popstate', handleUrlParams);
  }, []);

  // Handle Android Share Intent incoming
  const handleIncomingShare = (sharedTextOrUrl: string) => {
    const extracted = extractUrlFromText(sharedTextOrUrl);
    if (!extracted) {
      announceTalkBack('No valid URL found in shared text');
      return;
    }
    setIsShareSheetOpen(false);
    analyzeAndOpen(extracted);
  };

  // Sorting and Filtering
  const filteredDownloads = downloads
    .filter(task => {
      // Category filter
      if (downloadsCategory === 'videos') {
        return task.fileType === 'video' && task.status === 'completed';
      }
      if (downloadsCategory === 'music') {
        return task.fileType === 'audio' && task.status === 'completed';
      }
      if (downloadsCategory === 'downloading') {
        return task.status === 'downloading' || task.status === 'paused' || task.status === 'failed' || task.status === 'queued';
      }
      // 'all' shows all completed downloads + active ones
      return true;
    })
    .filter(task => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        task.title.toLowerCase().includes(q) ||
        task.platform.toLowerCase().includes(q) ||
        task.format.toLowerCase().includes(q) ||
        (task.quality && task.quality.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'size':
          comparison = a.totalSizeBytes - b.totalSizeBytes;
          break;
        case 'duration':
          comparison = (a.durationSeconds || 0) - (b.durationSeconds || 0);
          break;
        case 'type':
          comparison = a.fileType.localeCompare(b.fileType);
          break;
        case 'date':
        default:
          comparison = (a.dateCompleted || a.dateAdded) - (b.dateCompleted || b.dateAdded);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const setSorting = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
    announceTalkBack(`Sorted by ${field} ${order === 'asc' ? 'ascending' : 'descending'}`);
  };

  const activeTasksCount = downloads.filter(
    t => t.status === 'downloading' || t.status === 'paused' || t.status === 'queued'
  ).length;

  const completedTasksCount = downloads.filter(t => t.status === 'completed').length;

  const openVideoPlayer = (task: DownloadTask) => {
    setActiveVideo(task);
    announceTalkBack(`Opening video player for ${task.title}`);
  };

  const closeVideoPlayer = () => {
    setActiveVideo(null);
  };

  const openAudioPlayer = (task: DownloadTask) => {
    setActiveAudio(task);
    announceTalkBack(`Opening audio player for ${task.title}`);
  };

  const closeAudioPlayer = () => {
    setActiveAudio(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        downloadsCategory,
        setDownloadsCategory,
        settingsSubPage,
        setSettingsSubPage,
        searchQuery,
        setSearchQuery,
        downloads,
        filteredDownloads,
        activeTasksCount,
        completedTasksCount,
        sortField,
        sortOrder,
        setSorting,
        startDownload,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        retryDownload,
        deleteDownload,
        renameDownload,
        analyzingUrl,
        activeMediaMetadata,
        isFormatSheetOpen,
        openFormatSheet,
        closeFormatSheet,
        analyzeAndOpen,
        activeVideo,
        openVideoPlayer,
        closeVideoPlayer,
        activeAudio,
        openAudioPlayer,
        closeAudioPlayer,
        fileInfoTask,
        setFileInfoTask,
        taskToDelete,
        setTaskToDelete,
        taskToRename,
        setTaskToRename,
        isShareSheetOpen,
        setIsShareSheetOpen,
        handleIncomingShare,
        settings,
        updateSettings,
        toggleTheme,
        notifications,
        latestNotification,
        clearLatestNotification,
        isNotificationShadeOpen,
        setIsNotificationShadeOpen,
        viewMode,
        setViewMode,
        talkBackAnnouncement,
        announceTalkBack,
        talkBackEnabled,
        setTalkBackEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
