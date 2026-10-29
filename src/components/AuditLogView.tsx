/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { History, Trash2, Filter } from 'lucide-react';
import { AuditLogEntry } from '../types/dnsaid';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onClearLogs: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, onClearLogs }) => {
  const [filterOp, setFilterOp] = React.useState<string>('ALL');

  const filteredLogs = filterOp === 'ALL' ? logs : logs.filter((l) => l.operation === filterOp);

  const getDnssecBadge = (val: string) => {
    if (val === 'VALID') return <span className="text-emerald-400 font-bold">VALID</span>;
    if (val === 'BOGUS') return <span className="text-red-400 font-bold">BOGUS</span>;
    return <span className="text-slate-500">{val}</span>;
  };

  const getMetadataBadge = (val: string) => {
    if (val === 'VALID') return <span className="text-emerald-400 font-bold">VALID</span>;
    if (val === 'REJECTED' || val === 'MALFORMED') return <span className="text-red-400 font-bold">{val}</span>;
    return <span className="text-slate-500">{val}</span>;
  };

  const getAuthBadge = (val: string) => {
    if (val === 'AUTHORIZED' || val === 'READY') return <span className="text-cyan-400 font-bold">{val}</span>;
    if (val === 'DENIED' || val === 'BLOCKED') return <span className="text-amber-400 font-bold">{val}</span>;
    return <span className="text-slate-500">{val}</span>;
  };

  const getInvocationBadge = (val: string) => {
    if (val === 'SUCCESS') return <span className="text-emerald-400 font-bold">SUCCESS</span>;
    if (val === 'BLOCKED') return <span className="text-amber-400 font-bold">BLOCKED</span>;
    if (val === 'ERROR') return <span className="text-orange-400 font-bold">ERROR</span>;
    return <span className="text-slate-500">{val}</span>;
  };

  const getResultBadge = (val: string) => {
    if (val === 'SUCCESS') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
          SUCCESS
        </span>
      );
    }
    if (val === 'SECURITY FAILURE') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-500/40">
          SECURITY FAILURE
        </span>
      );
    }
    if (val === 'BLOCKED') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/60 text-purple-300 border border-purple-500/40">
          BLOCKED
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950/60 text-orange-400 border border-orange-500/40">
        NETWORK ERROR
      </span>
    );
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4" />
            <span>Immutable Telemetry Stream</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Real-Time Security & Operation Audit Log
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
            {['ALL', 'DISCOVERY', 'AUTHORIZE', 'INVOCATION', 'SCENARIO_RUN'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterOp(f)}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  filterOp === f ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Operation</th>
              <th className="py-2.5 px-3">Service</th>
              <th className="py-2.5 px-3">DNSSEC</th>
              <th className="py-2.5 px-3">Metadata</th>
              <th className="py-2.5 px-3">Authorization</th>
              <th className="py-2.5 px-3">Invocation</th>
              <th className="py-2.5 px-3 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 text-slate-400 tabular-nums">{log.timestamp}</td>
                <td className="py-3 px-3 text-white font-bold">{log.operation}</td>
                <td className="py-3 px-3 text-slate-200 font-semibold">{log.service}</td>
                <td className="py-3 px-3">{getDnssecBadge(log.dnssec)}</td>
                <td className="py-3 px-3">{getMetadataBadge(log.metadata)}</td>
                <td className="py-3 px-3">{getAuthBadge(log.authorization)}</td>
                <td className="py-3 px-3">{getInvocationBadge(log.invocation)}</td>
                <td className="py-3 px-3 text-right">{getResultBadge(log.result)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
