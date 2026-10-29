# DNS-AID Diagnostic Discovery Fabric (PS-033)

**DNSSEC-Validated Dynamic Discovery and Authenticated Invocation of Distributed Diagnostic Services**

> **Core Security Principle:**  
> *"DNS discovery provides metadata integrity — not invocation authorization or service trust."*  
> DNSSEC cryptographically verifies that published records have not been forged or tampered with in transit.  
> **DNS discovery does not authorize invocation and does not prove service trustworthiness.**

---

## 1. Project Context & Problem Statement

Distributed diagnostic capabilities (e.g. latency probes, traceroute analyzers, reachability daemons) are frequently coupled to hardcoded addresses or proprietary registries, making endpoint discovery fragile when services move or scale.

This prototype investigates whether DNS-based, DNSSEC-validated metadata can provide dynamic discovery of diagnostic capabilities while keeping service authorization and trust decisions explicitly outside DNS discovery.

---

## 2. Research Contribution

The prototype demonstrates a **layered discovery architecture** in which:
1. **DNS provides verifiable service metadata** (RFC 9460 SVCB + TXT schemas).
2. **DNSSEC protects metadata integrity** (cryptographic RRSIG validation).
3. **Application policy independently determines authorization** (scoped RBAC).
4. **Authenticated invocation establishes the final service interaction** (short-lived JWT bearer tokens).

---

## 3. Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend:** Python 3.12, FastAPI, Pydantic, dnspython, HTTPX, PyJWT, cryptography
- **Server:** Node.js / Express Vite middleware for local preview & FastAPI for production
- **Infrastructure:** BIND9, DNSSEC (ECDSA P-256), Docker, Docker Compose

---

## 4. Running Locally with Docker

To build and run all services on one laptop without external Internet access:

```bash
docker compose up --build
```

### Endpoints
- **Frontend Observability Dashboard:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Discovery Gateway:** [http://localhost:8000](http://localhost:8000)
- **FastAPI Interactive Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **BIND9 DNSSEC Authoritative Server:** Port `53` (UDP/TCP)
- **Latency Probe Service:** Port `8081`
- **Route Analyzer Service:** Port `8082`
- **Reachability Monitor Service:** Port `8083`

---

## 5. Security & Failure Lab (Negative Test Matrix)

| Scenario | DNSSEC | Metadata | Authorization | Availability | Expected Result |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **1. Valid Discovery** | PASS | PASS | PASS | PASS | **SUCCESS** |
| **2. Bogus DNS Data** | FAIL | UNKNOWN | BLOCKED | UNKNOWN | **REJECT** |
| **3. Malformed Metadata** | PASS | FAIL | BLOCKED | UNKNOWN | **REJECT** |
| **4. Service Unavailable** | PASS | PASS | PASS | FAIL | **ERROR** |
| **5. Invalid Authorization** | PASS | PASS | FAIL | UNKNOWN | **BLOCK** |

---

## 6. Pseudocode

```text
FUNCTION discover_service(service_name):

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

    RETURN result
```
