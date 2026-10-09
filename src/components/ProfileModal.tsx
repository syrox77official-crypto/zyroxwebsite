import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  ShieldCheck,
  KeyRound,
  Smartphone,
  CheckCircle2,
  LogOut,
  Save,
  Clock,
} from 'lucide-react';
import { UserProfile, ActivityItem } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  initialSection: 'overview' | 'edit' | 'security';
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  activities: ActivityItem[];
  customerCount: number;
  completedTasksCount: number;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  initialSection,
  onClose,
  user,
  onUpdateUser,
  activities,
  customerCount,
  completedTasksCount,
  onLogout,
}) => {
  const [section, setSection] = useState<'overview' | 'edit' | 'security'>(initialSection);
  const [formState, setFormState] = useState<UserProfile>(user);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection, isOpen]);

  useEffect(() => {
    setFormState(user);
  }, [user]);

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formState);
    setSaveMessage('Perubahan profil berhasil disimpan ke akun Zyroxx Anda.');
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) {
      setPasswordMessage('Kata sandi baru minimal harus terdiri dari 6 karakter.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setPasswordMessage('Kata sandi akun Zyroxx berhasil diperbarui.');
    setTimeout(() => setPasswordMessage(null), 3500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Slide-Over Full Profile Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Bagian Menu Profil Lengkap"
            className="relative z-10 w-full max-w-2xl h-[100dvh] bg-[#0A0A12] border-l border-white/[0.1] flex flex-col justify-between overflow-hidden shadow-2xl shadow-black"
          >
            {/* Top Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#0F0F1A] border-b border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
              <div className="min-w-0">
                <h2 className="font-display text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  Bagian Menu Profil Lengkap
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                  Identitas akun Zyroxx · Pengaturan pribadi & riwayat keamanan
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup profil lengkap"
                className="w-10 h-10 rounded-xl bg-[#171726] hover:bg-violet-950/60 active:bg-violet-900/60 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
              {/* Profile Hero Banner */}
              <div className="rounded-2xl bg-gradient-to-br from-violet-950/60 via-[#12121E] to-[#0D0D16] border border-white/[0.08] p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-violet-700/40 border-2 border-violet-400/50 flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/30">
                      {!avatarError && user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-mono text-lg sm:text-xl font-bold text-white">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate">
                        {user.fullName}
                      </h3>
                      <div className="text-xs text-violet-300 font-medium mt-0.5 truncate">
                        @{user.username} · {user.role}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {user.company} · {user.location}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
                        <span>ID: {user.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>Bergabung {user.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setSection('edit')}
                      className="w-full sm:w-auto min-h-[40px] px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Edit Biodata
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <p className="mt-3.5 pt-3.5 border-t border-white/[0.08] text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {user.bio}
                </p>

                {/* Quick Account Metrics (Tabular Nums) */}
                <div className="mt-3.5 pt-3.5 border-t border-white/[0.08] grid grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400">Lisensi Aktif</div>
                    <div className="text-xs sm:text-sm font-semibold text-white mt-0.5 truncate">
                      {user.planName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400">Tiket Dikelola</div>
                    <div className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-violet-300 mt-0.5">
                      {customerCount} Nomor
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400">Fix Selesai</div>
                    <div className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-emerald-400 mt-0.5">
                      {completedTasksCount} Selesai
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Section Tabs (Responsive Labels on Mobile) */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#11111C] rounded-xl border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setSection('overview')}
                  className={`min-h-[40px] py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer truncate ${
                    section === 'overview'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="sm:hidden">Detail</span>
                  <span className="hidden sm:inline">Detail & Aktivitas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSection('edit')}
                  className={`min-h-[40px] py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer truncate ${
                    section === 'edit'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="sm:hidden">Edit Profil</span>
                  <span className="hidden sm:inline">Edit Profil Lengkap</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSection('security')}
                  className={`min-h-[40px] py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer truncate ${
                    section === 'security'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="sm:hidden">Keamanan</span>
                  <span className="hidden sm:inline">Keamanan & Sesi</span>
                </button>
              </div>

              {/* Section 1: Detail & Aktivitas */}
              {section === 'overview' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Contact & Identity Card */}
                  <div className="rounded-2xl bg-[#11111A] border border-white/[0.08] p-4 sm:p-5">
                    <h4 className="text-sm font-semibold text-white mb-3.5">
                      Informasi Kontak & Organisasi
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#0B0B12] border border-white/[0.05]">
                        <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                          <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>Email Utama</span>
                        </div>
                        <div className="font-medium text-white break-all">{user.email}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0B0B12] border border-white/[0.05]">
                        <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                          <Phone className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>Nomor Telepon / WhatsApp</span>
                        </div>
                        <div className="font-mono tabular-nums font-medium text-white">
                          {user.phone}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0B0B12] border border-white/[0.05]">
                        <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                          <Briefcase className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>Jabatan / Peran</span>
                        </div>
                        <div className="font-medium text-white">{user.role}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0B0B12] border border-white/[0.05]">
                        <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>Domisili Operasional</span>
                        </div>
                        <div className="font-medium text-white">{user.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Account Activity Log */}
                  <div className="rounded-2xl bg-[#11111A] border border-white/[0.08] p-4 sm:p-5">
                    <h4 className="text-sm font-semibold text-white mb-3.5">
                      Riwayat Aktivitas Akun Terkini
                    </h4>
                    <div className="divide-y divide-white/[0.06]">
                      {activities.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 text-xs"
                        >
                          <div className="min-w-0">
                            <span className="text-slate-300">{item.action} </span>
                            <span className="font-semibold text-white break-words">{item.target}</span>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-violet-400 shrink-0" />
                              <span>{item.timestamp}</span>
                            </div>
                          </div>
                          {item.amount && (
                            <span className="font-mono tabular-nums font-semibold text-violet-300 whitespace-nowrap">
                              {item.amount}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Edit Profil Lengkap */}
              {section === 'edit' && (
                <form
                  onSubmit={handleSaveProfile}
                  className="rounded-2xl bg-[#11111A] border border-white/[0.08] p-4 sm:p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-semibold text-white">
                      Formulir Pembaruan Biodata Lengkap
                    </h4>
                    <span className="text-[11px] text-slate-400">Tersimpan otomatis ke sesi</span>
                  </div>

                  {saveMessage && (
                    <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{saveMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={formState.fullName}
                          onChange={(e) =>
                            setFormState({ ...formState, fullName: e.target.value })
                          }
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Username (@)
                      </label>
                      <input
                        type="text"
                        value={formState.username}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            username: e.target.value.replace(/^@/, ''),
                          })
                        }
                        className="w-full h-11 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({ ...formState, email: e.target.value })
                          }
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          value={formState.phone}
                          onChange={(e) =>
                            setFormState({ ...formState, phone: e.target.value })
                          }
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Jabatan / Role
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={formState.role}
                          onChange={(e) =>
                            setFormState({ ...formState, role: e.target.value })
                          }
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Perusahaan / Organisasi
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={formState.company}
                          onChange={(e) =>
                            setFormState({ ...formState, company: e.target.value })
                          }
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Lokasi / Kota
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={formState.location}
                        onChange={(e) =>
                          setFormState({ ...formState, location: e.target.value })
                        }
                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Bio Profesional
                    </label>
                    <textarea
                      rows={3}
                      value={formState.bio}
                      onChange={(e) =>
                        setFormState({ ...formState, bio: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4 shrink-0" />
                      <span>Simpan Perubahan Profil</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Section 3: Keamanan & Sesi */}
              {section === 'security' && (
                <div className="space-y-4 sm:space-y-5">
                  <div className="rounded-2xl bg-[#11111A] border border-white/[0.08] p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            Autentikasi Dua Faktor (2FA)
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Tambahkan verifikasi kode OTP setiap kali login dari perangkat baru.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateUser({
                            ...user,
                            twoFactorEnabled: !user.twoFactorEnabled,
                          })
                        }
                        className={`w-full sm:w-auto min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          user.twoFactorEnabled
                            ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {user.twoFactorEnabled ? 'Status: Aktif' : 'Aktifkan 2FA'}
                      </button>
                    </div>
                  </div>

                  <form
                    onSubmit={handlePasswordChange}
                    className="rounded-2xl bg-[#11111A] border border-white/[0.08] p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-violet-400 shrink-0" />
                      <h4 className="text-sm font-semibold text-white">
                        Perbarui Kata Sandi Akun
                      </h4>
                    </div>

                    {passwordMessage && (
                      <div className="p-3 rounded-xl bg-violet-950/60 border border-violet-500/40 text-xs text-violet-200">
                        {passwordMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1.5">
                          Kata Sandi Saat Ini
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1.5">
                          Kata Sandi Baru
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full h-11 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-base sm:text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        Perbarui Sandi
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Sticky Bottom Bar inside Profile Modal */}
            <div className="px-4 sm:px-6 py-3.5 bg-[#0D0D16] border-t border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Akun Terverifikasi Zyroxx</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 active:bg-red-900/70 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
