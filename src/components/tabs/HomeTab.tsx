import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Circle,
  Download,
  UserCheck,
  Wrench,
  Users,
  Trash2,
} from 'lucide-react';
import {
  UserProfile,
  CustomerRecord,
  WorkspaceTask,
  ActivityItem,
  NavTab,
} from '../../types';
import { formatIDR, HERO_IMAGE_PATH } from '../../data/initialData';

interface HomeTabProps {
  user: UserProfile;
  customers: CustomerRecord[];
  tasks: WorkspaceTask[];
  activities: ActivityItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, category: string) => void;
  onDeleteTask: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenFullProfile: () => void;
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

const CHART_DATA: Record<
  TimeRange,
  {
    label: string;
    revenueMultiplier: number;
    growth: string;
    conversion: string;
    points: { period: string; value: number; target: number }[];
  }
> = {
  '7d': {
    label: '7 Hari Terakhir',
    revenueMultiplier: 0.24,
    growth: '+14.8%',
    conversion: '68.4%',
    points: [
      { period: 'Sen', value: 42, target: 38 },
      { period: 'Sel', value: 58, target: 45 },
      { period: 'Rab', value: 51, target: 48 },
      { period: 'Kam', value: 74, target: 55 },
      { period: 'Jum', value: 86, target: 62 },
      { period: 'Sab', value: 69, target: 60 },
      { period: 'Min', value: 94, target: 70 },
    ],
  },
  '30d': {
    label: '30 Hari Terakhir',
    revenueMultiplier: 1,
    growth: '+28.4%',
    conversion: '74.2%',
    points: [
      { period: 'Mgg 1', value: 55, target: 48 },
      { period: 'Mgg 2', value: 68, target: 54 },
      { period: 'Mgg 3', value: 64, target: 60 },
      { period: 'Mgg 4', value: 82, target: 68 },
      { period: 'Mgg 5', value: 91, target: 75 },
      { period: 'Mgg 6', value: 88, target: 78 },
      { period: 'Saat Ini', value: 97, target: 82 },
    ],
  },
  '90d': {
    label: 'Kuartal Ini (Q4)',
    revenueMultiplier: 2.85,
    growth: '+41.2%',
    conversion: '79.6%',
    points: [
      { period: 'Jul', value: 48, target: 45 },
      { period: 'Agu', value: 62, target: 52 },
      { period: 'Sep', value: 77, target: 64 },
      { period: 'Okt M1', value: 81, target: 70 },
      { period: 'Okt M2', value: 89, target: 76 },
      { period: 'Okt M3', value: 93, target: 80 },
      { period: 'Okt M4', value: 98, target: 85 },
    ],
  },
  '1y': {
    label: '1 Tahun Penuh',
    revenueMultiplier: 11.4,
    growth: '+142.0%',
    conversion: '83.5%',
    points: [
      { period: 'Q1', value: 40, target: 35 },
      { period: 'Q2 Awal', value: 54, target: 46 },
      { period: 'Q2 Akhir', value: 67, target: 58 },
      { period: 'Q3 Awal', value: 75, target: 65 },
      { period: 'Q3 Akhir', value: 84, target: 72 },
      { period: 'Q4 Awal', value: 92, target: 80 },
      { period: 'Q4 Kini', value: 99, target: 86 },
    ],
  },
};

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  customers,
  tasks,
  activities,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onNavigateTab,
  onOpenFullProfile,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Customer');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [bannerImgError, setBannerImgError] = useState(false);

  const baseContractSum = customers.reduce((acc, c) => acc + c.contractValue, 0);
  const currentChart = CHART_DATA[timeRange];
  const calculatedRevenue = Math.round(baseContractSum * currentChart.revenueMultiplier);
  const activeCustomersCount = customers.filter(
    (c) => c.status === 'Aktif' || c.status === 'Prioritas'
  ).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskCategory);
    setNewTaskTitle('');
  };

  const handleExportSummaryCSV = () => {
    const headers = ['ID,Nama Pelanggan,Perusahaan,Status,Nilai Kontrak (IDR)'];
    const rows = customers.map(
      (c) => `"${c.id}","${c.name}","${c.company}","${c.status}",${c.contractValue}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zyroxx_laporan_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#10101A]">
        <div className="absolute inset-0 z-0">
          {!bannerImgError ? (
            <img
              src={HERO_IMAGE_PATH}
              alt="Latar Visual Zyroxx"
              referrerPolicy="no-referrer"
              onError={() => setBannerImgError(true)}
              className="w-full h-full object-cover object-center opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#1A1033] via-[#0E0B16] to-[#120D24]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090910] via-[#090910]/85 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-violet-300 font-medium mb-2">
              <span>Dashboard Eksekutif Zyroxx</span>
              <span aria-hidden="true">·</span>
              <span>{user.company}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Selamat bekerja, {user.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Pantau performa pendapatan korporat, jalankan kalkulator bisnis di menu Tools, atau kelola direktori Customer Anda secara langsung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenFullProfile}
              className="px-4 py-2.5 rounded-xl bg-[#161625] hover:bg-[#1E1E32] border border-white/[0.1] text-xs font-semibold text-slate-100 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4 text-violet-400" />
              <span>Profil Lengkap</span>
            </button>

            <button
              type="button"
              onClick={handleExportSummaryCSV}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Laporan CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Timeframe + Primary 4 Metric Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Ikhtisar Kinerja Operasional
            </h2>
            <p className="text-xs text-slate-400">
              Menampilkan metrik terukur untuk periode {currentChart.label}
            </p>
          </div>

          {/* Interactive Period Filter Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#10101A] border border-white/[0.08] self-start">
            {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  timeRange === range
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range === '7d'
                  ? '7 Hari'
                  : range === '30d'
                  ? '30 Hari'
                  : range === '90d'
                  ? 'Kuartal'
                  : '1 Tahun'}
              </button>
            ))}
          </div>
        </div>

        {/* Single-Elevation Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#10101A] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Nilai Kontrak Terkelola</span>
              <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                {currentChart.growth}
              </span>
            </div>
            <div className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-white mt-3">
              {formatIDR(calculatedRevenue)}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Akumulasi kontrak aktif · {currentChart.label}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#10101A] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pelanggan Aktif & Prioritas</span>
              <button
                type="button"
                onClick={() => onNavigateTab('customer')}
                className="text-violet-400 hover:text-violet-300 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Buka CRM</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-white mt-3">
              {activeCustomersCount} / {customers.length} Klien
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Retensi pelanggan korporat 98.4%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#10101A] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Rasio Konversi Penawaran</span>
              <button
                type="button"
                onClick={() => onNavigateTab('tools')}
                className="text-violet-400 hover:text-violet-300 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Kalkulator</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-violet-300 mt-3">
              {currentChart.conversion}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Melampaui target kuartal sebesar +6.2%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#10101A] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Penyelesaian Agenda Tim</span>
              <span className="font-mono tabular-nums text-violet-300 font-semibold">
                {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 100}%
              </span>
            </div>
            <div className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-white mt-3">
              {completedTasks} dari {tasks.length} Tugas
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Sinkronisasi langsung dengan agenda kerja
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Analytics Chart + Module Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Visual Revenue & Target Trajectory */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Trajektori Pertumbuhan & Target Operasional
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbandingan indeks realisasi ungu terhadap target dasar ({currentChart.label})
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" />
                <span className="text-slate-300">Realisasi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 inline-block" />
                <span className="text-slate-400">Target</span>
              </div>
            </div>
          </div>

          {/* Interactive Bar Comparison Chart */}
          <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1 border-b border-white/[0.06]">
            {currentChart.points.map((pt, idx) => {
              const isHovered = hoveredBarIndex === idx;
              return (
                <div
                  key={pt.period}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  <div className="text-[10px] font-mono tabular-nums text-violet-300 h-4">
                    {isHovered ? `${pt.value}%` : ''}
                  </div>
                  <div className="w-full max-w-[44px] h-36 flex items-end justify-center gap-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: pt.target / 100 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'bottom' }}
                      className="w-1/2 h-full bg-slate-800 rounded-t-md"
                    />
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: pt.value / 100 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'bottom' }}
                      className={`w-1/2 h-full rounded-t-md transition-colors ${
                        isHovered
                          ? 'bg-violet-400 shadow-lg shadow-violet-500/40'
                          : 'bg-violet-600'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors truncate">
                    {pt.period}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Arahkan kursor pada grafik batang untuk melihat persentase capaian</span>
            <span className="font-mono tabular-nums text-violet-300 font-semibold">
              Puncak: {Math.max(...currentChart.points.map((p) => p.value))}%
            </span>
          </div>
        </div>

        {/* Right 5 Columns: Quick Navigation Portal to Tools & Customer */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10101A] border border-white/[0.08] flex flex-col justify-between space-y-5">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Akses Cepat Modul Zyroxx
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pindah cepat antar ruang kerja utama atau jalankan peralatan bisnis.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onNavigateTab('tools')}
              className="w-full p-4 rounded-xl bg-[#151524] hover:bg-violet-950/40 border border-white/[0.07] hover:border-violet-500/40 text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-violet-200">
                    Buka Zyroxx Tools
                  </div>
                  <div className="text-xs text-slate-400">
                    Kalkulator ROI, generator invoice PPN 11%, & konverter JSON
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-300 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('customer')}
              className="w-full p-4 rounded-xl bg-[#151524] hover:bg-violet-950/40 border border-white/[0.07] hover:border-violet-500/40 text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-violet-200">
                    Kelola Direktori Customer
                  </div>
                  <div className="text-xs text-slate-400">
                    Tambah pelanggan baru, filter status prioritas & nilai kontrak
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-300 shrink-0" />
            </button>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>Status sinkronisasi lokal</span>
            <span className="text-emerald-400 font-medium">Aktif · Tersimpan Otomatis</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Interactive Task Queue & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Task Manager (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10101A] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Agenda & Tugas Operasional
              </h3>
              <p className="text-xs text-slate-400">
                Klik pada tugas untuk menandai selesai atau tambahkan agenda baru
              </p>
            </div>
            <span className="font-mono tabular-nums text-xs text-violet-300">
              {completedTasks}/{tasks.length} Selesai
            </span>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-2.5 mb-5">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Tulis agenda atau tindak lanjut baru..."
              className="flex-1 h-10 px-3.5 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
            <div className="flex gap-2">
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                aria-label="Kategori tugas"
                className="h-10 px-3 rounded-xl bg-[#09090F] border border-white/[0.08] text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              >
                <option value="Customer">Customer</option>
                <option value="Tools">Tools</option>
                <option value="Settings">Settings</option>
              </select>
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>
          </form>

          {/* Task Rows */}
          <div className="divide-y divide-white/[0.06]">
            {tasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada agenda kerja. Tambahkan tugas pertama Anda di atas.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="py-3 flex items-center justify-between gap-3 group"
                >
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-start gap-3 text-left flex-1 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 group-hover:text-violet-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div
                        className={`text-xs sm:text-sm font-medium transition-colors ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        <span>{task.category}</span>
                        <span className="mx-1.5">·</span>
                        <span className="font-mono tabular-nums">{task.dueTime}</span>
                        <span className="mx-1.5">·</span>
                        <span>PIC: {task.assignee}</span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    aria-label="Hapus tugas"
                    className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Stream (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10101A] border border-white/[0.08]">
          <div className="mb-4">
            <h3 className="font-display text-base font-bold text-white">
              Log Aktivitas Workspace
            </h3>
            <p className="text-xs text-slate-400">
              Pembaruan transaksi dan perubahan sistem secara langsung
            </p>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {activities.map((act) => (
              <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="leading-relaxed">
                    <span className="text-slate-300">{act.action} </span>
                    <span className="font-semibold text-white">{act.target}</span>
                  </div>
                  {act.amount && (
                    <span className="font-mono tabular-nums font-semibold text-violet-300 shrink-0">
                      {act.amount}
                    </span>
                  )}
                </div>
                <div className="font-mono tabular-nums text-[11px] text-slate-500 mt-1">
                  {act.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
