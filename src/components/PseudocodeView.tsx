/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileCode, Copy, Check, Terminal } from 'lucide-react';

export const PseudocodeView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const pseudocode = `FUNCTION discover_service(service_name):

    response = DNS_QUERY(
        service_name,
        SVCB,
        DNSSEC=true
    )

    IF response.dnssec_status != VALID:
        RETURN REJECT

    metadata = PARSE(response)

    IF metadata INVALID:
        RETURN REJECT

    IF POLICY_DENIES(metadata.service):
        RETURN REJECT

    token = AUTHENTICATE(client, metadata.service)

    result = INVOKE(metadata.endpoint, token)

    IF result UNAVAILABLE:
        RETURN ERROR

    RETURN result`;

  const pythonCode = `import dns.resolver
import dns.dnssec
import httpx
import jwt

def discover_service(service_name: str, client_id: str = "ops-agent-01"):
    # 1. Query DNS with DNSSEC validation enabled (DO=1)
    resolver = dns.resolver.Resolver()
    resolver.use_edns(0, dns.flags.DO, 4096)
    
    response = resolver.resolve(service_name, "SVCB")
    
    # 2. Check DNSSEC Authenticated Data flag
    if not (response.response.flags & dns.flags.AD):
        # Fail-closed: Never invoke unverified records
        return {"status": "REJECT", "reason": "DNSSEC validation failed"}
    
    # 3. Parse SVCB parameters & schema metadata
    metadata = parse_svcb_metadata(response)
    if not is_valid_schema(metadata):
        return {"status": "REJECT", "reason": "Application metadata schema violation"}
        
    # 4. Check application authorization policy
    # Crucial: DNS discovery does NOT authorize invocation!
    if not check_authorization_policy(client_id, metadata.capability):
        return {"status": "REJECT", "reason": "Policy denied invocation"}
        
    # 5. Mint short-lived scoped JWT bearer token
    token = mint_bearer_token(client_id, metadata.service_id)
    
    # 6. Authenticated Invocation
    try:
        resp = httpx.post(
            f"https://{metadata.target}:{metadata.port}{metadata.path}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5.0
        )
        if resp.status_code == 503:
            return {"status": "ERROR", "reason": "Service unavailable"}
        return {"status": "SUCCESS", "telemetry": resp.json()}
    except httpx.ConnectError:
        return {"status": "ERROR", "reason": "Connection refused"}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pseudocode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              Algorithmic Formalization
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core Discovery & Invocation Algorithm</h2>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Pseudocode'}</span>
          </button>
        </div>

        {/* The Exact Pseudocode as specified in the prompt */}
        <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed shadow-inner">
          <pre className="text-emerald-300 font-mono overflow-x-auto whitespace-pre">
            {pseudocode}
          </pre>
        </div>
      </div>

      {/* Corresponding Concrete Python Implementation */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-xs border-b border-slate-800 pb-2 mb-3">
          <Terminal className="w-4 h-4" />
          <span>PRODUCTION PYTHON EQUIVALENT (dnspython + httpx)</span>
        </div>
        <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
          <pre className="text-slate-200">
            {pythonCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
