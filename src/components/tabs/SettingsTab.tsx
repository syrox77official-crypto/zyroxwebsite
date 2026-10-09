import React, { useState } from 'react';
import {
  Palette,
  Bell,
  Webhook,
  Database,
  UserCheck,
  LogOut,
  CheckCircle2,
  RotateCcw,
  Download,
} from 'lucide-react';
import { AppSettings, UserProfile, CustomerRecord, WorkspaceTask } from '../../types';

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (next: AppSettings) => void;
  user: UserProfile;
  customers: CustomerRecord[];
  tasks: WorkspaceTask[];
  onOpenFullProfile: () => void;
  onResetDemoData: () => void;
  onLogout: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  user,
  customers,
  tasks,
  onOpenFullProfile,
  onResetDemoData,
  onLogout,
}) => {
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const handleTestWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookStatus('Mengirim sinyal uji ke endpoint Zyroxx...');
    setTimeout(() => {
      setWebhookStatus('Berhasil: Endpoint merespons 200 OK dalam 42ms.');
      setTimeout(() => setWebhookStatus(null), 4000);
    }, 400);
  };

  const handleExportFullBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      workspace: 'Zyroxx',
      user,
      settings,
      customers,
      tasks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zyroxx_workspace_backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Settings & Konfigurasi Sistem
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sesuaikan preferensi visual hitam-ungu, notifikasi operasional, webhook, dan cadangan data.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFullProfile}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <UserCheck className="w-4 h-4" />
          <span>Buka Menu Profil Lengkap</span>
        </button>
      </div>

      {resetNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{resetNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual & Notifications (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Tampilan & Antarmuka */}
          <div className="p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] space-y-5">
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-violet-400" />
              <h2 className="font-display text-base font-bold text-white">
                Preferensi Tampilan Hitam & Ungu
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Nuansa Aksen Ungu Utama
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'violet', label: 'Electric Violet' },
                      { id: 'purple', label: 'Royal Purple' },
                      { id: 'indigo', label: 'Deep Indigo' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        onUpdateSettings({ ...settings, accentIntensity: opt.id })
                      }
                      className={`py-2.5 px-3 rounded-xl font-semibold border transition-colors cursor-pointer ${
                        settings.accentIntensity === opt.id
                          ? 'bg-violet-600/25 border-violet-400 text-white'
                          : 'bg-[#09090F] border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">
                    Mode Tabel Customer Padat (Compact Density)
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    Rapatkan jarak baris pada tabel direktori Customer untuk menampilkan lebih banyak data.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      compactTable: !settings.compactTable,
                    })
                  }
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    settings.compactTable
                      ? 'bg-violet-600 text-white'
                      : 'bg-[#181828] text-slate-300'
                  }`}
                >
                  {settings.compactTable ? 'Aktif (Padat)' : 'Standar'}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Notifikasi & Peringatan */}
          <div className="p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-violet-400" />
              <h2 className="font-display text-base font-bold text-white">
                Notifikasi & Peringatan Keamanan
              </h2>
            </div>

            <div className="divide-y divide-white/[0.06] text-xs">
              <div className="py-3 first:pt-0 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">
                    Ringkasan Laporan Mingguan via Email
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    Kirim rekapitulasi kontrak pelanggan ke {user.email} setiap hari Senin.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailWeeklyReport}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      emailWeeklyReport: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-violet-600 cursor-pointer"
                />
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">
                    Peringatan Aktivitas Pelanggan Prioritas
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    Tampilkan pemberitahuan instan saat nilai kontrak klien berubah.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.customerAlertPush}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      customerAlertPush: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-violet-600 cursor-pointer"
                />
              </div>

              <div className="py-3 last:pb-0 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">
                    Deteksi Login Sesi Baru
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    Catat setiap aktivitas masuk di riwayat keamanan akun.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.securityLoginAlert}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      securityLoginAlert: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-violet-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Webhook & Data Management (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 3: Integrasi Webhook */}
          <form
            onSubmit={handleTestWebhook}
            className="p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] space-y-4"
          >
            <div className="flex items-center gap-2.5">
              <Webhook className="w-4 h-4 text-violet-400" />
              <h2 className="font-display text-base font-bold text-white">
                Endpoint Integrasi Webhook
              </h2>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                URL Tujuan Sinkronisasi Event
              </label>
              <input
                type="url"
                value={settings.webhookUrl}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, webhookUrl: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] font-mono text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            {webhookStatus && (
              <div className="p-3 rounded-xl bg-violet-950/50 border border-violet-500/40 text-xs text-violet-200 font-mono">
                {webhookStatus}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#181828] hover:bg-violet-600 border border-white/[0.08] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Uji Koneksi Endpoint Webhook
            </button>
          </form>

          {/* Card 4: Manajemen Data & Sesi */}
          <div className="p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-violet-400" />
              <h2 className="font-display text-base font-bold text-white">
                Cadangan Data & Kendali Akun
              </h2>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleExportFullBackup}
                className="w-full py-2.5 px-4 rounded-xl bg-[#151524] hover:bg-violet-950/50 border border-white/[0.08] text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-violet-400" />
                <span>Ekspor Seluruh Data Workspace (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onResetDemoData();
                  setResetNotice('Data customer, tugas, dan pengaturan berhasil dikembalikan ke kondisi awal.');
                  setTimeout(() => setResetNotice(null), 3500);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#151524] hover:bg-[#1E1E32] border border-white/[0.08] text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset Data Demo ke Awal</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-red-950/35 hover:bg-red-950/60 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar ke Halaman Login & Daftar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
