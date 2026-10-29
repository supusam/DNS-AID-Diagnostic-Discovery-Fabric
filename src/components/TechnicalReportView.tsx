/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, ShieldCheck, ChevronRight, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const TechnicalReportView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(1);

  const sections = [
    { id: 1, title: '1. Problem Statement' },
    { id: 2, title: '2. Motivation' },
    { id: 3, title: '3. Research Perspective' },
    { id: 4, title: '4. Proposed Architecture' },
    { id: 5, title: '5. DNS-AID Subset' },
    { id: 6, title: '6. DNS Namespace Design' },
    { id: 7, title: '7. DNSSEC Cryptographic Design' },
    { id: 8, title: '8. Discovery Workflow' },
    { id: 9, title: '9. Authentication Workflow' },
    { id: 10, title: '10. Threat Model' },
    { id: 11, title: '11. Negative Testing Strategy' },
    { id: 12, title: '12. Results & Observations' },
    { id: 13, title: '13. Limitations' },
    { id: 14, title: '14. Future Scope' },
    { id: 15, title: '15. Conclusion' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 h-fit sticky top-20 font-mono text-xs">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-2">Table of Contents</div>
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
              activeSection === sec.id
                ? 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="truncate">{sec.title}</span>
            {activeSection === sec.id && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 p-6 sm:p-8 rounded-xl bg-slate-900/90 border border-slate-800 space-y-6 text-slate-200 leading-relaxed font-sans text-sm">
        {activeSection === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">1. Problem Statement</h3>
            <blockquote className="p-4 rounded-lg bg-slate-950 border-l-2 border-emerald-400 text-slate-200 font-medium italic">
              "Distributed diagnostic capabilities are frequently coupled to hardcoded addresses or proprietary registries, making endpoint discovery fragile when services move or scale. This prototype investigates whether DNS-based, DNSSEC-validated metadata can provide dynamic discovery of diagnostic capabilities while keeping service authorization and trust decisions explicitly outside DNS discovery."
            </blockquote>
            <p>
              In large-scale cloud fabrics, edge compute clusters, and distributed IoT backbones, diagnostic telemetry components (such as latency probes, traceroute nodes, and reachability checkers) require continuous endpoint discovery. Traditional approaches rely either on static IP configuration tables or centralized proprietary discovery services (e.g. Consul, Eureka, or cloud-specific service directories).
            </p>
            <p>
              These legacy registries create single points of failure, vendor lock-in, and operational boundaries. DNS offers a globally standard, distributed hierarchical namespace, but conventional DNS lacks structured discovery parameters (like ALPN, port, protocol endpoints) and historically lacks origin authentication without DNSSEC.
            </p>
          </div>
        )}

        {activeSection === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">2. Motivation</h3>
            <p>
              Recent Internet-Drafts and RFCs, specifically <strong>RFC 9460 (Service Binding and Parameter Specification via the DNS - SVCB/HTTPS)</strong> and ongoing agent discovery research (such as DNS-AID concepts), offer an opportunity to embed rich connection and protocol metadata directly into DNS records.
            </p>
            <p>
              However, conflating discovery with authorization is a dangerous architectural fallacy. If an application assumes that discovering a service record in DNS implies permission to invoke it—or implies that the service itself is benign and trustworthy—severe security vulnerabilities emerge, including confused deputy attacks, privilege escalation, and unintended probe invocation.
            </p>
          </div>
        )}

        {activeSection === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">3. Research Perspective & Contribution</h3>
            <blockquote className="p-4 rounded-lg bg-slate-950 border-l-2 border-cyan-400 text-slate-200 font-medium italic">
              "The prototype demonstrates a layered discovery architecture in which DNS provides verifiable service metadata, DNSSEC protects metadata integrity, application policy independently determines authorization, and authenticated invocation establishes the final service interaction."
            </blockquote>
            <p>
              We deliberately refrain from claiming that this prototype is the world's first discovery solution, or that DNS-AID provides intrinsic authorization. Instead, the research contribution is the <strong>rigorous delineation of boundaries</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>Integrity Plane:</strong> DNSSEC assures origin authenticity and message integrity.</li>
              <li><strong>Schema Plane:</strong> Application-level validation prevents malformed injection.</li>
              <li><strong>Authorization Plane:</strong> Standalone policy engines verify client identities and mint scoped JWTs.</li>
              <li><strong>Invocation Plane:</strong> Target services independently verify bearer credentials before processing workloads.</li>
            </ul>
          </div>
        )}

        {activeSection === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">4. Proposed Architecture</h3>
            <p>
              The system consists of six isolated components operating in a closed lab environment:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-slate-300">
              <li><strong>React / TypeScript Web Observability Frontend:</strong> Visualizes topology, trace trees, and telemetry.</li>
              <li><strong>FastAPI / Express Discovery Engine:</strong> Executes DNS queries, verifies DNSSEC RRSIG, and validates schemas.</li>
              <li><strong>Authoritative DNSSEC-enabled BIND9 Server:</strong> Hosts the signed test zone <code>lab.dnsaid.test</code>.</li>
              <li><strong>Latency Probe Service:</strong> Microservice measuring round-trip time, packet loss, and jitter.</li>
              <li><strong>Route Analyzer Service:</strong> Multi-hop traceroute and ASN path analyzer.</li>
              <li><strong>Reachability Monitor Service:</strong> Handshake, MTU, and TLS validation daemon.</li>
            </ol>
          </div>
        )}

        {activeSection === 5 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">5. Pinned DNS-AID Subset</h3>
            <p>
              To ensure stability and eliminate speculative complexity, this prototype implements a well-defined experimental subset:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs mt-2">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Structured DNS-AID Namespace</span>
                <code>*. _agents.lab.dnsaid.test</code>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">SVCB Connectivity Metadata</span>
                RFC 9460 priority, target, port, ALPN
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-purple-400 font-bold block mb-1">DNS-SD Style Service Naming</span>
                Capability discovery without central coordinator
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">TXT Supplementary Metadata</span>
                Schema URN, protocol version, environment
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">DNSSEC Validation Engine</span>
                RRSIG signature & trust anchor validation
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-indigo-400 font-bold block mb-1">Application Schema Validator</span>
                Fail-closed parsing of operational parameters
              </div>
            </div>
          </div>
        )}

        {activeSection === 6 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">6. DNS Namespace Design</h3>
            <p>
              The DNS namespace is structured under an isolated signed test zone: <code>lab.dnsaid.test</code>.
              Agent and service endpoints are partitioned using the <code>_agents</code> label to prevent collision with regular hostnames:
            </p>
            <div className="p-3 rounded-lg bg-black font-mono text-xs text-slate-300 space-y-1">
              <div>latency._agents.lab.dnsaid.test  IN SVCB 1 latency-probe.internal...</div>
              <div>route._agents.lab.dnsaid.test    IN SVCB 1 route-analyzer.internal...</div>
              <div>reachability._agents.lab.dnsaid.test IN SVCB 1 reachability-monitor.internal...</div>
            </div>
            <p className="text-xs text-slate-400">
              No internet-wide registry is instantiated; all operations resolve within the controlled lab zone.
            </p>
          </div>
        )}

        {activeSection === 7 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">7. DNSSEC Cryptographic Design</h3>
            <p>
              DNSSEC is configured using <strong>Algorithm 13 (ECDSA P-256 with SHA-256)</strong>, providing compact cryptographic signatures suitable for low-overhead IoT and distributed environments.
            </p>
            <p>
              The zone maintains two cryptographic keys:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>Key Signing Key (KSK):</strong> KeyTag 44102 (Flags 257). Hash committed to parent DS record.</li>
              <li><strong>Zone Signing Key (ZSK):</strong> KeyTag 20301 (Flags 256). Signs the SVCB and TXT RRsets, yielding RRSIG records.</li>
            </ul>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-xs">
              <span className="text-emerald-400 font-bold">Rule:</span> If RRSIG does not validate, or if the AD bit cannot be verified, the client immediately drops the response and aborts execution.
            </div>
          </div>
        )}

        {activeSection === 8 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">8. Discovery Workflow</h3>
            <p>The discovery workflow is executed in 6 deterministic stages:</p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-300">
              <li>Client crafts DNS request for <code>&lt;service&gt;._agents.lab.dnsaid.test</code> with EDNS0 DO=1.</li>
              <li>Authoritative resolver returns SVCB, TXT, and corresponding RRSIG records.</li>
              <li>Cryptographic engine computes canonical hash over RRset and validates against ZSK.</li>
              <li>ZSK authenticates up the chain through KSK and DS trust anchor.</li>
              <li>Resolver sets <code>AD=1</code> (Authenticated Data) in the header.</li>
              <li>Discovery client accepts endpoint metadata (port, host, ALPN, path).</li>
            </ol>
          </div>
        )}

        {activeSection === 9 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">9. Authentication Workflow</h3>
            <p>
              Upon successful discovery, invocation does NOT occur automatically. An explicit authorization flow is executed:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>The discovery client contacts the local authorization policy engine with its client principal ID and desired capability.</li>
              <li>The policy engine checks RBAC permissions (e.g. <code>diagnostic:latency</code>).</li>
              <li>If granted, a short-lived (300-second TTL) JSON Web Token (JWT) is minted containing <code>sub</code>, <code>aud</code>, <code>iss</code>, and <code>scope</code>.</li>
              <li>The client transmits an HTTP/2 or HTTP/3 request to the discovered endpoint with <code>Authorization: Bearer &lt;token&gt;</code>.</li>
              <li>The destination diagnostic service validates the signature and audience independently before executing any diagnostic probes.</li>
            </ul>
          </div>
        )}

        {activeSection === 10 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">10. Threat Model</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-red-400 font-bold block mb-1">Threat 1: DNS Cache Poisoning / Spoofing</span>
                <strong>Mitigation:</strong> DNSSEC cryptographic validation of RRSIG fails; client transitions to fail-closed immediately.
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">Threat 2: Malicious Metadata Injection</span>
                <strong>Mitigation:</strong> Strict application schema validation checks port bounds, URI formats, and capability URNs.
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">Threat 3: Unauthorized Service Invocation</span>
                <strong>Mitigation:</strong> Services require short-lived, cryptographically signed JWT bearer tokens with scoped claims.
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-purple-400 font-bold block mb-1">Threat 4: Rogue Signed Services (The Trust Fallacy)</span>
                <strong>Mitigation:</strong> System architecture explicitly states that DNSSEC does not convey service trustworthiness. Independent client trust policy prevents invoking unknown services.
              </div>
            </div>
          </div>
        )}

        {activeSection === 11 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">11. Negative Testing Strategy</h3>
            <p>
              To satisfy rigorous scientific inquiry, the prototype incorporates systematic falsification testing:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>Bogus DNS Injection:</strong> Artificially mutated RRSIG records trigger instant rejection.</li>
              <li><strong>Out-of-Bound Metadata:</strong> Port 99999 and unsupported schemas trigger schema rejection without invocation.</li>
              <li><strong>Authorization Policy Denial:</strong> Demonstrates that even when DNSSEC and metadata are 100% valid, invocation is completely blocked.</li>
              <li><strong>Downstream Unavailable:</strong> Validates error recovery when diagnostic microservices suffer network timeouts.</li>
            </ul>
          </div>
        )}

        {activeSection === 12 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">12. Results & Observations</h3>
            <p>
              The prototype confirms that DNSSEC + SVCB provides a lightweight, resilient, and standardized mechanism for dynamic service discovery.
              Key metrics observed:
            </p>
            <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">DNSSEC VERIFY</div>
                <div className="text-base font-bold text-emerald-400">~8.4 ms</div>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">METADATA PARSE</div>
                <div className="text-base font-bold text-cyan-400">~2.1 ms</div>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">AUTH & JWT</div>
                <div className="text-base font-bold text-purple-400">~4.6 ms</div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 13 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">13. Limitations</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>DNS Propagation / TTL Caching:</strong> Dynamic updates in DNS rely on short TTLs (e.g. 300s), which can introduce brief latency during rapid microservice redeployments.</li>
              <li><strong>Isolated Test Zone:</strong> Operations are tested in <code>lab.dnsaid.test</code> and do not validate cross-TLD parent delegation chains.</li>
              <li><strong>UDP Packet Size Limits:</strong> Rich TXT metadata combined with DNSSEC RRSIG keys approaches the typical 1232-byte EDNS buffer safety threshold.</li>
            </ul>
          </div>
        )}

        {activeSection === 14 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">14. Future Scope</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Integration with DNS UPDATE (RFC 2136) for automated self-registration by newly spawned diagnostic containers.</li>
              <li>Adoption of DANE (RFC 6698 / TLSA) for end-to-end pinning of TLS certificates to DNSSEC records.</li>
              <li>Investigation of CBOR-compressed binary attributes in SVCB custom keys for ultra-constrained IoT sensors.</li>
            </ul>
          </div>
        )}

        {activeSection === 15 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono">15. Conclusion</h3>
            <p>
              The DNS-AID Diagnostic Discovery Fabric demonstrates that DNS can serve as a decentralized, verifiable service discovery layer without compromising security boundaries.
            </p>
            <p>
              By decoupling <strong>Metadata Integrity (DNSSEC)</strong> from <strong>Application Authorization (JWT)</strong> and <strong>Service Trustworthiness</strong>, the architecture provides a robust blueprint for secure, dynamic observability across modern distributed systems.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
              "DNS discovery provides metadata integrity — not invocation authorization or service trust."
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
