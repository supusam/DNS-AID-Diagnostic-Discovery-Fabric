/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Activity,
  Layers,
  Network,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  DiagnosticServiceId,
  LatencyTelemetry,
  RouteTelemetry,
  ReachabilityTelemetry,
} from '../types/dnsaid';

interface TelemetryVisualizerProps {
  serviceId: DiagnosticServiceId;
  data: any;
}

export const TelemetryVisualizer: React.FC<TelemetryVisualizerProps> = ({ serviceId, data }) => {
  if (!data) return null;

  if (serviceId === 'latency') {
    const latData = data as LatencyTelemetry;
    return (
      <div className="mt-4 p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Activity className="w-4 h-4" />
            <span>LATENCY TELEMETRY STREAM</span>
          </div>
          <span className="text-slate-400">Target: {latData.targetHost}</span>
        </div>

        {/* Metric Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">AVG RTT</span>
            <span className="text-base font-bold text-white tabular-nums">{latData.rttAvgMs} ms</span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">MIN / MAX</span>
            <span className="text-sm font-semibold text-slate-200 tabular-nums">
              {latData.rttMinMs} / {latData.rttMaxMs} ms
            </span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">JITTER</span>
            <span className="text-sm font-semibold text-cyan-300 tabular-nums">±{latData.jitterMs} ms</span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">PACKET LOSS</span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">
              {latData.packetLossPercent.toFixed(1)}% ({latData.packetsReceived}/{latData.packetsSent})
            </span>
          </div>
        </div>

        {/* Recharts Latency Sequence Chart */}
        <div className="h-28 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latData.samples} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="seq" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                labelFormatter={(v) => `Probe #${v}`}
                formatter={(val: any) => [`${val} ms`, 'RTT']}
              />
              <Line type="monotone" dataKey="rtt" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (serviceId === 'route') {
    const routeData = data as RouteTelemetry;
    return (
      <div className="mt-4 p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Network className="w-4 h-4" />
            <span>ROUTE TRACEROUTE TOPOLOGY ({routeData.hopCount} HOPS)</span>
          </div>
          <span className="text-emerald-400 font-semibold">{routeData.routeStatus}</span>
        </div>

        {/* Hop Delay Chart */}
        <div className="h-24 w-full mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routeData.routePath} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="hop" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                labelFormatter={(hop) => `Hop ${hop}`}
                formatter={(val: any) => [`${val} ms`, 'Latency']}
              />
              <Bar dataKey="rttMs" radius={[3, 3, 0, 0]}>
                {routeData.routePath.map((entry, idx) => (
                  <Cell key={idx} fill={idx === routeData.routePath.length - 1 ? '#38bdf8' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hop List Table */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {routeData.routePath.map((hop) => (
            <div
              key={hop.hop}
              className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800/60 text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 text-slate-500 font-bold">#{hop.hop}</span>
                <span className="text-slate-200 font-mono font-medium">{hop.ip}</span>
                <span className="text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">{hop.hostname}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 text-[10px] hidden sm:inline">{hop.asNumber}</span>
                <span className="text-cyan-400 font-bold tabular-nums">{hop.rttMs} ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (serviceId === 'reachability') {
    const reachData = data as ReachabilityTelemetry;
    return (
      <div className="mt-4 p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Layers className="w-4 h-4" />
            <span>ENDPOINT REACHABILITY AUDIT</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>STATUS 200 OK</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">AVAILABILITY</span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">
              {reachData.availabilityPercent.toFixed(1)}%
            </span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">RESPONSE TIME</span>
            <span className="text-base font-bold text-white tabular-nums">{reachData.responseTimeMs} ms</span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">PROBE MTU</span>
            <span className="text-sm font-semibold text-slate-200 tabular-nums">{reachData.mtuProbeBytes} bytes</span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">CERTIFICATE</span>
            <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3 inline" /> VALID
            </span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
          <div className="text-slate-400 text-[10px]">TLS SUITE & HANDSHAKE</div>
          <div className="text-slate-200">{reachData.tlsVersion}</div>
          <div className="text-slate-400 mt-1">{reachData.statusText}</div>
        </div>
      </div>
    );
  }

  return null;
};
