/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Client API services for DNS-AID Diagnostic Discovery Fabric.
 */

import {
  DiagnosticServiceId,
  DiscoveredService,
  AuditLogEntry,
  ScenarioResult,
  DemoExecutionReport,
} from '../types/dnsaid';

export async function fetchSystemStatus() {
  const res = await fetch('/api/status');
  if (!res.ok) throw new Error('Failed to fetch system status');
  return res.json();
}

export async function fetchDiscoveredServices(): Promise<DiscoveredService[]> {
  const res = await fetch('/api/services');
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function discoverService(serviceId: DiagnosticServiceId, simulateTampering = false) {
  const res = await fetch('/api/discover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId, simulateTampering }),
  });
  const data = await res.json();
  if (!res.ok && !data.trace) {
    throw new Error(data.message || data.error || 'Discovery failed');
  }
  return data;
}

export async function validateMetadata(serviceId: DiagnosticServiceId, malformed = false) {
  const res = await fetch('/api/validate-metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId, malformed }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Metadata validation failed');
  }
  return data;
}

export async function authorizeService(serviceId: DiagnosticServiceId, denyAuth = false) {
  const res = await fetch('/api/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId, denyAuth }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authorization failed');
  }
  return data;
}

export async function invokeService(serviceId: DiagnosticServiceId, token: string, simulateUnavailable = false) {
  const res = await fetch('/api/invoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId, token, simulateUnavailable }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invocation failed');
  }
  return data;
}

export async function runScenario(scenarioId: string): Promise<ScenarioResult> {
  const res = await fetch('/api/scenarios/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenarioId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Scenario run failed');
  }
  return res.json();
}

export async function executeDemoSequence(): Promise<DemoExecutionReport> {
  const res = await fetch('/api/demo/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Demo sequence execution failed');
  return res.json();
}

export async function fetchDnsInspector(qname?: string) {
  const url = qname ? `/api/dns/inspect?qname=${encodeURIComponent(qname)}` : '/api/dns/inspect';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to inspect DNS records');
  return res.json();
}

export async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  const res = await fetch('/api/audit/logs');
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function clearAuditLogs(): Promise<void> {
  await fetch('/api/audit/clear', { method: 'POST' });
}
