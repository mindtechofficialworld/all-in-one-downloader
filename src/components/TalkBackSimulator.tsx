import React from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, X } from 'lucide-react';

export const TalkBackSimulator: React.FC = () => {
  const { talkBackAnnouncement, talkBackEnabled, setTalkBackEnabled } = useApp();

  return (
    <>
      {/* Invisible live region for genuine system screen readers (NVDA, JAWS, TalkBack, VoiceOver) */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {talkBackAnnouncement}
      </div>

      {/* Visual TalkBack speech simulation banner when enabled in Settings */}
      {talkBackEnabled && talkBackAnnouncement && (
        <div className="fixed bottom-16 left-4 right-4 z-50 flex items-center justify-between gap-3 bg-zinc-900/95 border border-amber-400/60 rounded-2xl p-3 shadow-2xl text-xs text-zinc-100 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                TalkBack Speech Output
              </span>
              <p className="font-medium text-zinc-100 truncate">
                &ldquo;{talkBackAnnouncement}&rdquo;
              </p>
            </div>
          </div>

          <button
            onClick={() => setTalkBackEnabled(false)}
            className="p-1 text-zinc-400 hover:text-zinc-200 shrink-0"
            aria-label="Dismiss TalkBack speech simulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
