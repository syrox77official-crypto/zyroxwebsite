import React from 'react';
import { motion } from 'motion/react';
import { Home, Wrench, Users, Settings } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  customerCount: number;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'home',
    label: 'Home',
    subtitle: 'Dashboard',
    icon: Home,
  },
  {
    id: 'tools',
    label: 'Tools',
    subtitle: 'Peralatan',
    icon: Wrench,
  },
  {
    id: 'customer',
    label: 'Customer',
    subtitle: 'Pelanggan',
    icon: Users,
  },
  {
    id: 'settings',
    label: 'Settings',
    subtitle: 'Pengaturan',
    icon: Settings,
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  customerCount,
}) => {
  return (
    <nav
      aria-label="Navigasi Utama Bawah"
      className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0A0A12]/95 backdrop-blur-xl border-t border-white/[0.08] px-3 sm:px-6 flex items-center justify-center"
    >
      <div className="w-full max-w-2xl grid grid-cols-4 gap-1.5 sm:gap-3 h-12">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative min-h-[44px] rounded-xl flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5 px-2 transition-colors cursor-pointer whitespace-nowrap select-none ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavActiveSurface"
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-xl bg-violet-600/20 border border-violet-500/40 shadow-sm shadow-violet-600/20 -z-10"
                />
              )}

              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4 h-4 sm:w-4 sm:h-4 transition-colors ${
                    isActive ? 'text-violet-400' : 'text-slate-400'
                  }`}
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-semibold tracking-tight">
                  {item.label}
                </span>
                {item.id === 'customer' && (
                  <span className="hidden md:inline font-mono tabular-nums text-[10px] text-slate-400">
                    ({customerCount})
                  </span>
                )}
              </div>

              {isActive && (
                <motion.span
                  layoutId="bottomNavTopDot"
                  className="absolute -top-[5px] w-6 h-0.5 rounded-full bg-violet-400"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
