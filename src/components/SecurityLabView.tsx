/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  FileCode,
  Lock,
  WifiOff,
} from 'lucide-react';
import { ScenarioResult } from '../types/dnsaid';
import { runScenario } from '../services/api';

export const SecurityLabView: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('valid');
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [scenarioResults, setScenarioResults] = useState<Record<string, ScenarioResult>>({});
  const [activeResult, setActiveResult] = useState<ScenarioResult | null>(null);

  const scenariosList = [
    {
      id: 'valid',
      title: '1. Valid Discovery & Invocation',
      expectedOutcome: 'SUCCESS',
      description: 'End-to-end nominal flow: DNSSEC validates, metadata conforms to schema, policy authorizes, service responds.',
      color: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'bogus_dns',
      title: '2. Bogus DNS Data (Tampered Record)',
      expectedOutcome: 'REJECT',
      description: 'Simulates forged DNS records or corrupted RRSIG. Client rejects discovery immediately and blocks invocation.',
      color: 'border-red-500/40 text-red-400',
    },
    {
      id: 'malformed_metadata',
      title: '3. Malformed Application Metadata',
      expectedOutcome: 'REJECT',
      description: 'DNSSEC validates, proving DNS non-tampering, but schema validation fails on invalid port (99999) and schema URN.',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      id: 'unavailable',
      title: '4. Service Unavailable (Downstream Error)',
      expectedOutcome: 'ERROR',
      description: 'DNSSEC, metadata, and auth pass, but target daemon returns HTTP 503 / connection refused. Handled safely.',
      color: 'border-orange-500/40 text-orange-400',
    },
    {
      id: 'unauthorized',
      title: '5. Invalid Authorization (Policy Block)',
      expectedOutcome: 'BLOCK',
      description: 'Crucial test: DNSSEC passes, but application policy denies token. Proves DNS discovery is NOT authorization.',
      color: 'border-purple-500/40 text-purple-400',
    },
  ];

  const handleRunScenario = async (id: string) => {
    setRunningScenario(id);
    setActiveScenarioId(id);
    try {
      const res = await runScenario(id);
      setScenarioResults((prev) => ({ ...prev, [id]: res }));
      setActiveResult(res);
    } catch (err: any) {
      console.error('Failed to run scenario:', err);
    } finally {
      setRunningScenario(null);
    }
  };

  const currentResult = scenarioResults[activeScenarioId] || activeResult;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
          <ShieldAlert className="w-4 h-4" />
          <span>Falsification & Adversarial Validation</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1">
          Security & Failure Lab
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          The core thesis of PS-033 is that discovery, integrity, and authorization occupy separate trust domains.
          These 5 live scenarios execute negative testing to verify fail-closed invariants and boundary isolation.
        </p>
      </div>

      {/* Negative Test Matrix Visual Table */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              Verification Truth Table
            </div>
            <h3 className="text-base font-bold text-white">Negative Test Matrix</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">RFC 4033 / RFC 9460 Boundary Proof</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Scenario</th>
                <th className="py-2.5 px-3">DNSSEC</th>
                <th className="py-2.5 px-3">Metadata</th>
                <th className="py-2.5 px-3">Authorization</th>
                <th className="py-2.5 px-3">Availability</th>
                <th className="py-2.5 px-3">Expected Result</th>
                <th className="py-2.5 px-3 text-right">Execute</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">1. Valid Discovery</td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-500/40">SUCCESS</span></td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleRunScenario('valid')}
                    disabled={runningScenario !== null}
                    className="px-2.5 py-1 text-[11px] rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    Run
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">2. Bogus DNS Data</td>
                <td className="py-3 px-3"><span className="text-red-400 font-bold">FAIL</span></td>
                <td className="py-3 px-3"><span className="text-slate-400">UNKNOWN</span></td>
                <td className="py-3 px-3"><span className="text-amber-400 font-bold">BLOCKED</span></td>
                <td className="py-3 px-3"><span className="text-slate-400">UNKNOWN</span></td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 font-bold border border-red-500/40">REJECT</span></td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleRunScenario('bogus_dns')}
                    disabled={runningScenario !== null}
                    className="px-2.5 py-1 text-[11px] rounded bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    Run
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">3. Malformed Metadata</td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-red-400 font-bold">FAIL</span></td>
                <td className="py-3 px-3"><span className="text-amber-400 font-bold">BLOCKED</span></td>
                <td className="py-3 px-3"><span className="text-slate-400">UNKNOWN</span></td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 font-bold border border-amber-500/40">REJECT</span></td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleRunScenario('malformed_metadata')}
                    disabled={runningScenario !== null}
                    className="px-2.5 py-1 text-[11px] rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    Run
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">4. Service Unavailable</td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-red-400 font-bold">FAIL</span></td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-orange-950/60 text-orange-400 font-bold border border-orange-500/40">ERROR</span></td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleRunScenario('unavailable')}
                    disabled={runningScenario !== null}
                    className="px-2.5 py-1 text-[11px] rounded bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    Run
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">5. Invalid Authorization</td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">PASS</span></td>
                <td className="py-3 px-3"><span className="text-red-400 font-bold">FAIL</span></td>
                <td className="py-3 px-3"><span className="text-slate-400">UNKNOWN</span></td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 font-bold border border-purple-500/40">BLOCK</span></td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleRunScenario('unauthorized')}
                    disabled={runningScenario !== null}
                    className="px-2.5 py-1 text-[11px] rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    Run
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Scenario Runner & Diagnostics View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selector Column */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Select Test Scenario</h3>
          {scenariosList.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            const isRunning = runningScenario === sc.id;

            return (
              <div
                key={sc.id}
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  if (scenarioResults[sc.id]) setActiveResult(scenarioResults[sc.id]);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white font-mono">{sc.title}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${sc.color}`}>
                    {sc.expectedOutcome}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {sc.description}
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunScenario(sc.id);
                    }}
                    disabled={runningScenario !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
                  >
                    {isRunning ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isRunning ? 'Executing...' : 'Run Scenario'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-Time Scenario Diagnostic Output */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <FileCode className="w-4 h-4" />
              <span>SCENARIO EXECUTION INSPECTOR</span>
            </div>
            {currentResult && (
              <span
                className={`text-xs px-2.5 py-1 rounded font-bold border ${
                  currentResult.outcome === 'SUCCESS'
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                    : currentResult.outcome === 'REJECT'
                    ? 'bg-red-950/60 border-red-500/40 text-red-400'
                    : currentResult.outcome === 'BLOCK'
                    ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                    : 'bg-orange-950/60 border-orange-500/40 text-orange-400'
                }`}
              >
                OUTCOME: {currentResult.outcome}
              </span>
            )}
          </div>

          {currentResult ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{currentResult.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentResult.description}</p>
              </div>

              {/* Status Verification Matrix Strip */}
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">DNSSEC</div>
                  <div className={`font-bold ${currentResult.dnssecStatus === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {currentResult.dnssecStatus}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">METADATA</div>
                  <div className={`font-bold ${currentResult.metadataStatus === 'PASS' ? 'text-emerald-400' : currentResult.metadataStatus === 'FAIL' ? 'text-red-400' : 'text-slate-400'}`}>
                    {currentResult.metadataStatus}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">AUTH POLICY</div>
                  <div className={`font-bold ${currentResult.authStatus === 'PASS' ? 'text-emerald-400' : currentResult.authStatus === 'FAIL' ? 'text-red-400' : 'text-amber-400'}`}>
                    {currentResult.authStatus}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">AVAILABILITY</div>
                  <div className={`font-bold ${currentResult.availabilityStatus === 'PASS' ? 'text-emerald-400' : currentResult.availabilityStatus === 'FAIL' ? 'text-red-400' : 'text-slate-400'}`}>
                    {currentResult.availabilityStatus}
                  </div>
                </div>
              </div>

              {/* Explicit Explanation Banner */}
              <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800">
                <div className="text-[10px] uppercase text-emerald-400 font-bold mb-1">Formal Explanation:</div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {currentResult.explanation}
                </p>
              </div>

              {/* Technical Wire Logs */}
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-1.5">Execution Log Stream:</div>
                <div className="p-3 rounded-lg bg-black/90 border border-slate-800/90 text-[11px] text-slate-300 space-y-1 font-mono max-h-52 overflow-y-auto">
                  {currentResult.technicalLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.includes('CRITICAL') || log.includes('failed') || log.includes('Error')
                          ? 'text-red-400'
                          : log.includes('ACCESS DENIED') || log.includes('blocked')
                          ? 'text-amber-400'
                          : log.includes('PASS') || log.includes('verified')
                          ? 'text-emerald-300'
                          : 'text-slate-400'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p>Select any scenario on the left or click "Run" in the table above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
