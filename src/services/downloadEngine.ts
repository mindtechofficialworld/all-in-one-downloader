import { DownloadTask, FormatOption, MediaMetadata, MediaType } from '../types';

const STORAGE_KEY = 'all_in_one_downloads_v2';
const SETTINGS_KEY = 'all_in_one_settings_v2';

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

  // Pure clean state with no mock/dummy files
  return [];
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
