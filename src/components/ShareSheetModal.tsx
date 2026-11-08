import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Share2, X, ExternalLink, Sparkles, Send } from 'lucide-react';
import { SAMPLE_URLS } from '../services/mediaParser';

export const ShareSheetModal: React.FC = () => {
  const { isShareSheetOpen, setIsShareSheetOpen, handleIncomingShare, announceTalkBack } = useApp();
  const [customShareText, setCustomShareText] = useState(
    'Hey, check out this viral clip on YouTube: https://youtu.be/m98kL2sY10A !'
  );

  if (!isShareSheetOpen) return null;

  const handleSimulateAppShare = (appName: string, sampleUrl: string) => {
    announceTalkBack(`Simulating share from ${appName}`);
    const simulatedIntentExtra = `Shared via ${appName}: ${sampleUrl}`;
    handleIncomingShare(simulatedIntentExtra);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customShareText.trim()) return;
    handleIncomingShare(customShareText);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-label="Android Share Sheet Simulator"
    >
      <div
        className="absolute inset-0"
        onClick={() => setIsShareSheetOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-[#161619] border-t sm:border border-zinc-800 rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Android Share Sheet Integration
              </h3>
              <p className="text-[11px] text-zinc-400">
                Intent.ACTION_SEND Compatibility
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShareSheetOpen(false)}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            aria-label="Close share sheet simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation */}
        <div className="text-xs text-zinc-300 space-y-1.5 leading-relaxed bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
          <p className="font-semibold text-zinc-200">
            How it works in Android:
          </p>
          <p className="text-zinc-400 text-[11px]">
            When you tap <strong>Share</strong> in YouTube, TikTok, or Instagram and choose <strong>All in One Downloader</strong> from Android&apos;s native share sheet, the app intercepts the incoming URL intent, validates it, and immediately opens the download format selection bottom sheet.
          </p>
        </div>

        {/* 1-Tap App Simulations */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Simulate Sharing from App:
          </span>

          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_URLS.map(sample => (
              <button
                key={sample.platform}
                onClick={() => handleSimulateAppShare(sample.platform, sample.url)}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/50 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                    {sample.platform}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                    {sample.label}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Text / Intent Simulator */}
        <form onSubmit={handleCustomSubmit} className="space-y-2 pt-1 border-t border-zinc-800">
          <label htmlFor="custom-share-input" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Or test custom shared text / URL:
          </label>
          <div className="relative">
            <textarea
              id="custom-share-input"
              rows={2}
              value={customShareText}
              onChange={e => setCustomShareText(e.target.value)}
              placeholder="Paste any text with a video link inside..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Process Shared Intent</span>
          </button>
        </form>
      </div>
    </div>
  );
};
