import React, { useState } from 'react';
import { Wifi, WifiOff, CloudLightning, RefreshCw, CheckCircle, Database } from 'lucide-react';

interface OfflineSyncBannerProps {
  isOffline: boolean;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
  offlineQueue: { type: string; payload: any }[];
  clearOfflineQueue: () => void;
  toast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function OfflineSyncBanner({
  isOffline,
  setIsOffline,
  offlineQueue,
  clearOfflineQueue,
  toast,
}: OfflineSyncBannerProps) {
  const [syncingNow, setSyncingNow] = useState(false);

  const handleSyncProcess = () => {
    if (offlineQueue.length === 0) return;
    setSyncingNow(true);

    // Simulate database network upload latency
    setTimeout(() => {
      setSyncingNow(false);
      const logCount = offlineQueue.length;
      clearOfflineQueue();
      toast(`Successfully synchronized ${logCount} offline actions with central Gurukul database!`, 'success');
    }, 1800);
  };

  const handleToggleConnection = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);

    if (!nextState && offlineQueue.length > 0) {
      // Toggled from offline to online - auto-trigger synchronization
      handleSyncProcess();
    } else {
      toast(nextState ? 'Coaching app switched to Offline Mode.' : 'Central internet connection recovered!', nextState ? 'info' : 'success');
    }
  };

  return (
    <div className={`rounded-2xl p-4 border transition-all shadow-sm ${
      isOffline 
        ? 'bg-amber-50 border-amber-200 text-amber-900' 
        : 'bg-indigo-50/50 border-indigo-100 text-indigo-900'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${
            isOffline ? 'bg-amber-200 text-amber-700' : 'bg-indigo-100 text-indigo-600'
          }`}>
            {isOffline ? <WifiOff className="w-5 h-5 animate-pulse" /> : <Wifi className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>Local Synchronization Engine (Offline-First)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isOffline ? 'bg-amber-200 text-amber-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {isOffline ? 'Offline Active' : 'Online / Connected'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {isOffline 
                ? 'Coaching center database is writing to SQLite/Hive local storage cache. Toggle to Online to sync!' 
                : 'Connected to primary regional cloud database. Transactions synchronized in real-time.'
              }
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleToggleConnection}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border shrink-0 shadow-xs ${
            isOffline 
              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600' 
              : 'bg-white hover:bg-slate-50 text-indigo-900 border-indigo-200'
          }`}
        >
          {isOffline ? 'Connect Online' : 'Simulate Offline State'}
        </button>
      </div>

      {/* Syncing Queue Logger */}
      {offlineQueue.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800 font-medium">
            <Database className="w-4 h-4 text-amber-600 shrink-0" />
            <span>SQLite Cache: <strong>{offlineQueue.length}</strong> unsynced educational updates pending cloud save.</span>
          </div>

          <button
            onClick={handleSyncProcess}
            disabled={syncingNow || isOffline}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-lg transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingNow ? 'animate-spin' : ''}`} />
            {syncingNow ? 'Syncing...' : 'Force Sync Cloud'}
          </button>
        </div>
      )}
    </div>
  );
}
