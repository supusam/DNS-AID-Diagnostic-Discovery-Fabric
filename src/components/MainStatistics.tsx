/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Server, Radio, Cpu, Lock } from 'lucide-react';

interface MainStatsProps {
  discoveredCount: number;
  availableCount: number;
  dnssecStatus: string;
  testZone: string;
}

export const MainStatistics: React.FC<MainStatsProps> = ({
  discoveredCount,
  availableCount,
  dnssecStatus,
  testZone,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {/* 1. DNSSEC Status */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold font-mono">DNSSEC</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono tracking-tight text-emerald-400">
          {dnssecStatus}
        </div>
        <div className="text-[11px] text-slate-400 truncate mt-0.5">
          {testZone}
        </div>
      </div>

      {/* 2. Discovered Services */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold font-mono">Discovered</span>
          <Server className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-xl font-bold font-mono tracking-tight text-white tabular-nums">
          {discoveredCount}
        </div>
        <div className="text-[11px] text-slate-400 truncate mt-0.5">
          SVCB & TXT records active
        </div>
      </div>

      {/* 3. Available Services */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold font-mono">Available</span>
          <Radio className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
          {availableCount}
        </div>
        <div className="text-[11px] text-slate-400 truncate mt-0.5">
          Ready for invocation
        </div>
      </div>

      {/* 4. Discovery Mode */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold font-mono">Mode</span>
          <Cpu className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-base sm:text-lg font-bold font-mono tracking-tight text-indigo-300">
          SVCB + DNS-SD
        </div>
        <div className="text-[11px] text-slate-400 truncate mt-0.5">
          RFC 9460 / Draft-AID
        </div>
      </div>

      {/* 5. Authorization Mode */}
      <div className="col-span-2 md:col-span-1 p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold font-mono">Auth Policy</span>
          <Lock className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-base sm:text-lg font-bold font-mono tracking-tight text-amber-300">
          JWT / POLICY
        </div>
        <div className="text-[11px] text-slate-400 truncate mt-0.5">
          Independent App Guard
        </div>
      </div>
    </div>
  );
};
