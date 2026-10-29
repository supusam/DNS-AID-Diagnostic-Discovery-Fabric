# Live Demonstration & Mentor Guide

## 30-Second Quick Overview

When presenting this prototype to a hackathon judge or mentor, walk through the 4-phase sequence visible at the top of the interface:

`DISCOVER → VALIDATE → AUTHORIZE → INVOKE`

### 1. Click "START DEMO"
Clicking the green **"START DEMO"** button in the top navigation automatically executes the complete 10-step verification suite:
1. Discovers the latency service via DNS SVCB/TXT records.
2. Validates DNSSEC RRSIG and AD=1 flags.
3. Checks application schema adherence.
4. Contacts local authorization policy to issue a short-lived JWT.
5. Invokes the mock Latency Probe and receives 10 RTT samples.
6. Displays the rich telemetry graphs.
7. Executes the **Bogus DNS** test (proves fail-closed DNSSEC).
8. Executes the **Malformed Metadata** test (proves schema guard).
9. Executes the **Unauthorized Invocation** test (proves DNS discovery != authorization).
10. Executes the **Unavailable Service** test (proves graceful network fault handling).

### 2. Final Summary Result
At the end of the demo, the modal displays:
- `VALID DISCOVERY: PASS`
- `BOGUS DNS: BLOCKED`
- `MALFORMED METADATA: BLOCKED`
- `UNAUTHORIZED SERVICE: BLOCKED`
- `UNAVAILABLE SERVICE: HANDLED`

### 3. Key Discussion Points for Judges
1. **Separation of Concerns:** Show how DNSSEC verifies only that DNS records are authentic, while authorization is enforced separately by policy and JWT.
2. **Local Portability:** Emphasize that the entire stack runs locally inside Docker containers without external Internet dependencies.
