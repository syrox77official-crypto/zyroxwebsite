import { UserProfile, CustomerRecord, WorkspaceTask, ActivityItem, AppSettings } from '../types';

export const HERO_IMAGE_PATH = '/src/assets/images/zyroxx_hero_abstract_1791463666864.jpg';
export const AVATAR_IMAGE_PATH = '/src/assets/images/avatar_zyroxx_founder_1791463683447.jpg';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'USR-ZX-001',
  fullName: 'Raka Pratama',
  username: 'zyroxx_founder',
  email: 'raka@zyroxx.id',
  phone: '+62 812-8890-4421',
  role: 'Principal Product Architect',
  company: 'Zyroxx Studio Nusantara',
  location: 'Jakarta Selatan, Indonesia',
  bio: 'Membangun ekosistem operasional digital, automasi alur kerja, dan manajemen pelanggan berkecepatan tinggi dengan arsitektur Zyroxx.',
  avatarUrl: AVATAR_IMAGE_PATH,
  joinedDate: '14 Januari 2025',
  planName: 'Enterprise Workspace',
  twoFactorEnabled: true,
  verified: true,
};

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'CUST-901',
    name: 'Nadia Kusuma',
    company: 'PT Vortech Digital Nusantara',
    email: 'nadia.k@vortech.co.id',
    phone: '+62 811-9402-110',
    status: 'Prioritas',
    segment: 'Enterprise Cloud',
    contractValue: 185000000,
    lastInteraction: '2 jam lalu',
    joinedAt: '12 Jan 2026',
    notes: 'Integrasi lisensi penuh 120 kursi kerja serta automasi webhook tagihan bulanan.',
  },
  {
    id: 'CUST-902',
    name: 'Dimas Anggara',
    company: 'Kinetik Logistik Terpadu',
    email: 'dimas@kinetiklogistik.id',
    phone: '+62 813-2201-889',
    status: 'Aktif',
    segment: 'Supply Chain',
    contractValue: 94500000,
    lastInteraction: '5 jam lalu',
    joinedAt: '03 Feb 2026',
    notes: 'Menggunakan modul Tools kalkulasi margin dan pelacakan SLA pelanggan regional.',
  },
  {
    id: 'CUST-903',
    name: 'Aurelia Tanuwijaya',
    company: 'Lumina FinTech Asia',
    email: 'aurelia@luminafintech.com',
    phone: '+62 818-7731-502',
    status: 'Prioritas',
    segment: 'Keuangan & Pembayaran',
    contractValue: 260000000,
    lastInteraction: 'Kemarin, 16:40',
    joinedAt: '19 Mar 2026',
    notes: 'Perpanjangan kontrak tahunan disetujui. Membutuhkan laporan audit kuartal berikutnya.',
  },
  {
    id: 'CUST-904',
    name: 'Reza Mahendra',
    company: 'Artha Kreasi Media',
    email: 'reza@arthakreasi.id',
    phone: '+62 852-1094-332',
    status: 'Aktif',
    segment: 'Agensi Kreatif',
    contractValue: 48000000,
    lastInteraction: '2 hari lalu',
    joinedAt: '08 Mei 2026',
    notes: 'Tim kreatif aktif menggunakan generator kampanye UTM dan modul invoice cepat.',
  },
  {
    id: 'CUST-905',
    name: 'Sinta Maharani',
    company: 'Hexa Medika Utama',
    email: 'sinta.m@hexamedika.co.id',
    phone: '+62 812-3009-771',
    status: 'Prospek',
    segment: 'Kesehatan Digital',
    contractValue: 132000000,
    lastInteraction: '3 hari lalu',
    joinedAt: '21 Sep 2026',
    notes: 'Tahap negosiasi akhir untuk migrasi database 14 cabang klinik ke Zyroxx.',
  },
  {
    id: 'CUST-906',
    name: 'Bima Sakti Wicaksono',
    company: 'Nova Energi Mandiri',
    email: 'bima@novaenergi.id',
    phone: '+62 817-6620-914',
    status: 'Aktif',
    segment: 'Infrastruktur',
    contractValue: 115000000,
    lastInteraction: '4 hari lalu',
    joinedAt: '11 Agu 2026',
    notes: 'Implementasi dashboard pemantauan pelanggan korporat berjalan lancar.',
  },
];

export const INITIAL_TASKS: WorkspaceTask[] = [
  {
    id: 'TSK-101',
    title: 'Verifikasi perpanjangan kontrak PT Vortech Digital Nusantara',
    category: 'Customer',
    dueTime: 'Hari ini · 14:30 WIB',
    completed: false,
    assignee: 'Raka Pratama',
  },
  {
    id: 'TSK-102',
    title: 'Audit kalkulasi margin kuartal Q4 pada modul Zyroxx Tools',
    category: 'Tools',
    dueTime: 'Hari ini · 17:00 WIB',
    completed: false,
    assignee: 'Raka Pratama',
  },
  {
    id: 'TSK-103',
    title: 'Kirim penawaran harga ke Hexa Medika Utama',
    category: 'Customer',
    dueTime: 'Besok · 10:00 WIB',
    completed: true,
    assignee: 'Nadia K.',
  },
  {
    id: 'TSK-104',
    title: 'Sinkronisasi endpoint webhook laporan transaksi mingguan',
    category: 'Settings',
    dueTime: '12 Okt · 09:00 WIB',
    completed: true,
    assignee: 'Raka Pratama',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'ACT-01',
    action: 'Pembayaran faktur tahunan diterima dari',
    target: 'Lumina FinTech Asia',
    timestamp: '18 menit lalu',
    amount: '+Rp 260.000.000',
  },
  {
    id: 'ACT-02',
    action: 'Estimasi invoice baru dibuat melalui Tools untuk',
    target: 'Hexa Medika Utama',
    timestamp: '1 jam lalu',
    amount: 'Rp 132.000.000',
  },
  {
    id: 'ACT-03',
    action: 'Data profil pelanggan diperbarui pada akun',
    target: 'PT Vortech Digital Nusantara',
    timestamp: '3 jam lalu',
  },
  {
    id: 'ACT-04',
    action: 'Konfigurasi keamanan 2FA diverifikasi oleh',
    target: 'Raka Pratama (@zyroxx_founder)',
    timestamp: 'Kemarin · 21:15',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  accentIntensity: 'violet',
  compactTable: false,
  reducedMotion: false,
  emailWeeklyReport: true,
  customerAlertPush: true,
  securityLoginAlert: true,
  webhookUrl: 'https://api.zyroxx.id/v1/webhooks/events',
  currencyFormat: 'IDR',
};

export function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}
