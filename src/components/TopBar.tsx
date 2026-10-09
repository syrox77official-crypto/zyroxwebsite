import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Shield,
  LogOut,
  ExternalLink,
  ChevronDown,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  user: UserProfile;
  onOpenFullProfile: (initialSection?: 'overview' | 'edit' | 'security') => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  onOpenFullProfile,
  onLogout,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 w-full bg-[#07070B]/92 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-6 flex items-center justify-between gap-2">
      {/* Zone 1: Brand Wordmark */}
      <a
        href="#top"
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-2 min-w-0 shrink-0"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/30 border border-violet-400/30 shrink-0">
          <span className="font-display font-extrabold text-base sm:text-lg text-white">
            Z
          </span>
        </div>
        <span className="font-display text-base sm:text-xl font-bold tracking-tight text-white hover:text-violet-300 transition-colors truncate">
          Zyroxx
        </span>
      </a>

      {/* Zone 2: Privacy Protection Indicator (Desktop) */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Enkripsi Aktif · Anti-Kebocoran Data</span>
      </div>

      {/* Zone 3: Telegram Help Button + Profile Menu */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <a
          href="https://t.me/zyroxxdevloper"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-violet-600/15 hover:bg-violet-600/30 active:bg-violet-600/40 border border-violet-500/35 text-xs font-semibold text-violet-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span className="hidden sm:inline">Bantuan:</span>
          <span className="font-mono text-[11px] sm:text-xs">@zyroxxdevloper</span>
        </a>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            aria-expanded={profileMenuOpen}
            aria-haspopup="true"
            aria-label="Menu Profil"
            className="min-h-[40px] pl-1.5 pr-2 sm:pl-2 sm:pr-2.5 py-1 rounded-xl bg-[#11111A] hover:bg-[#171625] active:bg-[#1E1C30] border border-white/[0.08] hover:border-violet-500/40 flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-violet-700/40 border border-violet-400/30 flex items-center justify-center shrink-0">
              {!avatarError && user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-mono text-xs font-semibold text-violet-200">
                  {initials}
                </span>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">
                {user.fullName}
              </div>
              <div className="text-[11px] text-violet-300 leading-tight truncate max-w-[110px]">
                @{user.username}
              </div>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                profileMenuOpen ? 'rotate-180 text-violet-400' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-[310px] sm:w-80 rounded-2xl bg-[#11111A] border border-white/[0.1] shadow-2xl shadow-black/90 overflow-hidden z-50"
              >
                <div className="p-3.5 sm:p-4 bg-gradient-to-br from-violet-950/50 via-[#11111A] to-[#11111A] border-b border-white/[0.08]">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-violet-700/40 border border-violet-400/40 flex items-center justify-center shrink-0">
                      {!avatarError && user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-mono text-sm font-bold text-white">{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white truncate">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-violet-300 truncate">
                        @{user.username}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenFullProfile('overview');
                    }}
                    className="w-full min-h-[48px] px-3 py-2.5 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 active:bg-violet-600/35 border border-violet-500/30 text-left flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <User className="w-4 h-4 text-violet-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          Buka Menu Profil Lengkap
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Biodata, keamanan & riwayat sesi
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-violet-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenFullProfile('security');
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] text-left flex items-center gap-2.5 text-xs text-slate-200 transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Keamanan Sandi & Proteksi Privasi</span>
                  </button>

                  <a
                    href="https://t.me/zyroxxdevloper"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] text-left flex items-center gap-2.5 text-xs text-violet-300 transition-colors"
                  >
                    <Send className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Hubungi Telegram @zyroxxdevloper</span>
                  </a>
                </div>

                <div className="p-2 border-t border-white/[0.08] bg-[#0B0B12]">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl hover:bg-red-950/40 active:bg-red-950/60 text-left flex items-center gap-2.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Keluar ke Halaman Login</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
