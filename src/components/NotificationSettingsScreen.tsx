import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Bell, CheckCircle2, ShieldCheck } from 'lucide-react';

export const NotificationSettingsScreen: React.FC = () => {
  const { setSettingsSubPage, settings, updateSettings, announceTalkBack } = useApp();

  const handleToggle = (key: keyof typeof settings.notifications, label: string) => {
    updateSettings(s => {
      const nextVal = !s.notifications[key];
      announceTalkBack(`${label} ${nextVal ? 'enabled' : 'disabled'}`);
      return {
        ...s,
        notifications: {
          ...s.notifications,
          [key]: nextVal,
        },
      };
    });
  };

  const requestNativePermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      announceTalkBack(`System notification permission: ${perm}`);
    } else {
      announceTalkBack('Web notifications are simulated in this environment.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 pb-24 text-zinc-100">
      {/* Top Header matching reference screenshot 1 */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={() => {
            setSettingsSubPage('main');
            announceTalkBack('Returned to Settings');
          }}
          className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
          aria-label="Back to settings"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
      </div>

      {/* Group A: Download notifications */}
      <section className="space-y-4" aria-labelledby="download-notifs-heading">
        <h2 id="download-notifs-heading" className="text-sm font-bold text-zinc-300 tracking-wide">
          Download notifications
        </h2>

        <div className="space-y-5">
          {/* Download progress switch */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label
                htmlFor="switch-dl-progress"
                className="text-base font-medium text-zinc-100 cursor-pointer block"
              >
                Download progress
              </label>
              <p className="text-xs text-zinc-400">
                Notify me of download progress
              </p>
            </div>

            <button
              id="switch-dl-progress"
              role="switch"
              aria-checked={settings.notifications.downloadProgress}
              onClick={() => handleToggle('downloadProgress', 'Download progress notifications')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                settings.notifications.downloadProgress ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.notifications.downloadProgress ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Download completed switch */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label
                htmlFor="switch-dl-completed"
                className="text-base font-medium text-zinc-100 cursor-pointer block"
              >
                Download completed
              </label>
              <p className="text-xs text-zinc-400">
                Notify me when download is complete
              </p>
            </div>

            <button
              id="switch-dl-completed"
              role="switch"
              aria-checked={settings.notifications.downloadCompleted}
              onClick={() => handleToggle('downloadCompleted', 'Download completed notifications')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                settings.notifications.downloadCompleted ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.notifications.downloadCompleted ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Group B: Push notifications */}
      <section className="space-y-4 pt-2" aria-labelledby="push-notifs-heading">
        <h2 id="push-notifs-heading" className="text-sm font-bold text-zinc-300 tracking-wide">
          Push notifications
        </h2>

        <div className="space-y-5">
          {/* Recommended content switch */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label
                htmlFor="switch-push-rec"
                className="text-base font-medium text-zinc-100 cursor-pointer block"
              >
                Recommended content
              </label>
              <p className="text-xs text-zinc-400">
                Notify me of videos and music I might like
              </p>
            </div>

            <button
              id="switch-push-rec"
              role="switch"
              aria-checked={settings.notifications.recommendedContent}
              onClick={() => handleToggle('recommendedContent', 'Recommended content')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                settings.notifications.recommendedContent ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.notifications.recommendedContent ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Tool notifications switch */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label
                htmlFor="switch-push-tool"
                className="text-base font-medium text-zinc-100 cursor-pointer block"
              >
                Tool notifications
              </label>
              <p className="text-xs text-zinc-400">
                Notify me when new tools are released
              </p>
            </div>

            <button
              id="switch-push-tool"
              role="switch"
              aria-checked={settings.notifications.toolNotifications}
              onClick={() => handleToggle('toolNotifications', 'Tool notifications')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                settings.notifications.toolNotifications ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.notifications.toolNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toolbar switch */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label
                htmlFor="switch-push-toolbar"
                className="text-base font-medium text-zinc-100 cursor-pointer block"
              >
                Toolbar
              </label>
              <p className="text-xs text-zinc-400">
                Quick access to tools in notification bar
              </p>
            </div>

            <button
              id="switch-push-toolbar"
              role="switch"
              aria-checked={settings.notifications.toolbar}
              onClick={() => handleToggle('toolbar', 'Notification toolbar')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                settings.notifications.toolbar ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  settings.notifications.toolbar ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Android System Notification Permission Notice */}
      <div className="pt-4 border-t border-zinc-800">
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-zinc-200">
              Android 13+ Notification Permissions
            </p>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              To show foreground download progress in the system notification shade, grant the notification permission.
            </p>
            <button
              onClick={requestNativePermission}
              className="mt-2 text-xs font-semibold text-amber-400 hover:underline"
            >
              Check / Grant System Permission →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
