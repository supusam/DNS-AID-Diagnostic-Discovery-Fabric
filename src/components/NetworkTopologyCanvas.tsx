/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Laptop,
  Server,
  Database,
  Activity,
  Network,
  Layers,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { DiagnosticServiceId } from '../types/dnsaid';

interface TopologyProps {
  onTriggerPacket?: (serviceId: DiagnosticServiceId) => void;
  activePulseService?: DiagnosticServiceId | null;
}

export const NetworkTopologyCanvas: React.FC<TopologyProps> = ({
  onTriggerPacket,
  activePulseService = null,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('client');
  const [pulseActive, setPulseActive] = useState<string | null>(null);

  const triggerAnimation = (target: 'latency' | 'route' | 'reachability') => {
    setPulseActive(target);
    if (onTriggerPacket) onTriggerPacket(target);
    setTimeout(() => {
      setPulseActive(null);
    }, 2400);
  };

  const isPulsing = pulseActive || activePulseService;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
            Spatial Fabric Architecture
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Interactive Network Topology & Wire Packet Flow
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Simulate Packet:</span>
          <button
            onClick={() => triggerAnimation('latency')}
            className="px-2 py-1 text-[11px] font-mono font-semibold rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900 transition-colors"
          >
            Latency Flow
          </button>
          <button
            onClick={() => triggerAnimation('route')}
            className="px-2 py-1 text-[11px] font-mono font-semibold rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-900 transition-colors"
          >
            Route Flow
          </button>
          <button
            onClick={() => triggerAnimation('reachability')}
            className="px-2 py-1 text-[11px] font-mono font-semibold rounded bg-indigo-950 border border-indigo-500/40 text-indigo-400 hover:bg-indigo-900 transition-colors"
          >
            Reachability Flow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Interactive Topology Diagram */}
        <div className="lg:col-span-2 relative h-[380px] bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>

          <svg className="w-full h-full" viewBox="0 0 600 360" fill="none">
            {/* Defs for gradients and markers */}
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Static Connection Lines */}
            {/* Client -> DNSSEC Resolver */}
            <line x1="300" y1="50" x2="300" y2="130" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {/* DNSSEC Resolver -> DNS-AID Zone */}
            <line x1="300" y1="130" x2="300" y2="210" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {/* DNS-AID Zone -> Latency Service */}
            <path d="M 300 210 L 120 290" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {/* DNS-AID Zone -> Route Service */}
            <path d="M 300 210 L 300 290" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {/* DNS-AID Zone -> Reachability Service */}
            <path d="M 300 210 L 480 290" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

            {/* Animated Packet Beacons when Pulsing */}
            {isPulsing && (
              <>
                {/* Pulse from Client to Resolver */}
                <circle cx="300" cy="90" r="4" fill="#34d399">
                  <animate attributeName="cy" values="50;130" dur="0.8s" repeatCount="1" />
                  <animate attributeName="opacity" values="0.2;1;0.2" dur="0.8s" repeatCount="1" />
                </circle>
                {/* Pulse from Resolver to Zone */}
                <circle cx="300" cy="170" r="4" fill="#38bdf8">
                  <animate attributeName="cy" values="130;210" begin="0.7s" dur="0.8s" repeatCount="1" />
                </circle>

                {/* Branch pulses based on target */}
                {(!pulseActive || pulseActive === 'latency') && (
                  <circle cx="210" cy="250" r="4" fill="#10b981">
                    <animate attributeName="cx" values="300;120" begin="1.4s" dur="0.9s" repeatCount="1" />
                    <animate attributeName="cy" values="210;290" begin="1.4s" dur="0.9s" repeatCount="1" />
                  </circle>
                )}

                {(!pulseActive || pulseActive === 'route') && (
                  <circle cx="300" cy="250" r="4" fill="#06b6d4">
                    <animate attributeName="cy" values="210;290" begin="1.4s" dur="0.9s" repeatCount="1" />
                  </circle>
                )}

                {(!pulseActive || pulseActive === 'reachability') && (
                  <circle cx="390" cy="250" r="4" fill="#818cf8">
                    <animate attributeName="cx" values="300;480" begin="1.4s" dur="0.9s" repeatCount="1" />
                    <animate attributeName="cy" values="210;290" begin="1.4s" dur="0.9s" repeatCount="1" />
                  </circle>
                )}
              </>
            )}

            {/* NODE 1: Discovery Client */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('client')}
              transform="translate(210, 20)"
            >
              <rect
                width="180"
                height="44"
                rx="8"
                fill="#0f172a"
                stroke={selectedNode === 'client' ? '#10b981' : '#334155'}
                strokeWidth={selectedNode === 'client' ? '2' : '1'}
              />
              <text x="35" y="22" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Discovery Client
              </text>
              <text x="35" y="36" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                App Policy & JWT
              </text>
              <circle cx="20" cy="22" r="8" fill="#064e3b" />
              <circle cx="20" cy="22" r="4" fill="#34d399" />
            </g>

            {/* NODE 2: DNSSEC Resolver */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('resolver')}
              transform="translate(210, 110)"
            >
              <rect
                width="180"
                height="44"
                rx="8"
                fill="#0f172a"
                stroke={selectedNode === 'resolver' ? '#06b6d4' : '#334155'}
                strokeWidth={selectedNode === 'resolver' ? '2' : '1'}
              />
              <text x="35" y="22" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                DNSSEC Resolver
              </text>
              <text x="35" y="36" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Validates RRSIG / DS
              </text>
              <circle cx="20" cy="22" r="8" fill="#164e63" />
              <circle cx="20" cy="22" r="4" fill="#38bdf8" />
            </g>

            {/* NODE 3: DNS-AID Zone */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('zone')}
              transform="translate(200, 190)"
            >
              <rect
                width="200"
                height="44"
                rx="8"
                fill="#0f172a"
                stroke={selectedNode === 'zone' ? '#a855f7' : '#334155'}
                strokeWidth={selectedNode === 'zone' ? '2' : '1'}
              />
              <text x="35" y="22" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                lab.dnsaid.test
              </text>
              <text x="35" y="36" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                BIND9 Signed Zone (SVCB)
              </text>
              <circle cx="20" cy="22" r="8" fill="#3b0764" />
              <circle cx="20" cy="22" r="4" fill="#c084fc" />
            </g>

            {/* NODE 4: Latency Service */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('latency')}
              transform="translate(40, 270)"
            >
              <rect
                width="155"
                height="50"
                rx="8"
                fill="#0f172a"
                stroke={selectedNode === 'latency' ? '#10b981' : '#334155'}
                strokeWidth={selectedNode === 'latency' ? '2' : '1'}
              />
              <text x="32" y="22" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Latency Probe
              </text>
              <text x="32" y="36" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                Port 8081 / HTTP2+3
              </text>
              <circle cx="18" cy="25" r="7" fill="#064e3b" />
              <circle cx="18" cy="25" r="3" fill="#34d399" />
            </g>

            {/* NODE 5: Route Service */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('route')}
              transform="translate(225, 270)"
            >
              <rect
                width="155"
                height="50"
                rx="8"
                fill="#0f172a"
                stroke={selectedNode === 'route' ? '#06b6d4' : '#334155'}
                strokeWidth={selectedNode === 'route' ? '2' : '1'}
              />
              <text x="32" y="22" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Route Analyzer
              </text>
              <text x="32" y="36" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                Port 8082 / Traceroute
              </text>
              <circle cx="18" cy="25" r="7" fill="#164e63" />
              <circle cx="18" cy="25" r="3" fill="#38bdf8" />
            </g>

            {/* NODE 6: Reachability Service */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('reachability')}
              transform="translate(405, 270)"
            >
              <rect
                width="155"
                height="50"
                rx="8"
                fill="#0f172a"
                stroke={selectedNode === 'reachability' ? '#6366f1' : '#334155'}
                strokeWidth={selectedNode === 'reachability' ? '2' : '1'}
              />
              <text x="32" y="22" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Reachability
              </text>
              <text x="32" y="36" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                Port 8083 / TLS Health
              </text>
              <circle cx="18" cy="25" r="7" fill="#312e81" />
              <circle cx="18" cy="25" r="3" fill="#818cf8" />
            </g>
          </svg>
        </div>

        {/* Node Inspector Sidebar Panel */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2 mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>NODE INSPECTOR</span>
          </div>

          {selectedNode === 'client' && (
            <div className="space-y-2">
              <div className="text-white font-bold">Discovery Client Engine</div>
              <p className="text-[11px] text-slate-400">
                Initiates DNS queries with EDNS0 DO=1, evaluates DNSSEC security state, strictly validates application schema, and authorizes requests via local policy.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                <span className="text-emerald-400">Security Rule:</span> "Never invokes an unverified DNSSEC record."
              </div>
            </div>
          )}

          {selectedNode === 'resolver' && (
            <div className="space-y-2">
              <div className="text-white font-bold">DNSSEC Recursive Resolver</div>
              <p className="text-[11px] text-slate-400">
                Validates cryptographic signatures (RRSIG) on SVCB and TXT records against published DNSKEY and configured root trust anchor DS 44102.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                <span className="text-cyan-400">Validation:</span> "Sets AD=1 flag only when RRset is cryptographically verified."
              </div>
            </div>
          )}

          {selectedNode === 'zone' && (
            <div className="space-y-2">
              <div className="text-white font-bold">DNS-AID Test Zone: lab.dnsaid.test</div>
              <p className="text-[11px] text-slate-400">
                Isolated BIND9 authoritative zone signed with ECDSA P-256 (Algorithm 13). Publishes RFC 9460 SVCB records under the `_agents` prefix.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                <span className="text-purple-400">Zone Prefix:</span> `*. _agents.lab.dnsaid.test`
              </div>
            </div>
          )}

          {selectedNode === 'latency' && (
            <div className="space-y-2">
              <div className="text-white font-bold">Latency Probe Service (8081)</div>
              <p className="text-[11px] text-slate-400">
                FastAPI microservice executing high-precision RTT and jitter diagnostics. Requires JWT with scope `diagnostic:latency`.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                <span className="text-emerald-400">Endpoint:</span> `https://latency-probe.internal:8081`
              </div>
            </div>
          )}

          {selectedNode === 'route' && (
            <div className="space-y-2">
              <div className="text-white font-bold">Route Analyzer Service (8082)</div>
              <p className="text-[11px] text-slate-400">
                Multi-hop autonomous system path tracing and packet route latency profiling. Requires JWT with scope `diagnostic:route`.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                <span className="text-cyan-400">Endpoint:</span> `https://route-analyzer.internal:8082`
              </div>
            </div>
          )}

          {selectedNode === 'reachability' && (
            <div className="space-y-2">
              <div className="text-white font-bold">Reachability Monitor (8083)</div>
              <p className="text-[11px] text-slate-400">
                Endpoint availability, TCP/TLS handshake validation, and MTU threshold probes. Requires JWT with scope `diagnostic:reachability`.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                <span className="text-indigo-400">Endpoint:</span> `https://reachability-monitor.internal:8083`
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
