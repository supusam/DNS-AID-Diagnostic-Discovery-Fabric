/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Play } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onStartDemo: () => void;
  systemStatus: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onStartDemo,
  systemStatus,
}) => {
  const navItems = [
    { id: 'discovery', label: 'Services' },
    { id: 'security-lab', label: 'Security Lab' },
    { id: 'topology', label: 'Topology' },
    { id: 'dns-inspector', label: 'DNS Inspector' },
    { id: 'audit-log', label: 'Audit Log' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'report', label: 'Technical Report' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                DNS-AID FABRIC
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono tracking-wider">
                PS-033
              </span>
            </div>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors whitespace-nowrap py-1 ${
                    isActive
                      ? 'text-emerald-400 border-b-2 border-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border border-slate-800 bg-slate-900 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{systemStatus}</span>
            </div>
            <button
              onClick={onStartDemo}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors shadow-sm shadow-emerald-500/20 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START DEMO</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-xs px-2.5 py-1 rounded font-medium whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
