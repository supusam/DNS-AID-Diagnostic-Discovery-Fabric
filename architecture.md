# Architecture Specification: DNS-AID Diagnostic Discovery Fabric

## 1. Architectural Model & Component Roles

```
┌────────────────────────────────────────────────────────┐
│                   Frontend Dashboard                   │
│   (React + TypeScript Observability Console - Port 3000)│
└───────────────────────────┬────────────────────────────┘
                            │ (1) Trigger Discovery
                            ▼
┌────────────────────────────────────────────────────────┐
│              FastAPI Discovery Engine                  │
│       (DNSSEC Resolver + Schema Validator - Port 8000) │
└─────────────┬────────────────────────────┬─────────────┘
              │ (2) Query SVCB (DO=1)      │ (4) Check Policy & Mint JWT
              ▼                            ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│   BIND9 DNSSEC Server     │ │ Local Policy Engine      │
│ (lab.dnsaid.test - Port 53)│ │ (RBAC Role Evaluator)    │
└───────────────────────────┘ └────────────┬─────────────┘
                                           │ (5) Signed Bearer Token
                                           ▼
┌────────────────────────────────────────────────────────┐
│        Authenticated Diagnostic Microservices          │
│  - Latency Probe Service (Port 8081 / RTT Jitter)      │
│  - Route Analyzer Service (Port 8082 / Traceroute)     │
│  - Reachability Monitor Service (Port 8083 / TLS MTU)  │
└────────────────────────────────────────────────────────┘
```

## 2. Pinned Discovery Namespace
- Zone: `lab.dnsaid.test`
- Key Signing Key (KSK): ECDSA P-256 (KeyTag: 44102)
- Zone Signing Key (ZSK): ECDSA P-256 (KeyTag: 20301)
- Service Prefix: `*. _agents.lab.dnsaid.test`

## 3. RFC 9460 SVCB Parameters
- SvcPriority: `1`
- TargetName: `<service>-probe.internal.lab.dnsaid.test.`
- Port: `8081`, `8082`, `8083`
- ALPN: `h2`, `h3`
- Key65300 (Custom path): `/v1/diagnostic/<service>`

## 4. TXT Supplementary Schema
- Format: `schema=urn:dnsaid:diag:<capability>:v1 env=lab capability=<type>`
