export type MediaType = 'video' | 'audio';

export type DownloadStatus = 'downloading' | 'paused' | 'completed' | 'failed' | 'queued';

export interface FormatOption {
  id: string;
  type: MediaType;
  format: 'mp3' | 'm4a' | 'mp4' | 'webm';
  label: string;
  quality?: string;
  estimatedSize: string;
  estimatedSizeBytes: number;
  resolution?: string;
  bitrate?: string;
  codec?: string;
  fps?: number;
}

export interface MediaMetadata {
  id: string;
  originalUrl: string;
  title: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X (Twitter)' | 'Vimeo' | 'Direct';
  platformDomain: string;
  thumbnailUrl: string;
  durationFormatted: string;
  durationSeconds: number;
  author: string;
  formats: {
    audio: FormatOption[];
    video: FormatOption[];
    moreFormats?: FormatOption[];
  };
}

export interface DownloadTask {
  id: string;
  mediaId: string;
  title: string;
  originalUrl: string;
  platform: string;
  thumbnailUrl: string;
  fileType: MediaType;
  format: string;
  quality?: string;
  totalSizeBytes: number;
  downloadedBytes: number;
  progressPercent: number; // 0 - 100
  speedBytesPerSec: number;
  remainingSeconds: number;
  status: DownloadStatus;
  dateAdded: number; // timestamp
  dateCompleted?: number;
  localFilePath: string;
  mediaBlobUrl?: string;
  durationFormatted?: string;
  durationSeconds?: number;
  error?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'progress' | 'completed' | 'alert' | 'tool';
  read: boolean;
  taskId?: string;
  progress?: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  language: string;
  notifications: {
    downloadProgress: boolean;
    downloadCompleted: boolean;
    recommendedContent: boolean;
    toolNotifications: boolean;
    toolbar: boolean;
  };
  downloadSettings: {
    defaultVideoQuality: string; // '720p', '1080p', '360p', '480p'
    defaultAudioFormat: string; // 'mp3', 'm4a'
    defaultDownloadLocation: string;
    simultaneousLimit: number;
    autoClipboardDetection: boolean;
    askBeforeDownloading: boolean;
    downloadOverWifiOnly: boolean;
    backgroundDownloadSupport: boolean;
    keepScreenAwake: boolean;
  };
}

export type SortField = 'date' | 'name' | 'size' | 'duration' | 'type';
export type SortOrder = 'asc' | 'desc';
