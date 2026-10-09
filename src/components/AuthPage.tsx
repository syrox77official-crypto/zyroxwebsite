import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { HERO_IMAGE_PATH } from '../data/initialData';

interface RegisteredAccount {
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const ACCOUNTS_STORAGE_KEY = 'zyroxx_registered_accounts_v4';

function getStoredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RegisteredAccount[];
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: RegisteredAccount[]) {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // ignore storage errors
  }
}

function simpleHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

interface AuthPageProps {
  onSuccessAuth: (profileData?: Partial<UserProfile>) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccessAuth }) => {
  const [accounts, setAccounts] = useState<RegisteredAccount[]>(() => getStoredAccounts());
  const [mode, setMode] = useState<'login' | 'register'>(() =>
    getStoredAccounts().length === 0 ? 'register' : 'login'
  );

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [heroImgError, setHeroImgError] = useState(false);

  useEffect(() => {
    setAccounts(getStoredAccounts());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (mode === 'register') {
      if (!fullName.trim() || !username.trim() || !cleanEmail || !cleanPass) {
        setErrorMsg('Seluruh kolom pendaftaran (Nama, Username, Email, dan Sandi) wajib diisi.');
        return;
      }
      if (cleanPass.length < 6) {
        setErrorMsg('Kata sandi minimal harus 6 karakter demi keamanan data Anda.');
        return;
      }
      if (cleanPass !== confirmPassword.trim()) {
        setErrorMsg('Konfirmasi kata sandi tidak cocok.');
        return;
      }

      const existing = accounts.find(
        (acc) =>
          acc.email.toLowerCase() === cleanEmail ||
          acc.username.toLowerCase() === username.trim().replace(/^@/, '').toLowerCase()
      );
      if (existing) {
        setErrorMsg('Email atau username tersebut sudah terdaftar. Silakan masuk pada tab Masuk Akun.');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        const sanitizedUsername = username.trim().replace(/^@/, '');
        const newAcc: RegisteredAccount = {
          fullName: fullName.trim(),
          username: sanitizedUsername,
          email: cleanEmail,
          passwordHash: simpleHash(cleanPass),
          createdAt: new Date().toLocaleDateString('id-ID'),
        };
        const updatedList = [...accounts, newAcc];
        setAccounts(updatedList);
        saveStoredAccounts(updatedList);
        setIsSubmitting(false);
        setSuccessMsg('Pendaftaran berhasil! Silakan masuk menggunakan akun yang baru Anda daftarkan.');
        setPassword('');
        setConfirmPassword('');
        setMode('login');
      }, 400);
      return;
    }

    if (accounts.length === 0) {
      setErrorMsg(
        'Belum ada akun yang terdaftar di perangkat ini. Anda WAJIB mendaftar terlebih dahulu pada tab Daftar Wajib.'
      );
      setMode('register');
      return;
    }

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Masukkan email/username dan kata sandi yang telah Anda daftarkan.');
      return;
    }

    const matched = accounts.find(
      (acc) =>
        (acc.email.toLowerCase() === cleanEmail ||
          acc.username.toLowerCase() === cleanEmail.replace(/^@/, '')) &&
        acc.passwordHash === simpleHash(cleanPass)
    );

    if (!matched) {
      setErrorMsg(
        'Akun tidak ditemukan atau kata sandi salah. Pastikan Anda sudah mendaftar di menu Daftar Wajib.'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessAuth({
        fullName: matched.fullName,
        username: matched.username,
        email: matched.email,
        company: 'Zyroxx Encrypted Member',
        joinedDate: matched.createdAt,
      });
    }, 350);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#07070B] text-slate-100 flex flex-col lg:flex-row relative overflow-x-hidden">
      {/* Ambient Violet Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 -left-32 w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full bg-violet-700/15 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-32 -right-24 w-[360px] sm:w-[520px] h-[360px] sm:h-[520px] rounded-full bg-purple-800/15 blur-[120px]"
      />

      {/* Mobile Compact Header Bar (Visible on Phones/Tablets < lg) */}
      <div className="lg:hidden relative z-20 px-4 pt-4 pb-2 flex items-center justify-between gap-2 border-b border-white/[0.07] bg-[#07070B]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/30 border border-violet-400/30">
            <span className="font-display font-extrabold text-lg text-white">Z</span>
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white block leading-none">
              Zyroxx
            </span>
            <span className="text-[10px] text-violet-300">
              4 Metode Fix WA & Reset OTP
            </span>
          </div>
        </div>

        <a
          href="https://t.me/zyroxxdevloper"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#141324] active:bg-violet-600/30 border border-violet-500/40 text-xs font-semibold text-violet-200 flex items-center gap-1.5 whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span className="font-mono text-[11px]">@zyroxxdevloper</span>
        </a>
      </div>

      {/* Left Column: Full Editorial Showcase on Desktop, Compact Banner at Bottom on Mobile */}
      <div className="order-2 lg:order-1 lg:w-[52%] relative flex flex-col justify-between p-4 sm:p-10 lg:p-14 border-t lg:border-t-0 lg:border-r border-white/[0.08] overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0 z-0 bg-[#0B0914]">
          {!heroImgError ? (
            <img
              src={HERO_IMAGE_PATH}
              alt="Arsitektur Monolit Obsidian dan Ungu Zyroxx"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgError(true)}
              className="w-full h-full object-cover object-center opacity-45 scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#140D26] via-[#09080F] to-[#1E1035]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070B] via-[#07070B]/80 to-[#07070B]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070B]/90 via-transparent to-[#07070B]/60" />
        </div>

        {/* Desktop Brand Header */}
        <div className="hidden lg:flex relative z-10 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30 border border-violet-400/30">
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                Z
              </span>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              Zyroxx
            </span>
          </div>

          <a
            href="https://t.me/zyroxxdevloper"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#131222]/90 hover:bg-violet-600/30 border border-violet-500/40 text-xs font-semibold text-violet-200 flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5 text-violet-400" />
            <span>Bantuan Telegram: @zyroxxdevloper</span>
          </a>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 my-auto py-4 sm:py-8 max-w-xl">
          <p className="text-[11px] sm:text-xs font-medium text-violet-300 tracking-wide mb-2">
            Sistem Pemulihan 4 Metode · Proteksi Privasi Tanpa Kebocoran Data
          </p>
          <h1 className="font-display text-xl sm:text-3xl lg:text-[40px] font-bold text-white leading-[1.2] tracking-tight mb-3 sm:mb-4">
            4 Metode Fix Nomor Merah & Reset OTP WhatsApp dalam Satu Konsol.
          </h1>
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed mb-5 sm:mb-6 max-w-[58ch]">
            Daftarkan akun anggota Zyroxx Anda terlebih dahulu untuk mengakses 4 metode pemulihan nomor merah (*Login Tidak Tersedia*), *Reset OTP*, *WhatsApp Bisnis*, dan *Sinkronisasi Server* dengan keamanan penuh.
          </p>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-6 pt-4 border-t border-white/[0.1]">
            <div>
              <div className="font-mono tabular-nums text-base sm:text-2xl font-semibold text-white">
                4 Metode
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Fix Merah & OTP
              </p>
            </div>
            <div>
              <div className="font-mono tabular-nums text-base sm:text-2xl font-semibold text-violet-400">
                60 Detik
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Kalibrasi penuh
              </p>
            </div>
            <div>
              <div className="font-mono tabular-nums text-base sm:text-2xl font-semibold text-white">
                Zero Leak
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Data terenkripsi
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/[0.08] text-[11px] text-slate-400">
          <span>Wajib registrasi anggota Zyroxx</span>
          <span>Telegram: @zyroxxdevloper</span>
        </div>
      </div>

      {/* Right Column: Form First on Mobile (order-1 lg:order-2) for Instant Thumb Access */}
      <div className="order-1 lg:order-2 lg:w-[48%] flex items-center justify-center p-3.5 sm:p-8 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          <div className="bg-[#101018] border border-white/[0.08] rounded-2xl p-4 sm:p-7 shadow-2xl shadow-black/80">
            {/* Mode Switcher (44px min touch height for mobile) */}
            <div className="grid grid-cols-2 p-1 bg-[#09090F] rounded-xl border border-white/[0.06] mb-5 relative">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`relative z-10 min-h-[44px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'register' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'register' && (
                  <motion.div
                    layoutId="authTabPill"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-violet-600 rounded-lg shadow-md shadow-violet-600/30 -z-10"
                  />
                )}
                Daftar Wajib
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`relative z-10 min-h-[44px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'login' && (
                  <motion.div
                    layoutId="authTabPill"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-violet-600 rounded-lg shadow-md shadow-violet-600/30 -z-10"
                  />
                )}
                Masuk Akun ({accounts.length})
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="mb-4"
              >
                <h2 className="font-display text-lg sm:text-2xl font-bold text-white tracking-tight">
                  {mode === 'register'
                    ? 'Pendaftaran Wajib Anggota Zyroxx'
                    : 'Masuk dengan Akun Terdaftar'}
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {mode === 'register'
                    ? 'Buat akun terlebih dahulu sebelum mengakses konsol Fix Nomor Merah & Reset OTP.'
                    : 'Gunakan email atau username yang sudah Anda daftarkan pada menu Daftar Wajib.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Alerts */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-200 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Inputs use text-base (16px) on mobile to prevent iOS/Android auto-zoom */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nama Lengkap *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Username Unik *
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: zyroxx_member"
                      className="w-full h-12 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {mode === 'register' ? 'Alamat Email Aktif *' : 'Email atau Username Terdaftar *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={mode === 'register' ? 'email' : 'text'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      mode === 'register' ? 'nama@domain.com' : 'Masukkan email atau username'
                    }
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-12 pl-10 pr-12 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Konfirmasi Kata Sandi *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi Anda"
                      className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] mt-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>
                  {isSubmitting
                    ? 'Memverifikasi Data...'
                    : mode === 'register'
                    ? 'Daftar Akun Sekarang (Wajib)'
                    : 'Masuk ke Dashboard Zyroxx'}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </motion.button>
            </form>

            {/* Direct Telegram Support Card inside Login/Register */}
            <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">Butuh bantuan aktivasi?</span>
              <a
                href="https://t.me/zyroxxdevloper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-300 hover:text-violet-200 font-semibold flex items-center gap-1.5 py-1"
              >
                <Send className="w-3.5 h-3.5 text-violet-400" />
                <span>@zyroxxdevloper</span>
              </a>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>Proteksi Anti-Kebocoran Data · Sandi Terenkripsi Hash</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
