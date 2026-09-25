import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  RotateCcw, 
  UserCircle2, 
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface HeaderProps {
  currentTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTabTitle }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    lowStockItemsCount, 
    pendingQCCount, 
    resetAllData 
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalNotifications = lowStockItemsCount + pendingQCCount;

  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30 no-print">
      {/* Zone 1: Contextual Breadcrumb / Section */}
      <div className="flex items-center gap-3 text-sm">
        <span className="font-semibold text-neutral-200">{currentTabTitle}</span>
        <span className="text-neutral-600">/</span>
        <span className="text-xs text-neutral-400">Pabrik & Sentra Produksi Mebel</span>
      </div>

      {/* Zone 2: System Status Information (clean unboxed text) */}
      <div className="hidden lg:flex items-center gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-neutral-500" />
          <span className="tabular-nums">Shift 1 (08:00 - 17:00 WIB)</span>
        </div>
        <span className="text-neutral-700">·</span>
        <span>Jepara Plant A-1</span>
        <span className="text-neutral-700">·</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Online API
        </span>
      </div>

      {/* Zone 3: Primary Actions (Notification, Reset Seed, User Role Switcher) */}
      <div className="flex items-center gap-3">
        {/* Reset Seed Button */}
        <button
          onClick={() => setShowResetConfirm(true)}
          title="Reset data ke kondisi awal pabrik"
          className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors relative"
            aria-label="Pemberitahuan"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>

          {showNotificationPanel && (
            <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl p-4 text-sm z-50">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="font-semibold text-neutral-200 text-xs">Peringatan Operasional</span>
                <span className="text-xs text-neutral-500 tabular-nums">{totalNotifications} item aktif</span>
              </div>
              <div className="py-2 space-y-2.5">
                {lowStockItemsCount > 0 ? (
                  <div className="flex items-start gap-2.5 p-2 bg-amber-950/20 border border-amber-900/40 rounded text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{lowStockItemsCount} Bahan Baku di Bawah Batas Minimum</p>
                      <p className="text-neutral-400 mt-0.5">Segera proses Purchase Order (PO) agar pengerjaan SPK tidak terhenti.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-neutral-400 py-1">Persediaan bahan baku aman di atas safety stock.</div>
                )}

                {pendingQCCount > 0 && (
                  <div className="flex items-start gap-2.5 p-2 bg-rose-950/20 border border-rose-900/40 rounded text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{pendingQCCount} Komponen Memerlukan Rework</p>
                      <p className="text-neutral-400 mt-0.5">Ditemukan deviasi serat/lengkung pada stasiun pengamplasan.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-md transition-colors text-left"
          >
            <UserCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-semibold text-neutral-200 truncate max-w-[130px]">{currentUser.name}</div>
              <div className="text-[11px] text-amber-400/90 truncate max-w-[130px]">{currentUser.roleTitle}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-neutral-800 text-xs text-neutral-400">
                Ganti Hak Akses / Simulasi Peran:
              </div>
              <div className="py-1 space-y-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between ${
                      currentUser.id === u.id
                        ? 'bg-amber-600/20 text-amber-300 font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-neutral-200">{u.name}</div>
                      <div className="text-[11px] text-neutral-400">{u.roleTitle}</div>
                    </div>
                    {currentUser.id === u.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-sm w-full p-5 space-y-4">
            <h3 className="text-base font-semibold text-neutral-100">Reset Data Pabrik Mebel?</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tindakan ini akan mengembalikan seluruh data master kayu, BOM mebel, SPK, dan stok ke nilai pabrik awal.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
