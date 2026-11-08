import { DownloadTask, FormatOption, MediaMetadata, MediaType } from '../types';

const STORAGE_KEY = 'all_in_one_downloads_v1';
const SETTINGS_KEY = 'all_in_one_settings_v1';

// Real sample public domain video streams and audio samples that can be streamed and played
export const SAMPLE_STREAM_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
export const SAMPLE_STREAM_VIDEO_NATURE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
export const SAMPLE_STREAM_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// Synthetic audio generator to create standalone real playable MP3/WAV blobs in browser without internet dependencies
export function generatePlayableAudioBlob(title: string, durationSec = 30): Blob {
  // Simple valid WAV audio container generator
  const sampleRate = 22050;
  const numSamples = sampleRate * Math.min(durationSec, 20);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  // data chunk identifier
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Generate soothing melodic tones
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Pleasant musical chord progression (C-E-G-A harmonic sequence)
    const chordFreq = [261.63, 329.63, 392.00, 440.00][Math.floor((t * 2) % 4)];
    const sample = Math.sin(2 * Math.PI * chordFreq * t) * 0.3 * Math.exp(-(t % 0.5) * 2);
    const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Initial sample downloads to match screenshot (e.g. 2 completed files in reference badge)
 */
export function getInitialDownloads(): DownloadTask[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }

  const initialList: DownloadTask[] = [
    {
      id: 'task_wedding_completed',
      mediaId: 'media_wedding_init',
      title: 'Laiba or osama ki shadi fainali rukhsati hogayi _ khubsurat lamhat',
      originalUrl: 'https://youtu.be/m98kL2sY10A',
      platform: 'YouTube',
      thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%237c2d12"/><stop offset="100%" stop-color="%231e1b4b"/></linearGradient></defs><rect width="640" height="360" fill="url(%23g1)"/><circle cx="320" cy="180" r="45" fill="%23F59E0B" opacity="0.95"/><polygon points="310,162 340,180 310,198" fill="%23000"/></svg>',
      fileType: 'video',
      format: 'mp4',
      quality: '720p',
      totalSizeBytes: 61.0 * 1024 * 1024,
      downloadedBytes: 61.0 * 1024 * 1024,
      progressPercent: 100,
      speedBytesPerSec: 0,
      remainingSeconds: 0,
      status: 'completed',
      dateAdded: Date.now() - 3600 * 1000 * 4,
      dateCompleted: Date.now() - 3600 * 1000 * 4 + 45000,
      localFilePath: '/storage/emulated/0/Download/AllInOne/Laiba_or_osama_ki_shadi_720p.mp4',
      mediaBlobUrl: SAMPLE_STREAM_VIDEO,
      durationFormatted: '05:42',
      durationSeconds: 342,
    },
    {
      id: 'task_lofi_completed',
      mediaId: 'media_lofi_init',
      title: 'Midnight Melodies — Cozy Rainy Night Study & Relax Lofi Hop',
      originalUrl: 'https://soundcloud.com/chillhopdotcom/rainy-night',
      platform: 'YouTube',
      thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234c1d95"/><stop offset="100%" stop-color="%2318181b"/></linearGradient></defs><rect width="640" height="360" fill="url(%23g3)"/><circle cx="320" cy="180" r="45" fill="%23A855F7" opacity="0.95"/><polygon points="310,162 340,180 310,198" fill="%23000"/></svg>',
      fileType: 'audio',
      format: 'mp3',
      quality: '256 kbps',
      totalSizeBytes: 7.6 * 1024 * 1024,
      downloadedBytes: 7.6 * 1024 * 1024,
      progressPercent: 100,
      speedBytesPerSec: 0,
      remainingSeconds: 0,
      status: 'completed',
      dateAdded: Date.now() - 3600 * 1000 * 24,
      dateCompleted: Date.now() - 3600 * 1000 * 24 + 12000,
      localFilePath: '/storage/emulated/0/Download/AllInOne/Midnight_Melodies_Classic_MP3.mp3',
      mediaBlobUrl: SAMPLE_STREAM_AUDIO,
      durationFormatted: '04:18',
      durationSeconds: 258,
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialList));
  return initialList;
}

export function saveDownloads(downloads: DownloadTask[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(downloads));
  } catch (err) {
    console.error('Failed to save downloads to localStorage:', err);
  }
}

/**
 * Format bytes into human readable format (MB, GB, KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format seconds into mm:ss or hh:mm:ss
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Format timestamp into Android style date (e.g. "Today 10:45 AM", "Nov 7, 2026")
 */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  if (isToday) {
    return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
