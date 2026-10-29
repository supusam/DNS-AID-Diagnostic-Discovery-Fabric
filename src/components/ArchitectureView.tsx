/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowDown,
  Shield,
  Layers,
  Key,
  Server,
  Database,
  Cpu,
  Lock,
  Globe,
  Radio,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
          System Blueprints & Protocol Stack
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1">
          Discovery Fabric Architecture & Verification Hierarchy
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
          The DNS-AID Diagnostic Discovery Fabric implements a layered separation of concerns.
          DNSSEC authenticates the wire metadata; schema validators confirm operational parameters;
          a standalone policy engine decides invocation rights; and the destination service validates cryptographic bearer tokens.
        </p>
      </div>

      {/* Main Flow Diagram */}
      <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="max-w-2xl mx-auto space-y-3 font-mono text-xs">
          {/* Step 1: Frontend */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900 text-slate-300">
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">1. Frontend Client Application</div>
                <div className="text-slate-400 text-[11px]">React + TypeScript Observability Dashboard</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
              User Agent
            </span>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>

          {/* Step 2: Discovery API */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900 text-slate-300">
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">2. Discovery Client API Gateway</div>
                <div className="text-slate-400 text-[11px]">Python 3.12 FastAPI / Express Full-Stack Controller</div>
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
              Orchestrator
            </span>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 3: DNS Resolver */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900 text-slate-300">
                <Globe className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">3. DNS Resolver (dnspython / BIND9)</div>
                <div className="text-slate-400 text-[11px]">Queries authoritative zone with EDNS0 DO=1 (DNSSEC OK)</div>
              </div>
            </div>
            <span className="text-[10px] text-indigo-400 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30">
              RFC 1035 / 3226
            </span>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 4: DNSSEC Validation */}
          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-emerald-950 text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-emerald-300 font-bold text-sm">4. DNSSEC Cryptographic Validation</div>
                <div className="text-slate-300 text-[11px]">
                  Validates RRSIG against DNSKEY (Tag: 20301) & trust anchor DS (Tag: 44102)
                </div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 font-bold border border-emerald-500/40">
              INTEGRITY PLANE
            </span>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 5: SVCB / TXT Metadata Extraction */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900 text-slate-300">
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">5. SVCB & TXT Metadata Extraction</div>
                <div className="text-slate-400 text-[11px]">
                  Decodes Priority, TargetName, Port (8081-8083), ALPN, and Path params
                </div>
              </div>
            </div>
            <span className="text-[10px] text-purple-400 px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30">
              RFC 9460
            </span>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 6: Application Metadata Schema Validation */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900 text-slate-300">
                <Radio className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">6. Metadata Schema Validation</div>
                <div className="text-slate-400 text-[11px]">
                  Validates urn:dnsaid:diag:*, port bounds (1-65535), and capability schema
                </div>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30">
              Schema Guard
            </span>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 7: Local Policy Authorization */}
          <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-cyan-950 text-cyan-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-cyan-300 font-bold text-sm">7. Local Policy Authorization</div>
                <div className="text-slate-300 text-[11px]">
                  Decides whether client principal is permitted to invoke the capability
                </div>
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 font-bold border border-cyan-500/40">
              AUTH PLANE
            </span>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 8: JWT Authentication */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900 text-slate-300">
                <Key className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">8. Short-Lived JWT Token Minting</div>
                <div className="text-slate-400 text-[11px]">
                  Signs scoped bearer token with 300s TTL (sub, aud, iss, scope)
                </div>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30">
              RFC 7519
            </span>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 9: Diagnostic Services */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold mb-2">
              9. Authenticated Diagnostic Workloads (Target Microservices)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded bg-slate-900 border border-emerald-500/30">
                <div className="text-white font-bold">Latency Probe</div>
                <div className="text-[10px] text-emerald-400">Port 8081 / RTT Jitter</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-cyan-500/30">
                <div className="text-white font-bold">Route Analyzer</div>
                <div className="text-[10px] text-cyan-400">Port 8082 / Traceroute</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-indigo-500/30">
                <div className="text-white font-bold">Reachability Monitor</div>
                <div className="text-[10px] text-indigo-400">Port 8083 / TLS Health</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
