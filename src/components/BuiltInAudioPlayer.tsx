import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  Repeat,
  Music,
} from 'lucide-react';
import { formatDuration } from '../services/downloadEngine';

export const BuiltInAudioPlayer: React.FC = () => {
  const { activeAudio, closeAudioPlayer, announceTalkBack } = useApp();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(activeAudio?.durationSeconds || 180);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  if (!activeAudio) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      announceTalkBack('Audio paused');
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      announceTalkBack('Audio playing');
    }
  };

  const seekDelta = (delta: number) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-label="Built-in Audio Player"
    >
      <div
        className="absolute inset-0"
        onClick={closeAudioPlayer}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-[#161619] border-t border-zinc-800 rounded-t-[32px] p-6 shadow-2xl space-y-6 animate-in slide-in-from-bottom duration-300">
        <audio
          ref={audioRef}
          src={activeAudio.mediaBlobUrl || activeAudio.originalUrl}
          autoPlay
          loop={isLoop}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase font-bold tracking-wider">
            <Music className="w-4 h-4 text-amber-400" />
            <span>Built-in Music Player</span>
          </div>

          <button
            onClick={closeAudioPlayer}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
            aria-label="Close audio player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Album Art & Title */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-36 h-36 rounded-3xl overflow-hidden shadow-2xl border-2 border-zinc-700 bg-zinc-900">
            <img
              src={activeAudio.thumbnailUrl}
              alt={activeAudio.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100 opacity-80'
              }`}
            />
            {/* Pulsing indicator when playing */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 rounded-full bg-amber-400/90 text-black flex items-center justify-center shadow-lg">
                  <Music className="w-5 h-5 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 max-w-xs">
            <h3 className="text-sm font-bold text-zinc-100 line-clamp-2">
              {activeAudio.title}
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              {activeAudio.format.toUpperCase()} · {activeAudio.quality || '320 kbps'} · {activeAudio.platform}
            </p>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={e => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              if (audioRef.current) audioRef.current.currentTime = val;
            }}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            aria-label="Audio scrubber"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-between px-4">
          <button
            onClick={() => {
              setIsLoop(!isLoop);
              announceTalkBack(`Repeat ${!isLoop ? 'enabled' : 'disabled'}`);
            }}
            className={`p-2 rounded-full transition-colors ${
              isLoop ? 'text-amber-400 bg-amber-400/10' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            aria-label="Repeat loop"
          >
            <Repeat className="w-5 h-5" />
          </button>

          <button
            onClick={() => seekDelta(-10)}
            className="p-2 text-zinc-300 hover:text-white"
            aria-label="Seek backward 10s"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => seekDelta(10)}
            className="p-2 text-zinc-300 hover:text-white"
            aria-label="Seek forward 10s"
          >
            <RotateCw className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              if (audioRef.current) audioRef.current.muted = next;
            }}
            className="p-2 text-zinc-400 hover:text-zinc-200"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
