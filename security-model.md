# Security Model: DNS-AID Diagnostic Discovery Fabric

## The Three Fundamental Verification Planes

A central goal of this prototype is preventing the dangerous conflation of discovery and authorization.
The system maintains strict mathematical boundaries across three planes:

### 1. Metadata Integrity (DNSSEC)
- **Mechanism:** ECDSA P-256 digital signatures (Algorithm 13), cryptographic hash digests, RRSIG, DNSKEY, DS records.
- **Guarantee:** Proves that the DNS response originates from the authoritative zone manager and was not modified in transit.
- **Limitation:** Does **not** prove that the service is authorized for this client, nor does it prove the service is benign.

### 2. Service Authorization (Application Policy & JWT)
- **Mechanism:** Standalone policy engine evaluating client identities (principals) and required operational scopes.
- **Enforcement:** Short-lived (300s) JSON Web Tokens (JWT) signed with HMAC-SHA256 or RS256.
- **Claims:**
  - `sub`: Client identifier (e.g. `ops-agent-01`)
  - `aud`: Explicit target service URN (`urn:dnsaid:service:latency`)
  - `iss`: Authoritative authentication authority (`https://auth.lab.dnsaid.test`)
  - `scope`: Required capability (`diagnostic:latency`)
  - `exp`: Short-lived expiration window

### 3. Service Trustworthiness
- **Mechanism:** Independent operational decision and local trust policy.
- **Principle:** DNSSEC validates data integrity, NOT semantic reputation. An attacker who controls a legitimately signed domain can publish valid DNSSEC records for malicious probes. The discovery client must never implicitly trust an endpoint merely because its DNS records are signed.

## Mandatory Architectural Assertion
> "DNS discovery does not authorize invocation and does not prove service trustworthiness."
