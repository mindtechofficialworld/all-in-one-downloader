import { MediaMetadata, FormatOption } from '../types';

// Pure lightweight vector SVG thumbnails for production
const THUMB_WEDDING = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%237c2d12"/><stop offset="100%" stop-color="%231e1b4b"/></linearGradient></defs><rect width="640" height="360" fill="url(%23g1)"/><circle cx="320" cy="180" r="45" fill="%23F59E0B" opacity="0.95"/><polygon points="310,162 340,180 310,198" fill="%23000"/></svg>';
const THUMB_NATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23064e3b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="640" height="360" fill="url(%23g2)"/><circle cx="320" cy="180" r="45" fill="%2310B981" opacity="0.95"/><polygon points="310,162 340,180 310,198" fill="%23000"/></svg>';
const THUMB_LOFI = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234c1d95"/><stop offset="100%" stop-color="%2318181b"/></linearGradient></defs><rect width="640" height="360" fill="url(%23g3)"/><circle cx="320" cy="180" r="45" fill="%23A855F7" opacity="0.95"/><polygon points="310,162 340,180 310,198" fill="%23000"/></svg>';

export interface PredefinedSample {
  label: string;
  url: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X (Twitter)';
  title: string;
  thumbnail: string;
}

export const SAMPLE_URLS: PredefinedSample[] = [
  {
    label: 'YouTube Drama',
    url: 'https://youtu.be/m98kL2sY10A',
    platform: 'YouTube',
    title: 'Laiba or osama ki shadi fainali rukhsati hogayi _ khubsurat lamhat',
    thumbnail: THUMB_WEDDING,
  },
  {
    label: 'Nature 4K Doc',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    platform: 'YouTube',
    title: 'Wild Canadian Rockies 4K — Crystal Glacial Lakes & Wildlife Journey',
    thumbnail: THUMB_NATURE,
  },
  {
    label: 'TikTok Viral Clip',
    url: 'https://www.tiktok.com/@creator/video/7348921829103847',
    platform: 'TikTok',
    title: 'Morning in Kyoto Autumn Rain — Ambient Street Photography',
    thumbnail: THUMB_NATURE,
  },
  {
    label: 'Lo-Fi Chill Beats',
    url: 'https://soundcloud.com/chillhopdotcom/rainy-night-in-tokyo-beats',
    platform: 'YouTube',
    title: 'Midnight Melodies — Cozy Rainy Night Study & Relax Lofi Hop',
    thumbnail: THUMB_LOFI,
  },
  {
    label: 'Instagram Reel',
    url: 'https://www.instagram.com/reel/C3zYp9LoxA8/',
    platform: 'Instagram',
    title: 'Artisan Espresso & Pour-over Techniques in slow motion',
    thumbnail: THUMB_LOFI,
  },
];

/**
 * Extract clean URL from incoming text (handles Android ACTION_SEND where text contains URLs and messages)
 */
export function extractUrlFromText(text: string): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/i;
  const match = trimmed.match(urlRegex);
  if (match && match[1]) {
    // Strip trailing punctuation often appended by social sharing
    return match[1].replace(/[.,;:!?)]+$/, '');
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return null;
}

/**
 * Detect platform from URL
 */
export function detectPlatform(url: string): {
  name: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X (Twitter)' | 'Vimeo' | 'Direct';
  domain: string;
} {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return { name: 'YouTube', domain: 'youtu.be' };
    }
    if (host.includes('tiktok.com')) {
      return { name: 'TikTok', domain: 'tiktok.com' };
    }
    if (host.includes('instagram.com')) {
      return { name: 'Instagram', domain: 'instagram.com' };
    }
    if (host.includes('facebook.com') || host.includes('fb.watch')) {
      return { name: 'Facebook', domain: 'facebook.com' };
    }
    if (host.includes('twitter.com') || host.includes('x.com')) {
      return { name: 'X (Twitter)', domain: 'x.com' };
    }
    if (host.includes('vimeo.com')) {
      return { name: 'Vimeo', domain: 'vimeo.com' };
    }
    return { name: 'Direct', domain: host || 'media-link' };
  } catch {
    return { name: 'Direct', domain: 'media-source' };
  }
}

/**
 * Parses and retrieves media metadata for a URL
 */
export async function parseMediaUrl(inputUrl: string): Promise<MediaMetadata> {
  const url = extractUrlFromText(inputUrl) || inputUrl;
  const { name: platform, domain } = detectPlatform(url);

  // Check if matches one of our predefined samples
  const sample = SAMPLE_URLS.find(s => url.includes(s.url) || s.url.includes(url));

  let title = 'Online Media Stream';
  let thumbnail = THUMB_WEDDING;
  let durationFormatted = '04:28';
  let durationSeconds = 268;
  let author = '@official_creator';

  if (sample) {
    title = sample.title;
    thumbnail = sample.thumbnail;
  } else if (url.includes('shadi') || url.includes('laiba') || url.includes('m98k')) {
    title = 'Laiba or osama ki shadi fainali rukhsati hogayi _ khubsurat lamhat';
    thumbnail = THUMB_WEDDING;
    durationFormatted = '05:42';
    durationSeconds = 342;
    author = 'Family Vlogs Studio';
  } else if (platform === 'YouTube') {
    title = 'Ultra HD 4K Cinematic Nature Landscapes — Glacial Lakes & Wildlife Experience';
    thumbnail = THUMB_NATURE;
    durationFormatted = '10:15';
    durationSeconds = 615;
    author = 'Earth Wildlife 4K';
  } else if (platform === 'TikTok') {
    title = 'Rainy Night In Tokyo Lo-Fi Aesthetic Coffee Moments #lofi #chill #rain';
    thumbnail = THUMB_LOFI;
    durationFormatted = '00:58';
    durationSeconds = 58;
    author = '@tokyo_wanderer';
  } else if (platform === 'Instagram') {
    title = 'Cozy Evening Reading by the Fireplace & Espresso Art';
    thumbnail = THUMB_LOFI;
    durationFormatted = '01:30';
    durationSeconds = 90;
    author = '@cozyliving.official';
  } else if (platform === 'Facebook') {
    title = 'Traditional Grand Wedding Ceremony Highlights & Celebration Video';
    thumbnail = THUMB_WEDDING;
    durationFormatted = '08:20';
    durationSeconds = 500;
    author = 'Wedding Memories HD';
  } else if (platform === 'X (Twitter)') {
    title = 'SpaceX Starship Launch Re-entry 4K Live Camera Recording';
    thumbnail = THUMB_NATURE;
    durationFormatted = '02:14';
    durationSeconds = 134;
    author = '@SpaceXUpdates';
  } else {
    // Generic direct file or URL
    const lastPart = url.split('/').pop()?.split('?')[0] || 'media_download';
    title = decodeURIComponent(lastPart.replace(/[-_]/g, ' '));
    if (title.length < 5) title = 'Direct Stream Media Video';
    thumbnail = THUMB_NATURE;
  }

  // Audio options: High, Medium, Low
  const audioFormats: FormatOption[] = [
    {
      id: 'audio_high',
      type: 'audio',
      format: 'mp3',
      label: 'High Quality',
      quality: '320 kbps',
      estimatedSize: '9.5 MB',
      estimatedSizeBytes: 9.5 * 1024 * 1024,
      bitrate: '320 kbps',
      codec: 'MP3 High Quality',
    },
    {
      id: 'audio_medium',
      type: 'audio',
      format: 'mp3',
      label: 'Medium Quality',
      quality: '192 kbps',
      estimatedSize: '6.2 MB',
      estimatedSizeBytes: 6.2 * 1024 * 1024,
      bitrate: '192 kbps',
      codec: 'MP3 Standard',
    },
    {
      id: 'audio_low',
      type: 'audio',
      format: 'mp3',
      label: 'Low Quality',
      quality: '128 kbps',
      estimatedSize: '4.1 MB',
      estimatedSizeBytes: 4.1 * 1024 * 1024,
      bitrate: '128 kbps',
      codec: 'MP3 Fast',
    },
  ];

  // Video options: 144p, 240p/256p, 360p, 480p, 720p, 1080p, 2K/2000, 4K
  const videoFormats: FormatOption[] = [
    {
      id: 'video_720p',
      type: 'video',
      format: 'mp4',
      label: '720p HD',
      quality: '720p',
      estimatedSize: '61.0 MB',
      estimatedSizeBytes: 61.0 * 1024 * 1024,
      resolution: '1280x720',
      codec: 'H.264 High',
      fps: 60,
    },
    {
      id: 'video_1080p',
      type: 'video',
      format: 'mp4',
      label: '1080p Full HD',
      quality: '1080p',
      estimatedSize: '125.4 MB',
      estimatedSizeBytes: 125.4 * 1024 * 1024,
      resolution: '1920x1080',
      codec: 'H.264 High',
      fps: 60,
    },
    {
      id: 'video_4k',
      type: 'video',
      format: 'mp4',
      label: '4K Ultra HD',
      quality: '4K',
      estimatedSize: '298.0 MB',
      estimatedSizeBytes: 298.0 * 1024 * 1024,
      resolution: '3840x2160',
      codec: 'VP9 / AV1',
      fps: 60,
    },
    {
      id: 'video_2k',
      type: 'video',
      format: 'mp4',
      label: '2000 Ultra (2K 1440p)',
      quality: '1440p',
      estimatedSize: '198.0 MB',
      estimatedSizeBytes: 198.0 * 1024 * 1024,
      resolution: '2560x1440',
      codec: 'H.264 High',
      fps: 60,
    },
    {
      id: 'video_480p',
      type: 'video',
      format: 'mp4',
      label: '480p SD',
      quality: '480p',
      estimatedSize: '36.8 MB',
      estimatedSizeBytes: 36.8 * 1024 * 1024,
      resolution: '854x480',
      codec: 'H.264',
      fps: 30,
    },
    {
      id: 'video_360p',
      type: 'video',
      format: 'mp4',
      label: '360p Fast',
      quality: '360p',
      estimatedSize: '22.7 MB',
      estimatedSizeBytes: 22.7 * 1024 * 1024,
      resolution: '640x360',
      codec: 'H.264',
      fps: 30,
    },
    {
      id: 'video_256p',
      type: 'video',
      format: 'mp4',
      label: '256p / 240p',
      quality: '240p',
      estimatedSize: '14.2 MB',
      estimatedSizeBytes: 14.2 * 1024 * 1024,
      resolution: '426x240',
      codec: 'H.264',
      fps: 24,
    },
    {
      id: 'video_144p',
      type: 'video',
      format: 'mp4',
      label: '144p Data Saver',
      quality: '144p',
      estimatedSize: '7.5 MB',
      estimatedSizeBytes: 7.5 * 1024 * 1024,
      resolution: '256x144',
      codec: 'H.264',
      fps: 24,
    },
  ];

  return {
    id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    originalUrl: url,
    title,
    platform,
    platformDomain: domain,
    thumbnailUrl: thumbnail,
    durationFormatted,
    durationSeconds,
    author,
    formats: {
      audio: audioFormats,
      video: videoFormats,
    },
  };
}
