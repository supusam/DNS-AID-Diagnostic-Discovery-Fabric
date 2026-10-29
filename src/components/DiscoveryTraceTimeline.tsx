/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  Layers,
  KeyRound,
  Send,
  Cpu,
  ChevronDown,
} from 'lucide-react';
import { TraceStep } from '../types/dnsaid';

interface DiscoveryTraceProps {
  steps: TraceStep[];
  activeServiceName?: string;
}

export const DiscoveryTraceTimeline: React.FC<DiscoveryTraceProps> = ({
  steps,
  activeServiceName = 'latency-probe',
}) => {
  const [expandedStep, setExpandedStep] = React.useState<string | null>(null);

  // Default timeline template if no dynamic steps passed yet
  const defaultSteps: TraceStep[] = [
    {
      id: 'step-1',
      stepNumber: 1,
      name: 'Query SVCB & TXT Records',
      status: 'SUCCESS',
      timestamp: '12:04:31.102',
      summary: 'Client queries BIND9 resolver for latency._agents.lab.dnsaid.test with DO=1 bit set',
      durationMs: 4,
      technicalDetails: { qname: 'latency._agents.lab.dnsaid.test', qtype: 'SVCB (64)', edns0: 'DO=1, bufsize=4096' },
    },
    {
      id: 'step-2',
      stepNumber: 2,
      name: 'Receive DNS Wire Response',
      status: 'SUCCESS',
      timestamp: '12:04:31.107',
      summary: 'DNS response received containing SVCB RRset, TXT RRset, and cryptographic RRSIG records',
      durationMs: 5,
      technicalDetails: { rcode: 'NOERROR', ancount: 3, nscount: 1, arcount: 1 },
    },
    {
      id: 'step-3',
      stepNumber: 3,
      name: 'Validate DNSSEC Chain of Trust',
      status: 'SUCCESS',
      timestamp: '12:04:31.116',
      summary: 'Verified trust chain from root trust anchor DS 44102 to Zone Signing Key (KeyTag: 20301)',
      durationMs: 9,
      technicalDetails: { trustAnchor: 'DS 44102 (SHA-256)', kskKeyTag: 44102, zskKeyTag: 20301, chainMatch: true },
    },
    {
      id: 'step-4',
      stepNumber: 4,
      name: 'Verify RRSIG Cryptographic Signature',
      status: 'SUCCESS',
      timestamp: '12:04:31.122',
      summary: 'Computed SHA-256 digest over SVCB canonical wire format and verified ECDSA P-256 signature',
      durationMs: 6,
      technicalDetails: { algorithm: '13 (ECDSA P-256)', rrsigStatus: 'CRYPTOGRAPHICALLY_VALID', adFlag: true },
    },
    {
      id: 'step-5',
      stepNumber: 5,
      name: 'Parse Dynamic Endpoint Metadata',
      status: 'SUCCESS',
      timestamp: '12:04:31.125',
      summary: 'Extracted SVCB priority 1, port 8081, ALPN [h2, h3], and relative path /v1/diagnostic/latency',
      durationMs: 3,
      technicalDetails: { target: 'latency-probe.internal.lab.dnsaid.test', port: 8081, alpn: ['h2', 'h3'] },
    },
    {
      id: 'step-6',
      stepNumber: 6,
      name: 'Validate Application Metadata Schema',
      status: 'SUCCESS',
      timestamp: '12:04:31.128',
      summary: 'Verified schema conforms to urn:dnsaid:diag:latency:v1 and valid port range 1-65535',
      durationMs: 3,
      technicalDetails: { schema: 'urn:dnsaid:diag:latency:v1', capability: 'network-latency', schemaValid: true },
    },
    {
      id: 'step-7',
      stepNumber: 7,
      name: 'Check Local Authorization Policy',
      status: 'SUCCESS',
      timestamp: '12:04:31.134',
      summary: 'Independent policy engine verified client principal ops-agent-01 is authorized for diagnostic:latency',
      durationMs: 6,
      technicalDetails: { principal: 'ops-agent-01', requiredScope: 'diagnostic:latency', policyDecision: 'PERMIT' },
    },
    {
      id: 'step-8',
      stepNumber: 8,
      name: 'Generate Authentication Token (JWT)',
      status: 'SUCCESS',
      timestamp: '12:04:31.139',
      summary: 'Issued short-lived JWT bearer token (exp: +300s, aud: urn:dnsaid:service:latency)',
      durationMs: 5,
      technicalDetails: { alg: 'HS256', expSeconds: 300, iss: 'https://auth.lab.dnsaid.test' },
    },
    {
      id: 'step-9',
      stepNumber: 9,
      name: 'Invoke Diagnostic Service Endpoint',
      status: 'SUCCESS',
      timestamp: '12:04:31.155',
      summary: 'Transmitted HTTP/2 POST with Authorization: Bearer <token> to target daemon',
      durationMs: 16,
      technicalDetails: { httpMethod: 'POST', endpoint: 'https://latency-probe.internal.lab.dnsaid.test:8081/v1/diagnostic/latency' },
    },
    {
      id: 'step-10',
      stepNumber: 10,
      name: 'Receive & Validate Diagnostic Response',
      status: 'SUCCESS',
      timestamp: '12:04:31.171',
      summary: 'Service verified JWT token, executed synthetic probe sequence, and returned 10 samples (Avg: 12.8ms)',
      durationMs: 16,
      technicalDetails: { httpStatus: 200, telemetryType: 'LatencyTelemetry', packetLoss: '0.0%' },
    },
  ];

  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
            Deterministic Pipeline Execution
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Discovery & Invocation Trace Timeline
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Target: <span className="text-slate-200 font-semibold">{activeServiceName}</span>
        </div>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {displaySteps.map((step, idx) => {
          const isExpanded = expandedStep === step.id;
          const isSuccess = step.status === 'SUCCESS';
          const isFailed = step.status === 'FAILED';
          const isBlocked = step.status === 'BLOCKED';

          return (
            <div key={step.id || idx} className="relative group">
              {/* Timeline marker */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                  isSuccess
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : isFailed
                    ? 'bg-red-950 border-red-500 text-red-400'
                    : isBlocked
                    ? 'bg-amber-950 border-amber-500 text-amber-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {step.stepNumber}
              </div>

              {/* Step Card */}
              <div
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isFailed
                    ? 'bg-red-950/20 border-red-500/40'
                    : isBlocked
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">
                      {step.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        isSuccess
                          ? 'text-emerald-400 bg-emerald-950/60'
                          : isFailed
                          ? 'text-red-400 bg-red-950/60'
                          : isBlocked
                          ? 'text-amber-400 bg-amber-950/60'
                          : 'text-slate-400 bg-slate-900'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span>{step.durationMs}ms</span>
                    <span>·</span>
                    <span>{step.timestamp}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {step.summary}
                </p>

                {/* Expandable technical details */}
                {isExpanded && step.technicalDetails && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] font-mono bg-slate-900/90 p-2.5 rounded text-slate-300">
                    <div className="text-[10px] uppercase text-slate-400 mb-1">Technical Wire Details:</div>
                    <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(step.technicalDetails, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
