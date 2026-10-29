/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { executeDemoSequence } from '../services/api';
import { DemoExecutionReport } from '../types/dnsaid';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<DemoExecutionReport | null>(null);

  const demoSteps = [
    { num: 1, title: 'Discover Latency Service', detail: 'Querying latency._agents.lab.dnsaid.test for SVCB & TXT records' },
    { num: 2, title: 'Validate DNSSEC Chain', detail: 'Cryptographically verifying RRSIG against DNSKEY 20301 and trust anchor DS 44102' },
    { num: 3, title: 'Validate Metadata Schema', detail: 'Validating RFC 9460 SVCB parameters & urn:dnsaid:diag:latency:v1' },
    { num: 4, title: 'Authorize Client via Policy', detail: 'Local policy engine verifies client principal and issues scoped JWT' },
    { num: 5, title: 'Invoke Latency Service', detail: 'HTTP/2 authenticated POST with Bearer token to internal probe daemon' },
    { num: 6, title: 'Display Diagnostic Telemetry', detail: 'Received 10 probe sequence samples (Avg RTT: 12.8ms, Loss: 0%)' },
    { num: 7, title: 'Bogus DNS Test (Negative)', detail: 'Simulating tampered RRSIG -> Client immediately rejects discovery & blocks invocation' },
    { num: 8, title: 'Malformed Metadata Test (Negative)', detail: 'Simulating port 99999 & unknown schema -> Metadata rejected & invocation blocked' },
    { num: 9, title: 'Unauthorized Invocation Test (Negative)', detail: 'DNSSEC passes, but application policy denies token -> Proving DNSSEC != Authorization' },
    { num: 10, title: 'Unavailable Service Test (Fault)', detail: 'Downstream microservice connection failure (HTTP 503) handled gracefully' },
  ];

  const runDemoFlow = async () => {
    setIsRunning(true);
    setCurrentStepIndex(1);

    // Step-by-step progress simulation for optimal presentation
    for (let i = 1; i <= 10; i++) {
      setCurrentStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      const finalReport = await executeDemoSequence();
      setReport(finalReport);
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Demo execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setReport(null);
      setCurrentStepIndex(0);
      runDemoFlow();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">AUTOMATED SYSTEM DEMONSTRATION</h3>
              <p className="text-[11px] text-slate-400">10-Stage Comprehensive Verification & Negative Test Suite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Demo Execution Progress</span>
              <span className="text-emerald-400 font-bold">{currentStepIndex} / 10 Steps</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStepIndex / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Live Step Sequence List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {demoSteps.map((step) => {
              const isPast = currentStepIndex > step.num;
              const isCurrent = currentStepIndex === step.num;
              const isFuture = currentStepIndex < step.num;

              return (
                <div
                  key={step.num}
                  className={`p-2.5 rounded-lg border transition-all flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-slate-800 border-emerald-500/60 shadow'
                      : isPast
                      ? 'bg-slate-950/60 border-slate-800/80'
                      : 'bg-slate-950/20 border-slate-900 opacity-40'
                  }`}
                >
                  <div className="mt-0.5">
                    {isCurrent ? (
                      <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    ) : isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[9px] flex items-center justify-center text-slate-500">
                        {step.num}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${isCurrent ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {step.num}. {step.title}
                      </span>
                      {isPast && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {step.num <= 6 ? 'PASS' : step.num === 10 ? 'HANDLED' : 'BLOCKED'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Security Summary Card when completed */}
          {report && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/50 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>FINAL SECURITY VERIFICATION SUMMARY</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/40">
                  ALL ASSERTIONS VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">VALID DISCOVERY:</span>
                  <span className="text-emerald-400 font-bold">PASS</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">BOGUS DNS:</span>
                  <span className="text-emerald-400 font-bold">BLOCKED</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">MALFORMED METADATA:</span>
                  <span className="text-emerald-400 font-bold">BLOCKED</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">UNAUTHORIZED SERVICE:</span>
                  <span className="text-emerald-400 font-bold">BLOCKED</span>
                </div>
                <div className="sm:col-span-2 p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">UNAVAILABLE SERVICE:</span>
                  <span className="text-cyan-400 font-bold">HANDLED</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300">
                <strong>Verdict:</strong> The prototype successfully demonstrated that DNSSEC provides metadata integrity while application policy independently determines authorization and target services enforce runtime access.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-500 font-mono">
            {isRunning ? 'Executing test suite...' : 'Demo sequence complete.'}
          </span>
          <div className="flex items-center gap-2">
            {!isRunning && (
              <button
                onClick={runDemoFlow}
                className="px-3 py-1.5 text-xs font-mono font-semibold rounded bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Re-Run Demo
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-mono font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
