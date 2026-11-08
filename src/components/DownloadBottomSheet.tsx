import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FormatOption } from '../types';
import { Music, Play, ChevronRight, X, Film, Check, Radio } from 'lucide-react';

export const DownloadBottomSheet: React.FC = () => {
  const { isFormatSheetOpen, closeFormatSheet, activeMediaMetadata, startDownload, announceTalkBack } = useApp();
  const [selectedFormatId, setSelectedFormatId] = useState<string>('video_360p');
  const [showMoreFormats, setShowMoreFormats] = useState(false);

  if (!isFormatSheetOpen || !activeMediaMetadata) return null;

  const allFormats = [
    ...activeMediaMetadata.formats.audio,
    ...activeMediaMetadata.formats.video,
    ...(activeMediaMetadata.formats.moreFormats || []),
  ];

  const currentSelection = allFormats.find(f => f.id === selectedFormatId) || activeMediaMetadata.formats.video[0];

  const handleSelectFormat = (format: FormatOption) => {
    setSelectedFormatId(format.id);
    announceTalkBack(`Selected ${format.label}, ${format.estimatedSize}`);
  };

  const handleConfirmDownload = () => {
    if (currentSelection) {
      startDownload(activeMediaMetadata, currentSelection);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop click to dismiss */}
      <div
        className="absolute inset-0"
        onClick={closeFormatSheet}
        aria-hidden="true"
      />

      {/* Bottom Sheet Modal Container */}
      <div
        role="dialog"
        aria-labelledby="download-as-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg bg-[#141416] text-zinc-100 rounded-t-[32px] border-t border-zinc-800 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Top Drag Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-zinc-700/80 rounded-full" />
        </div>

        {/* Header Bar */}
        <div className="px-5 py-2 flex items-center justify-between">
          <h2 id="download-as-title" className="text-base font-bold text-zinc-100 tracking-tight">
            Download video as
          </h2>
          <button
            onClick={closeFormatSheet}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            aria-label="Close download formats sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-5">
          {/* Media Header Card matching reference screenshot 4 */}
          <div className="flex items-center gap-3 bg-zinc-900/90 rounded-2xl p-2.5 border border-zinc-800">
            <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-black shrink-0">
              <img
                src={activeMediaMetadata.thumbnailUrl}
                alt={activeMediaMetadata.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1 bg-black/80 text-[9px] font-mono font-medium rounded text-white">
                {activeMediaMetadata.durationFormatted}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-snug">
                {activeMediaMetadata.title}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 font-medium">
                {activeMediaMetadata.platformDomain}
              </p>
            </div>
          </div>

          {/* Section: Music */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Music
            </h4>

            <div className="space-y-1">
              {activeMediaMetadata.formats.audio.map(format => {
                const isSelected = selectedFormatId === format.id;
                return (
                  <button
                    key={format.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectFormat(format)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-zinc-900 border border-amber-400/50 shadow-sm'
                        : 'hover:bg-zinc-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800/80 text-zinc-300 flex items-center justify-center">
                        <Music className="w-4 h-4 text-zinc-300" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-zinc-100">
                          {format.label}
                        </div>
                        {format.quality && (
                          <div className="text-[11px] text-zinc-400">
                            {format.quality}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-zinc-300">
                        {format.estimatedSize}
                      </span>

                      {/* Custom Android Radio Button */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400 text-black'
                            : 'border-zinc-600 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Video */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Video
            </h4>

            <div className="space-y-1">
              {activeMediaMetadata.formats.video.map(format => {
                const isSelected = selectedFormatId === format.id;
                return (
                  <button
                    key={format.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectFormat(format)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-zinc-900 border border-amber-400/50 shadow-sm'
                        : 'hover:bg-zinc-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800/80 text-zinc-300 flex items-center justify-center">
                        <Play className="w-4 h-4 text-zinc-300 fill-zinc-300/40" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-zinc-100">
                          {format.label}
                        </div>
                        {format.resolution && (
                          <div className="text-[11px] text-zinc-400">
                            {format.resolution} · {format.codec}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-zinc-300">
                        {format.estimatedSize}
                      </span>

                      {/* Custom Android Radio Button */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400 text-black'
                            : 'border-zinc-600 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* More Formats Expandable Section matching screenshot */}
          <div className="pt-1">
            <button
              onClick={() => setShowMoreFormats(!showMoreFormats)}
              className="w-full flex items-center justify-between py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-expanded={showMoreFormats}
            >
              <span className="font-semibold text-zinc-300">More formats</span>
              <div className="flex items-center gap-1 text-zinc-400">
                <span>{showMoreFormats ? 'Hide' : 'All'}</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    showMoreFormats ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </button>

            {showMoreFormats && (
              <div className="mt-2 space-y-1.5 pt-2 border-t border-zinc-800">
                {activeMediaMetadata.formats.moreFormats?.map(format => {
                  const isSelected = selectedFormatId === format.id;
                  return (
                    <button
                      key={format.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectFormat(format)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-zinc-900 border border-amber-400/50'
                          : 'hover:bg-zinc-900/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                          {format.type === 'video' ? (
                            <Film className="w-3.5 h-3.5 text-zinc-300" />
                          ) : (
                            <Music className="w-3.5 h-3.5 text-zinc-300" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-semibold text-zinc-100">
                            {format.label}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {format.codec || format.bitrate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-zinc-300">
                          {format.estimatedSize}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-amber-400 text-black'
                              : 'border-zinc-600 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pinned Full-Width Download Button matching reference screenshot */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
          <button
            onClick={handleConfirmDownload}
            className="w-full h-12 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 transition-all"
            aria-label={`Download ${currentSelection?.label || 'media'}`}
          >
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
