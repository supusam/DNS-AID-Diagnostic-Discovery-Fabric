/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Domain models and TypeScript contracts for the
 * DNS-AID Diagnostic Discovery Fabric (PS-033).
 */

export type DiagnosticServiceId = 'latency' | 'route' | 'reachability';

export type DNSSECStatus = 'SECURE' | 'BOGUS' | 'INSECURE' | 'INDETERMINATE';

export type MetadataStatus = 'VALID' | 'MALFORMED' | 'REJECTED' | 'UNVALIDATED';

export type AuthorizationStatus = 'AUTHORIZED' | 'DENIED' | 'UNCHECKED' | 'EXPIRED';

export type InvocationStatus = 'IDLE' | 'INVOKING' | 'SUCCESS' | 'ERROR' | 'BLOCKED';

export interface SVCBParams {
  priority: number;
  targetName: string;
  port: number;
  alpn: string[];
  path: string;
  mandatory?: string[];
  ttl: number;
}

export interface TXTMetadata {
  schema: string;
  version: string;
  env: string;
  capability: string;
  provider: string;
  format: string;
}

export interface DNSSECRecordDetail {
  recordName: string;
  recordType: 'SVCB' | 'TXT' | 'DNSKEY' | 'DS' | 'RRSIG';
  algorithm: string;
  keyTag: number;
  signerName: string;
  inception: string;
  expiration: string;
  rrsigHex: string;
  digestType: string;
  trustAnchor: string;
  isSimulated: boolean;
  chainValid: boolean;
}

export interface DiscoveredService {
  id: DiagnosticServiceId;
  name: string;
  capability: string;
  description: string;
  protocol: string;
  dnsName: string;
  endpoint: string;
  dnssecStatus: DNSSECStatus;
  metadataStatus: MetadataStatus;
  authStatus: AuthorizationStatus;
  availability: 'ONLINE' | 'DEGRADED' | 'UNREACHABLE';
  lastDiscoveryTime?: string;
  svcb: SVCBParams;
  txt: TXTMetadata;
  dnssec: DNSSECRecordDetail;
  invocationResult?: any;
}

export interface TraceStep {
  id: string;
  stepNumber: number;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'BLOCKED';
  timestamp: string;
  summary: string;
  technicalDetails?: Record<string, any>;
  durationMs: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operation: 'DISCOVERY' | 'DNSSEC_VERIFY' | 'METADATA_VALIDATE' | 'AUTHORIZE' | 'INVOCATION' | 'SCENARIO_RUN';
  service: string;
  serviceId: DiagnosticServiceId | 'system';
  dnssec: 'VALID' | 'BOGUS' | 'BYPASSED' | 'N/A';
  metadata: 'VALID' | 'REJECTED' | 'MALFORMED' | 'N/A';
  authorization: 'AUTHORIZED' | 'DENIED' | 'BLOCKED' | 'READY' | 'N/A';
  invocation: 'SUCCESS' | 'BLOCKED' | 'ERROR' | 'SKIPPED' | 'READY' | 'N/A';
  result: 'SUCCESS' | 'SECURITY FAILURE' | 'BLOCKED' | 'NETWORK ERROR';
  reason?: string;
}

export interface LatencyTelemetry {
  service: string;
  timestamp: string;
  targetHost: string;
  packetsSent: number;
  packetsReceived: number;
  packetLossPercent: number;
  rttMinMs: number;
  rttAvgMs: number;
  rttMaxMs: number;
  jitterMs: number;
  healthStatus: 'NOMINAL' | 'DEGRADED' | 'CRITICAL';
  samples: Array<{ seq: number; rtt: number; status: 'ok' | 'timeout' }>;
}

export interface HopTrace {
  hop: number;
  ip: string;
  hostname: string;
  asNumber: string;
  rttMs: number;
  status: 'REACHABLE' | 'LATENCY_SPIKE' | 'DROPPED';
}

export interface RouteTelemetry {
  service: string;
  timestamp: string;
  destination: string;
  hopCount: number;
  routePath: HopTrace[];
  avgLatencyMs: number;
  routeStatus: 'OPTIMAL' | 'SUB_OPTIMAL' | 'CONGESTED';
}

export interface ReachabilityTelemetry {
  service: string;
  timestamp: string;
  targetEndpoint: string;
  reachable: boolean;
  responseTimeMs: number;
  availabilityPercent: number;
  httpStatus: number;
  tlsVersion: string;
  certValid: boolean;
  mtuProbeBytes: number;
  statusText: string;
}

export interface ScenarioResult {
  scenarioId: 'valid' | 'bogus_dns' | 'malformed_metadata' | 'unavailable' | 'unauthorized';
  name: string;
  description: string;
  dnssecStatus: 'PASS' | 'FAIL';
  metadataStatus: 'PASS' | 'FAIL' | 'UNKNOWN';
  authStatus: 'PASS' | 'FAIL' | 'BLOCKED';
  availabilityStatus: 'PASS' | 'FAIL' | 'UNKNOWN';
  outcome: 'SUCCESS' | 'REJECT' | 'BLOCK' | 'ERROR';
  explanation: string;
  technicalLogs: string[];
  trace: TraceStep[];
}

export interface DemoStepEvent {
  step: number;
  title: string;
  detail: string;
  status: 'RUNNING' | 'PASS' | 'BLOCKED' | 'ERROR';
  timestamp: string;
}

export interface DemoExecutionReport {
  timestamp: string;
  stepsCompleted: number;
  events: DemoStepEvent[];
  summary: {
    validDiscovery: 'PASS' | 'FAIL';
    bogusDns: 'BLOCKED' | 'UNCAUGHT';
    malformedMetadata: 'BLOCKED' | 'UNCAUGHT';
    unauthorizedService: 'BLOCKED' | 'UNCAUGHT';
    unavailableService: 'HANDLED' | 'UNCAUGHT';
  };
}
