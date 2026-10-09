export type NavTab = 'home' | 'tools' | 'customer' | 'settings';

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  avatarUrl: string;
  joinedDate: string;
  planName: string;
  twoFactorEnabled: boolean;
  verified: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Aktif' | 'Prioritas' | 'Prospek' | 'Nonaktif';
  segment: string;
  contractValue: number;
  lastInteraction: string;
  joinedAt: string;
  notes: string;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  category: string;
  dueTime: string;
  completed: boolean;
  assignee: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  amount?: string;
}

export interface AppSettings {
  accentIntensity: 'violet' | 'purple' | 'indigo';
  compactTable: boolean;
  reducedMotion: boolean;
  emailWeeklyReport: boolean;
  customerAlertPush: boolean;
  securityLoginAlert: boolean;
  webhookUrl: string;
  currencyFormat: 'IDR' | 'USD';
}
