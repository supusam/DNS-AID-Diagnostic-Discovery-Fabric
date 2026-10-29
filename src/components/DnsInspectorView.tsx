/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Key,
  ShieldCheck,
  FileText,
  Binary,
  Layers,
  CheckCircle,
  Copy,
  Terminal,
} from 'lucide-react';
import { fetchDnsInspector } from '../services/api';

export const DnsInspectorView: React.FC = () => {
  const [qname, setQname] = useState('latency._agents.lab.dnsaid.test');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadData = async (queryName: string) => {
    setIsLoading(true);
    try {
      const res = await fetchDnsInspector(queryName);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(qname);
  }, []);

  const handleCopyZone = () => {
    if (data?.zoneFileSnippet) {
      navigator.clipboard.writeText(data.zoneFileSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Query Bar */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              DNS Wire & Cryptographic Audit
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Technical DNS Inspector</h2>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            CRYPTOGRAPHICALLY VALIDATED
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={qname}
              onChange={(e) => setQname(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              placeholder="Query FQDN (e.g. latency._agents.lab.dnsaid.test)"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setQname('latency._agents.lab.dnsaid.test');
                loadData('latency._agents.lab.dnsaid.test');
              }}
              className="px-2.5 py-2 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Latency
            </button>
            <button
              onClick={() => {
                setQname('route._agents.lab.dnsaid.test');
                loadData('route._agents.lab.dnsaid.test');
              }}
              className="px-2.5 py-2 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Route
            </button>
            <button
              onClick={() => {
                setQname('reachability._agents.lab.dnsaid.test');
                loadData('reachability._agents.lab.dnsaid.test');
              }}
              className="px-2.5 py-2 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Reachability
            </button>
            <button
              onClick={() => loadData(qname)}
              className="px-4 py-2 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Inspect
            </button>
          </div>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wire Header & Flags */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2 mb-3">
              <Binary className="w-4 h-4" />
              <span>DNS MESSAGE HEADER & FLAGS (RFC 1035 / RFC 4035)</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Query Name:</span>
                <span className="text-white font-bold select-all">{data.query.name}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Record Type & Class:</span>
                <span className="text-cyan-300 font-bold">{data.query.type} IN</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Time-To-Live (TTL):</span>
                <span className="text-white tabular-nums">{data.query.ttl} seconds</span>
              </div>

              {/* Flags Grid */}
              <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] uppercase text-slate-400 mb-2">Decoded Wire Flags:</div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">QR (Response)</div>
                    <div className="font-bold text-white">{data.flags.qr}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">AA (Auth)</div>
                    <div className="font-bold text-white">{data.flags.aa}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">RD / RA</div>
                    <div className="font-bold text-white">{data.flags.rd}/{data.flags.ra}</div>
                  </div>
                  <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                    <div className="text-emerald-400 text-[10px] font-bold">AD (DNSSEC)</div>
                    <div className="font-bold text-emerald-400">{data.flags.ad}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SVCB Parameters */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>SVCB RECORD PARAMETERS (RFC 9460)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">SvcPriority:</span>
                  <span className="text-white font-bold">{data.records.svcb.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TargetName:</span>
                  <span className="text-slate-200">{data.records.svcb.targetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Port (key 3):</span>
                  <span className="text-cyan-300 font-bold">{data.records.svcb.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ALPN (key 1):</span>
                  <span className="text-slate-200">{data.records.svcb.alpn.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Path SvcParam (key 65300):</span>
                  <span className="text-emerald-300 font-semibold">{data.records.svcb.path}</span>
                </div>
              </div>
            </div>

            {/* TXT Supplementary Metadata */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-slate-300 font-bold mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>TXT SUPPLEMENTARY METADATA</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
                <code>{data.records.txt.raw}</code>
              </div>
            </div>
          </div>

          {/* Cryptographic DNSSEC Details */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2 mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>DNSSEC CRYPTOGRAPHIC PROOF (RRSIG + DNSKEY + DS)</span>
              </div>

              {/* RRSIG Details */}
              <div className="space-y-2 text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type Covered:</span>
                    <span className="text-white font-bold">{data.records.rrsig.typeCovered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Algorithm:</span>
                    <span className="text-cyan-300">{data.records.rrsig.algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Signer Domain:</span>
                    <span className="text-white">{data.records.rrsig.signerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Key Tag:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">{data.records.rrsig.keyTag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valid Window:</span>
                    <span className="text-slate-300">
                      {data.records.rrsig.signatureInception} → {data.records.rrsig.signatureExpiration}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] mb-1">RRSIG Signature Hex:</span>
                    <div className="p-2 rounded bg-black text-[10px] text-emerald-400 break-all select-all font-mono">
                      {data.records.rrsig.signatureHex}
                    </div>
                  </div>
                </div>

                {/* DNSKEY & DS Details */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    <span>Zone Signing Keys (KSK / ZSK)</span>
                  </div>
                  <div className="text-slate-300 text-[10px]">
                    KSK: Flags 257, Tag: 44102 (ECDSA P-256)
                  </div>
                  <div className="text-slate-300 text-[10px]">
                    ZSK: Flags 256, Tag: 20301 (ECDSA P-256)
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] mb-1">Trust Anchor Delegation Signer (DS):</span>
                    <div className="p-2 rounded bg-black text-[10px] text-cyan-300 break-all select-all font-mono">
                      Tag: {data.records.ds.keyTag} | SHA-256: {data.records.ds.digest}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signed Zone File Preview */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>BIND9 SIGNED ZONE FILE (lab.dnsaid.test)</span>
                </div>
                <button
                  onClick={handleCopyZone}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied' : 'Copy Zone'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-black/90 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
                {data.zoneFileSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
