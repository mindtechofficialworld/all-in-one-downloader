import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sun,
  X,
  Gauge,
  Subtitles,
  Smartphone,
} from 'lucide-react';
import { formatDuration } from '../services/downloadEngine';

export const BuiltInVideoPlayer: React.FC = () => {
  const { activeVideo, closeVideoPlayer, announceTalkBack } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(activeVideo?.durationSeconds || 120);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [brightness, setBrightness] = useState(1.0); // 0.3 to 1.3
  const [isLandscape, setIsLandscape] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSubtitleOn, setIsSubtitleOn] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  if (!activeVideo) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      announceTalkBack('Paused video');
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      announceTalkBack('Playing video');
    }
  };

  const seekRelative = (delta: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    announceTalkBack(`Seeked ${delta > 0 ? '+' : ''}${delta} seconds`);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    videoRef.current.muted = next;
    announceTalkBack(next ? 'Muted' : 'Unmuted');
  };

  const setSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
    announceTalkBack(`Speed ${rate}x`);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black flex flex-col justify-center select-none overflow-hidden ${
        isLandscape ? 'rotate-0 md:rotate-0' : ''
      }`}
      role="dialog"
      aria-label="Built-in Video Player"
    >
      {/* Video Element */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={activeVideo.mediaBlobUrl || activeVideo.originalUrl}
          poster={activeVideo.thumbnailUrl}
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          style={{ filter: `brightness(${brightness})` }}
        />

        {/* Subtitles Overlay */}
        {isSubtitleOn && (
          <div className="absolute bottom-20 left-6 right-6 pointer-events-none text-center">
            <span className="bg-black/75 text-white font-medium text-xs sm:text-sm px-3 py-1 rounded-md shadow-md backdrop-blur-sm">
              [Auto-generated English subtitles: {activeVideo.title.substring(0, 40)}]
            </span>
          </div>
        )}

        {/* Video Player Overlay Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/85 flex flex-col justify-between p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <button
                onClick={closeVideoPlayer}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate leading-tight">
                  {activeVideo.title}
                </h3>
                <p className="text-[11px] text-zinc-300 font-mono mt-0.5">
                  {activeVideo.quality || 'HD'} · {activeVideo.platform}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Orientation toggle */}
              <button
                onClick={() => {
                  setIsLandscape(!isLandscape);
                  announceTalkBack(`Toggled ${!isLandscape ? 'landscape' : 'portrait'}`);
                }}
                className="p-2 rounded-full hover:bg-white/20 text-white"
                title="Toggle orientation"
                aria-label="Toggle landscape orientation"
              >
                <Smartphone className="w-4 h-4 rotate-90" />
              </button>

              {/* Subtitle toggle */}
              <button
                onClick={() => {
                  setIsSubtitleOn(!isSubtitleOn);
                  announceTalkBack(`Subtitles ${!isSubtitleOn ? 'on' : 'off'}`);
                }}
                className={`p-2 rounded-full hover:bg-white/20 ${
                  isSubtitleOn ? 'text-amber-400' : 'text-zinc-400'
                }`}
                title="Subtitles / CC"
                aria-label="Toggle subtitles"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Speed Menu Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-semibold"
                  aria-label="Playback speed"
                >
                  {playbackRate}x
                </button>

                {showSpeedMenu && (
                  <div className="absolute right-0 top-9 bg-zinc-900 border border-zinc-700 rounded-xl py-1 shadow-2xl w-24 text-xs z-50">
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setSpeed(rate)}
                        className={`w-full px-3 py-1.5 text-left hover:bg-zinc-800 ${
                          playbackRate === rate ? 'text-amber-400 font-bold' : 'text-zinc-200'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Playback Controls (10s Back, Play/Pause, 10s Forward) */}
          <div className="flex items-center justify-center gap-8 text-white">
            <button
              onClick={() => seekRelative(-10)}
              className="p-3 rounded-full hover:bg-white/20 transition-transform active:scale-90"
              aria-label="Seek backward 10 seconds"
            >
              <RotateCcw className="w-7 h-7" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={() => seekRelative(10)}
              className="p-3 rounded-full hover:bg-white/20 transition-transform active:scale-90"
              aria-label="Seek forward 10 seconds"
            >
              <RotateCw className="w-7 h-7" />
            </button>
          </div>

          {/* Bottom Bar: Timeline, Volume, Brightness, Duration */}
          <div className="space-y-3">
            {/* Timeline Scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-300 w-12 text-right">
                {formatDuration(currentTime)}
              </span>

              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                  aria-label="Video timeline scrubber"
                />
              </div>

              <span className="text-xs font-mono text-zinc-300 w-12">
                {formatDuration(duration)}
              </span>
            </div>

            {/* Quick Sliders: Volume, Brightness & Fullscreen */}
            <div className="flex items-center justify-between text-zinc-300 text-xs pt-1">
              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1 hover:text-white"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  aria-label="Volume slider"
                />
              </div>

              {/* Brightness Control */}
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-300" aria-label="Brightness" />
                <input
                  type="range"
                  min={0.3}
                  max={1.3}
                  step={0.05}
                  value={brightness}
                  onChange={e => setBrightness(parseFloat(e.target.value))}
                  className="w-16 sm:w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  aria-label="Brightness control"
                />
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
