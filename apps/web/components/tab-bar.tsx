'use client';

import clsx from 'clsx';

export type TabItem = {
  id: string;
  label: string;
};

type TabBarProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
};

export function TabBar({ tabs, activeTab, onChange }: TabBarProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={clsx(
            'rounded-xl px-4 py-2.5 text-sm font-medium transition',
            activeTab === tab.id
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-white/5 hover:text-white',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
