import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Wrench,
  Users,
  Settings,
  X,
  UserCheck,
  PlusCircle,
  LogOut,
  ChevronRight,
  FolderKanban,
  FileSpreadsheet,
} from 'lucide-react';
import { NavTab, UserProfile } from '../types';

interface LeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfile;
  onOpenFullProfile: (initialSection?: 'overview' | 'edit' | 'security') => void;
  onOpenAddCustomer: () => void;
  onLogout: () => void;
}

const MENU_ITEMS: {
  id: NavTab;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'home',
    label: 'Home',
    desc: 'Ringkasan metrik, grafik pendapatan & agenda',
    icon: Home,
  },
  {
    id: 'tools',
    label: 'Tools',
    desc: 'Kalkulator ROI, generator invoice & konverter',
    icon: Wrench,
  },
  {
    id: 'customer',
    label: 'Customer',
    desc: 'Direktori klien korporat, nilai kontrak & CRM',
    icon: Users,
  },
  {
    id: 'settings',
    label: 'Settings',
    desc: 'Konfigurasi sistem, tema ungu & integrasi',
    icon: Settings,
  },
];

export const LeftDrawer: React.FC<LeftDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  user,
  onOpenFullProfile,
  onOpenAddCustomer,
  onLogout,
}) => {
  const [avatarError, setAvatarError] = useState(false);

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
          />

          {/* Slide-Out Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Menu Navigasi Samping Zyroxx"
            className="fixed top-0 left-0 bottom-0 z-50 w-[310px] sm:w-[340px] bg-[#0B0B13] border-r border-white/[0.1] flex flex-col justify-between shadow-2xl shadow-black"
          >
            {/* Top Header */}
            <div>
              <div className="h-14 px-5 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-display font-bold text-white text-sm">
                    Z
                  </div>
                  <div>
                    <span className="font-display font-bold text-base text-white tracking-tight">
                      Zyroxx
                    </span>
                    <span className="mx-1.5 text-slate-600">·</span>
                    <span className="text-xs text-violet-300">Menu Utama</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup menu samping"
                  className="w-9 h-9 rounded-xl bg-[#141422] hover:bg-violet-950/60 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Primary 4 Navigation Links */}
              <div className="p-4">
                <div className="text-xs font-medium text-slate-400 px-2 mb-2.5">
                  Modul Navigasi (4 Halaman)
                </div>

                <div className="space-y-1.5">
                  {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          onClose();
                        }}
                        className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-violet-600/20 border border-violet-500/40 text-white'
                            : 'hover:bg-white/[0.04] border border-transparent text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive
                                ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/40'
                                : 'bg-[#151522] text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{item.label}</div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-violet-300' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Section */}
              <div className="px-4 pt-2 pb-4 border-t border-white/[0.06]">
                <div className="text-xs font-medium text-slate-400 px-2 mb-2.5">
                  Tindakan Cepat
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('customer');
                      onOpenAddCustomer();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131320] hover:bg-violet-950/40 border border-white/[0.07] text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-violet-400" />
                    <span>Tambah Data Customer Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('tools');
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131320] hover:bg-violet-950/40 border border-white/[0.07] text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-violet-400" />
                    <span>Buka Kalkulator ROI & Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenFullProfile('overview');
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131320] hover:bg-violet-950/40 border border-white/[0.07] text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-violet-400" />
                    <span>Buka Bagian Menu Profil Lengkap</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Account Card & Logout */}
            <div className="p-4 border-t border-white/[0.08] bg-[#08080E]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-violet-700/40 border border-violet-500/30 flex items-center justify-center shrink-0">
                    {!avatarError && user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-mono text-xs font-bold text-white">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {user.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {user.company}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFullProfile('edit');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#151524] hover:bg-violet-600/30 border border-white/[0.08] text-[11px] font-medium text-violet-300 cursor-pointer whitespace-nowrap"
                >
                  Edit Profil
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/25 text-xs font-semibold text-red-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Sesi Zyroxx</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
