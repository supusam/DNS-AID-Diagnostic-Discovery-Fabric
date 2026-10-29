/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, KeyRound, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SecurityStatusProps {
  dnssecStatus?: string;
  authStatus?: string;
}

export const SecurityStatusPanels: React.FC<SecurityStatusProps> = ({
  dnssecStatus = 'VALID',
  authStatus = 'AUTHORIZED',
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Panel 1: METADATA INTEGRITY */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            <span>Plane 1</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            METADATA INTEGRITY
          </h4>
          <div className="mt-3 flex items-center gap-2 font-mono">
            <span className="text-xs text-slate-400">DNSSEC:</span>
            <span className="text-sm font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              {dnssecStatus}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase mb-0.5">Cryptographic Meaning:</div>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "The DNS response cryptographically validates against the configured trust chain."
          </p>
          <div className="mt-2 text-[11px] text-slate-400">
            Guarantees: Non-repudiation of zone origin and wire tamper detection via RRSIG.
          </div>
        </div>
      </div>

      {/* Panel 2: SERVICE AUTHORIZATION */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            <span>Plane 2</span>
            <KeyRound className="w-4 h-4 text-cyan-400" />
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            SERVICE AUTHORIZATION
          </h4>
          <div className="mt-3 flex items-center gap-2 font-mono">
            <span className="text-xs text-slate-400">Policy:</span>
            <span className="text-sm font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              {authStatus}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase mb-0.5">Authorization Meaning:</div>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "Local application policy permits invocation."
          </p>
          <div className="mt-2 text-[11px] text-slate-400">
            Guarantees: Principle of least privilege enforced via short-lived scoped JWT.
          </div>
        </div>
      </div>

      {/* Panel 3: SERVICE TRUST */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            <span>Plane 3</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            SERVICE TRUST
          </h4>
          <div className="mt-3 flex items-center gap-2 font-mono">
            <span className="text-xs text-slate-400">Policy:</span>
            <span className="text-sm font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">
              SEPARATE DECISION
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase mb-0.5">Operational Meaning:</div>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "DNSSEC does not establish service trustworthiness."
          </p>
          <div className="mt-2 text-[11px] text-slate-400">
            A maliciously signed zone can be 100% DNSSEC-valid while hosting an adversarial or rogue probe.
          </div>
        </div>
      </div>
    </div>
  );
};
