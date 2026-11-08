import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Edit2, Info, X, Check, Film, Music, HardDrive, Calendar, Clock } from 'lucide-react';
import { formatBytes, formatDate } from '../services/downloadEngine';

export const Modals: React.FC = () => {
  const {
    taskToDelete,
    setTaskToDelete,
    deleteDownload,
    taskToRename,
    setTaskToRename,
    renameDownload,
    fileInfoTask,
    setFileInfoTask,
    announceTalkBack,
  } = useApp();

  const [renameInput, setRenameInput] = useState('');

  useEffect(() => {
    if (taskToRename) {
      setRenameInput(taskToRename.title);
    }
  }, [taskToRename]);

  return (
    <>
      {/* 1. Delete Confirmation Dialog */}
      {taskToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          role="alertdialog"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-desc"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 id="delete-dialog-title" className="text-base font-bold text-zinc-100">
                Delete downloaded file?
              </h3>
              <p id="delete-dialog-desc" className="text-xs text-zinc-400 leading-relaxed">
                Are you sure you want to delete <strong className="text-zinc-200">{taskToDelete.title}</strong>? This file will be removed from your device storage.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteDownload(taskToDelete.id)}
                className="py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Rename File Modal */}
      {taskToRename && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-labelledby="rename-dialog-title"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <h3 id="rename-dialog-title" className="text-sm font-bold text-zinc-100">
                  Rename File
                </h3>
              </div>
              <button
                onClick={() => setTaskToRename(null)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                renameDownload(taskToRename.id, renameInput);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={renameInput}
                onChange={e => setRenameInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                placeholder="Enter new file title"
                autoFocus
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTaskToRename(null)}
                  className="py-2 px-3 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. File Details Modal */}
      {fileInfoTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-labelledby="info-dialog-title"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <h3 id="info-dialog-title" className="text-sm font-bold text-zinc-100">
                  File Details
                </h3>
              </div>
              <button
                onClick={() => setFileInfoTask(null)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Title
                </span>
                <p className="font-semibold text-zinc-100 mt-0.5 leading-snug">
                  {fileInfoTask.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    File Type
                  </span>
                  <p className="text-zinc-200 font-medium capitalize mt-0.5 flex items-center gap-1">
                    {fileInfoTask.fileType === 'video' ? (
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Music className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{fileInfoTask.fileType} ({fileInfoTask.format.toUpperCase()})</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    File Size
                  </span>
                  <p className="text-zinc-200 font-mono mt-0.5">
                    {formatBytes(fileInfoTask.totalSizeBytes)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Quality / Resolution
                  </span>
                  <p className="text-zinc-200 font-mono mt-0.5">
                    {fileInfoTask.quality || 'Standard HD'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Duration
                  </span>
                  <p className="text-zinc-200 font-mono mt-0.5">
                    {fileInfoTask.durationFormatted || '03:45'}
                  </p>
                </div>
              </div>

              <div className="pt-1 border-t border-zinc-800/60">
                <span className="text-[10px] uppercase font-bold text-zinc-500">
                  Storage Location
                </span>
                <p className="text-zinc-400 font-mono text-[11px] truncate mt-0.5">
                  {fileInfoTask.localFilePath}
                </p>
              </div>

              <div className="pt-1 border-t border-zinc-800/60">
                <span className="text-[10px] uppercase font-bold text-zinc-500">
                  Source Link
                </span>
                <p className="text-amber-400 text-[11px] truncate mt-0.5">
                  {fileInfoTask.originalUrl}
                </p>
              </div>
            </div>

            <button
              onClick={() => setFileInfoTask(null)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
