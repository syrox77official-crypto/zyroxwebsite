/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, ActivityItem } from './types';
import { DEFAULT_USER_PROFILE, INITIAL_ACTIVITIES } from './data/initialData';
import { AuthPage } from './components/AuthPage';
import { TopBar } from './components/TopBar';
import { ProfileModal } from './components/ProfileModal';
import {
  WhatsAppFixDashboard,
  SentEmailLog,
} from './components/WhatsAppFixDashboard';

const STORAGE_KEYS = {
  USER: 'zyroxx_user_v4',
  ACTIVITIES: 'zyroxx_activities_v4',
  SENT_LOGS: 'zyroxx_wa_sent_logs_v4',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [profileModalSection, setProfileModalSection] = useState<
    'overview' | 'edit' | 'security'
  >('overview');

  const [user, setUser] = useState<UserProfile>(() =>
    loadFromStorage(STORAGE_KEYS.USER, DEFAULT_USER_PROFILE)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );
  const [sentLogs, setSentLogs] = useState<SentEmailLog[]>(() =>
    loadFromStorage(STORAGE_KEYS.SENT_LOGS, [])
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // Ignore storage quota errors
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {
      // Ignore storage quota errors
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SENT_LOGS, JSON.stringify(sentLogs));
    } catch {
      // Ignore storage quota errors
    }
  }, [sentLogs]);

  const logActivity = (action: string, target: string, amount?: string) => {
    const newItem: ActivityItem = {
      id: `ACT-${Date.now()}`,
      action,
      target,
      timestamp: 'Baru saja',
      amount,
    };
    setActivities((prev) => [newItem, ...prev.slice(0, 14)]);
  };

  const handleSuccessAuth = (profileOverride?: Partial<UserProfile>) => {
    if (profileOverride) {
      setUser((prev) => ({
        ...prev,
        ...profileOverride,
      }));
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsProfileModalOpen(false);
    setIsAuthenticated(false);
  };

  const handleOpenFullProfile = (
    section: 'overview' | 'edit' | 'security' = 'overview'
  ) => {
    setProfileModalSection(section);
    setIsProfileModalOpen(true);
  };

  const handleAddSentLog = (log: SentEmailLog) => {
    setSentLogs((prev) => [log, ...prev]);
    logActivity(
      `Menyelesaikan ${log.issueType} untuk nomor`,
      log.phoneNumber,
      `Ref: ${log.gmailMessageId}`
    );
  };

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key="auth-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <AuthPage onSuccessAuth={handleSuccessAuth} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard-screen"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen w-full bg-[#07070B] text-slate-100 flex flex-col relative pb-12 overflow-x-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[780px] h-[280px] rounded-full bg-violet-700/10 blur-[140px] z-0"
          />

          <TopBar
            user={user}
            onOpenFullProfile={handleOpenFullProfile}
            onLogout={handleLogout}
          />

          <ProfileModal
            isOpen={isProfileModalOpen}
            initialSection={profileModalSection}
            onClose={() => setIsProfileModalOpen(false)}
            user={user}
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
              logActivity('Memperbarui biodata profil akun:', updatedUser.fullName);
            }}
            activities={activities}
            customerCount={sentLogs.length}
            completedTasksCount={sentLogs.length}
            onLogout={handleLogout}
          />

          <main className="relative z-10 flex-1 w-full max-w-[1160px] mx-auto px-3 sm:px-6 lg:px-8 pt-5 pb-8">
            <WhatsAppFixDashboard
              sentLogs={sentLogs}
              onAddSentLog={handleAddSentLog}
            />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
