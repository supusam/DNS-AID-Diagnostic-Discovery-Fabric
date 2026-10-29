/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Radio,
  Lock,
  Play,
  RotateCw,
  Terminal,
} from 'lucide-react';
import { DiscoveredService } from '../types/dnsaid';
import { TelemetryVisualizer } from './TelemetryVisualizer';

interface ServiceCardProps {
  service: DiscoveredService;
  onDiscover: (serviceId: any) => Promise<void>;
  onValidate: (serviceId: any) => Promise<void>;
  onInvoke: (serviceId: any) => Promise<void>;
  isLoading: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onDiscover,
  onValidate,
  onInvoke,
  isLoading,
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleAction = async (action: 'discover' | 'validate' | 'invoke') => {
    setActiveAction(action);
    setLastError(null);
    try {
      if (action === 'discover') await onDiscover(service.id);
      if (action === 'validate') await onValidate(service.id);
      if (action === 'invoke') await onInvoke(service.id);
    } catch (err: any) {
      setLastError(err.message || 'Operation failed');
    } finally {
      setActiveAction(null);
    }
  };

  const getDnssecColor = (status: string) => {
    switch (status) {
      case 'SECURE':
      case 'VALID':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
      case 'BOGUS':
        return 'text-red-400 border-red-500/40 bg-red-950/40';
      default:
        return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    }
  };

  const getMetadataColor = (status: string) => {
    switch (status) {
      case 'VALID':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
      case 'MALFORMED':
      case 'REJECTED':
        return 'text-red-400 border-red-500/40 bg-red-950/40';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-900';
    }
  };

  const getAuthColor = (status: string) => {
    switch (status) {
      case 'AUTHORIZED':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40';
      case 'DENIED':
        return 'text-red-400 border-red-500/40 bg-red-950/40';
      default:
        return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    }
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
      <div>
        {/* Top Kicker and Service Name */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Capability:</span>
              <span className="text-emerald-400 font-semibold">{service.capability}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {service.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>{service.availability}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {service.description}
        </p>

        {/* DNS & Wire Metadata Properties */}
        <div className="space-y-2 mb-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" /> DNS Name:
            </span>
            <span className="text-slate-200 font-semibold select-all text-[11px]">{service.dnsName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-500" /> Protocol:
            </span>
            <span className="text-slate-300 text-[11px]">{service.protocol}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Last Discovery:
            </span>
            <span className="text-slate-400 text-[11px]">
              {service.lastDiscoveryTime ? new Date(service.lastDiscoveryTime).toLocaleTimeString() : 'Pending'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
            <span className="text-slate-400">SVCB Target / Port:</span>
            <span className="text-cyan-300 font-semibold">
              {service.svcb.targetName}:{service.svcb.port}
            </span>
          </div>
        </div>

        {/* Verification Status Badges (DNSSEC, Metadata, Auth) */}
        <div className="grid grid-cols-3 gap-2 mb-4 font-mono text-center">
          <div className={`p-2 rounded border text-xs ${getDnssecColor(service.dnssecStatus)}`}>
            <div className="text-[10px] text-slate-400 uppercase">DNSSEC</div>
            <div className="font-bold tracking-wider">{service.dnssecStatus}</div>
          </div>
          <div className={`p-2 rounded border text-xs ${getMetadataColor(service.metadataStatus)}`}>
            <div className="text-[10px] text-slate-400 uppercase">Metadata</div>
            <div className="font-bold tracking-wider">{service.metadataStatus}</div>
          </div>
          <div className={`p-2 rounded border text-xs ${getAuthColor(service.authStatus)}`}>
            <div className="text-[10px] text-slate-400 uppercase">Auth Policy</div>
            <div className="font-bold tracking-wider">{service.authStatus}</div>
          </div>
        </div>

        {/* Error Callout if any */}
        {lastError && (
          <div className="mb-3 p-2.5 rounded bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-mono text-[11px]">{lastError}</div>
          </div>
        )}

        {/* Telemetry output */}
        {service.invocationResult && (
          <TelemetryVisualizer serviceId={service.id} data={service.invocationResult} />
        )}
      </div>

      {/* Action Buttons: DISCOVER, VALIDATE, INVOKE */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80">
        <button
          onClick={() => handleAction('discover')}
          disabled={isLoading || activeAction !== null}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 disabled:opacity-50 whitespace-nowrap"
        >
          {activeAction === 'discover' ? (
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>DISCOVER</span>
        </button>

        <button
          onClick={() => handleAction('validate')}
          disabled={isLoading || activeAction !== null}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 disabled:opacity-50 whitespace-nowrap"
        >
          {activeAction === 'validate' ? (
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>VALIDATE</span>
        </button>

        <button
          onClick={() => handleAction('invoke')}
          disabled={isLoading || activeAction !== null}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm shadow-emerald-700/30 disabled:opacity-50 whitespace-nowrap"
        >
          {activeAction === 'invoke' ? (
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>INVOKE</span>
        </button>
      </div>
    </div>
  );
};
