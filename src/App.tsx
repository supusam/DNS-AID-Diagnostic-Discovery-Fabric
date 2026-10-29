/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SecurityPrincipleBanner } from './components/SecurityPrincipleBanner';
import { MainStatistics } from './components/MainStatistics';
import { ServiceCard } from './components/ServiceCard';
import { DiscoveryTraceTimeline } from './components/DiscoveryTraceTimeline';
import { SecurityStatusPanels } from './components/SecurityStatusPanels';
import { NetworkTopologyCanvas } from './components/NetworkTopologyCanvas';
import { SecurityLabView } from './components/SecurityLabView';
import { DnsInspectorView } from './components/DnsInspectorView';
import { AuditLogView } from './components/AuditLogView';
import { ArchitectureView } from './components/ArchitectureView';
import { TechnicalReportView } from './components/TechnicalReportView';
import { PseudocodeView } from './components/PseudocodeView';
import { DemoModal } from './components/DemoModal';

import {
  DiscoveredService,
  AuditLogEntry,
  TraceStep,
  DiagnosticServiceId,
} from './types/dnsaid';

import {
  fetchSystemStatus,
  fetchDiscoveredServices,
  discoverService,
  validateMetadata,
  authorizeService,
  invokeService,
  fetchAuditLogs,
  clearAuditLogs,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('discovery');
  const [services, setServices] = useState<DiscoveredService[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [currentTrace, setCurrentTrace] = useState<TraceStep[]>([]);
  const [activeServiceName, setActiveServiceName] = useState<string>('latency-probe');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activePulseService, setActivePulseService] = useState<DiagnosticServiceId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<string>('SYSTEM ONLINE');

  // Load initial data
  const loadState = async () => {
    try {
      const [svcData, logData, sysData] = await Promise.all([
        fetchDiscoveredServices(),
        fetchAuditLogs(),
        fetchSystemStatus(),
      ]);
      setServices(svcData);
      setAuditLogs(logData);
      if (sysData?.status) setSystemStatus(sysData.status);
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  // Handlers for Service Card Actions
  const handleDiscover = async (serviceId: DiagnosticServiceId) => {
    setIsLoading(true);
    setActivePulseService(serviceId);
    try {
      const res = await discoverService(serviceId);
      if (res.trace) {
        setCurrentTrace(res.trace);
        setActiveServiceName(serviceId);
      }
      await loadState();
    } finally {
      setIsLoading(false);
      setTimeout(() => setActivePulseService(null), 2000);
    }
  };

  const handleValidate = async (serviceId: DiagnosticServiceId) => {
    setIsLoading(true);
    try {
      await validateMetadata(serviceId);
      await loadState();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvoke = async (serviceId: DiagnosticServiceId) => {
    setIsLoading(true);
    setActivePulseService(serviceId);
    try {
      // 1. Authorize to obtain short-lived JWT token
      const authRes = await authorizeService(serviceId);
      if (!authRes.token) throw new Error('Authorization token missing');

      // 2. Invoke the target service using the bearer token
      await invokeService(serviceId, authRes.token);
      await loadState();
    } finally {
      setIsLoading(false);
      setTimeout(() => setActivePulseService(null), 2000);
    }
  };

  const handleClearLogs = async () => {
    try {
      await clearAuditLogs();
      setAuditLogs([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartDemo={() => setIsDemoOpen(true)}
        systemStatus={systemStatus}
      />

      {/* Main Security Principle & 4-Phase Pipeline Banner */}
      <SecurityPrincipleBanner />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Main Statistics Cards (Visible on Discovery, Topology, and Inspector) */}
        {(activeTab === 'discovery' || activeTab === 'topology' || activeTab === 'dns-inspector') && (
          <MainStatistics
            discoveredCount={services.length}
            availableCount={services.filter((s) => s.availability === 'ONLINE').length}
            dnssecStatus="VALID"
            testZone="lab.dnsaid.test"
          />
        )}

        {/* TAB 1: Service Discovery Main View */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            {/* 3 Large Service Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Dynamic Diagnostic Capabilities ({services.length} Discovered via SVCB)
                </div>
                <div className="text-xs font-mono text-emerald-400">
                  Zone: lab.dnsaid.test (Signed)
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {services.map((svc) => (
                  <ServiceCard
                    key={svc.id}
                    service={svc}
                    onDiscover={handleDiscover}
                    onValidate={handleValidate}
                    onInvoke={handleInvoke}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Three Independent Security Status Panels */}
            <SecurityStatusPanels />

            {/* Discovery Trace Timeline */}
            <DiscoveryTraceTimeline
              steps={currentTrace}
              activeServiceName={activeServiceName}
            />
          </div>
        )}

        {/* TAB 2: Security & Failure Lab */}
        {activeTab === 'security-lab' && <SecurityLabView />}

        {/* TAB 3: Interactive Network Topology */}
        {activeTab === 'topology' && (
          <NetworkTopologyCanvas
            onTriggerPacket={(svcId) => handleDiscover(svcId)}
            activePulseService={activePulseService}
          />
        )}

        {/* TAB 4: Technical DNS Inspector */}
        {activeTab === 'dns-inspector' && <DnsInspectorView />}

        {/* TAB 5: Real-Time Audit Log */}
        {activeTab === 'audit-log' && (
          <AuditLogView logs={auditLogs} onClearLogs={handleClearLogs} />
        )}

        {/* TAB 6: Architecture & Pseudocode */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <ArchitectureView />
            <PseudocodeView />
          </div>
        )}

        {/* TAB 7: Technical Report (15 Sections) */}
        {activeTab === 'report' && <TechnicalReportView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>DNS-AID Diagnostic Discovery Fabric</span>
            <span className="mx-2">·</span>
            <span>Cloud Computing & IoT Hackathon (PS-033)</span>
          </div>
          <div className="text-slate-400">
            Isolated Test Zone: <code className="text-emerald-400">lab.dnsaid.test</code>
          </div>
        </div>
      </footer>

      {/* Automated Demo Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onComplete={() => loadState()}
      />
    </div>
  );
}
