/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Shield, KeyRound, HeartHandshake, AlertTriangle } from 'lucide-react';

export const SecurityPrincipleBanner: React.FC = () => {
  return (
    <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
              <span>Cloud Computing & IoT Hackathon Prototype</span>
              <span>·</span>
              <span>PS-033: Diagnostic Discovery</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1">
              DNS-AID DIAGNOSTIC DISCOVERY FABRIC
            </h1>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              DNSSEC-validated discovery · Policy authorization · Authenticated invocation
            </p>
          </div>

          {/* 4-Step Pipeline Indicator */}
          <div className="flex items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-950/50 rounded">DISCOVER</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-cyan-400 font-bold px-1.5 py-0.5 bg-cyan-950/50 rounded">VALIDATE</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-amber-400 font-bold px-1.5 py-0.5 bg-amber-950/50 rounded">AUTHORIZE</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-indigo-400 font-bold px-1.5 py-0.5 bg-indigo-950/50 rounded">INVOKE</span>
          </div>
        </div>

        {/* Primary Security Principle - Most Visually Important Statement */}
        <div className="mt-4 p-4 rounded-lg bg-amber-950/20 border border-amber-500/40">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Core Security Principle & Verification Boundary
              </div>
              <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                "DNS discovery provides metadata integrity — not invocation authorization or service trust."
              </p>
              <p className="text-xs text-slate-300 mt-1">
                DNSSEC cryptographically verifies that published records have not been forged or tampered with in transit.
                However, <strong className="text-amber-200">DNS discovery does not authorize invocation and does not prove service trustworthiness</strong>.
                Invocation requires separate application-level policy authorization and short-lived credentials.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Clear Verification Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>1. METADATA INTEGRITY</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Cryptographically established by <strong>DNSSEC</strong> (RRSIG + DNSKEY + DS chain of trust). Proves record authenticity.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400">
              <KeyRound className="w-3.5 h-3.5" />
              <span>2. SERVICE AUTHORIZATION</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Decided by <strong>Application Policy</strong> and enforced via short-lived JWT bearer tokens with specific role scopes.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>3. SERVICE TRUSTWORTHINESS</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              An independent operational decision. Valid DNSSEC does <strong>not</strong> make an untrusted third party trustworthy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
