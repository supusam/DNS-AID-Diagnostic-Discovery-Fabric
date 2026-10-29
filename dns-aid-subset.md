# Pinned DNS-AID Subset Specification

This prototype implements an experimental, bounded subset of DNS-AID concepts for diagnostic service discovery in isolated environments:

1. **Structured DNS-AID-Style Namespace:**
   Services are registered under the reserved subdomain `_agents.<zone>`.
   Example: `latency._agents.lab.dnsaid.test`

2. **SVCB-Based Connectivity Metadata (RFC 9460):**
   Uses Service Binding records to convey:
   - Service priority (`SvcPriority`)
   - Target hostname (`TargetName`)
   - Port assignment (`port`)
   - Application-layer protocol negotiation (`alpn="h2,h3"`)
   - Relative URI path (`key65300="/v1/diagnostic/..."`)

3. **DNS-SD-Style Capability Naming:**
   Enables discovery of functional capabilities (`network-latency`, `traceroute`, `reachability`) without hardcoded IP configurations.

4. **TXT Supplementary Metadata:**
   Transports schema identifiers (`schema=urn:dnsaid:diag:*`), protocol semantic versions, and environment tags.

5. **DNSSEC Validation:**
   Verifies Authenticated Data (`AD=1`), valid RRSIG time windows, and cryptographic hash matches against published DNSKEY.

6. **Application Metadata Schema Validation:**
   Strict parsing and boundary verification before handing parameters to HTTP clients.
