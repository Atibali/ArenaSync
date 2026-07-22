/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StadiumState, Severity } from './types';
import StadiumMap from './components/StadiumMap';
import OperatorPanel from './components/OperatorPanel';
import FanConcierge from './components/FanConcierge';
import VolunteerTasks from './components/VolunteerTasks';
import SustainabilityTracker from './components/SustainabilityTracker';
import RealDataIntegrationsHub from './components/RealDataIntegrationsHub';

import {
  ShieldAlert,
  Users,
  ClipboardList,
  Compass,
  RefreshCw,
  Sun,
  Activity,
  Volume2,
  Settings2,
  Award,
  Train,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [persona, setPersona] = useState<'operator' | 'fan' | 'volunteer'>('operator');
  const [stadiumState, setStadiumState] = useState<StadiumState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>('north');

  // Load Stadium state from full-stack server
  const fetchStadiumState = async () => {
    try {
      const res = await fetch('/api/stadium/state');
      if (res.ok) {
        const data = await res.json();
        setStadiumState(data);
      }
    } catch (err) {
      console.error('Error fetching stadium telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStadiumState();
    // Auto sync state every 8 seconds to emulate real-time stadium sensors
    const interval = setInterval(fetchStadiumState, 8000);
    return () => clearInterval(interval);
  }, []);

  // Post Report Incident
  const handleReportIncident = async (title: string, sectorId: string, severity: Severity, description: string) => {
    try {
      const res = await fetch('/api/stadium/incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sectorId, severity, description }),
      });
      if (res.ok) {
        const data = await res.json();
        setStadiumState(data.state);
        setSelectedSectorId(sectorId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Post Resolve Incident
  const handleResolveIncident = async (incidentId: string) => {
    try {
      const res = await fetch('/api/stadium/incident/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId }),
      });
      if (res.ok) {
        const data = await res.json();
        setStadiumState(data.state);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Post Complete Volunteer Task
  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/stadium/task/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) {
        const data = await res.json();
        setStadiumState(data.state);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Post Reset State
  const handleResetState = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stadium/reset', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setStadiumState(data.state);
        setSelectedSectorId('north');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stadiumState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-900 animate-spin" />
          <Award className="w-6 h-6 text-brand-gold absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="text-center">
          <h1 className="font-display font-bold text-slate-900 text-lg">Booting ArenaSync Control</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">Establishing Full-Stack Sensor Tunnel...</p>
        </div>
      </div>
    );
  }

  const activeIncidents = stadiumState.incidents.filter((i) => i.status === 'active');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* Upper Global Transit Status Ticker */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 text-xs font-sans relative z-30 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold text-[10px] uppercase font-mono tracking-wider bg-slate-100 border border-slate-200 px-2.5 py-1 rounded text-blue-900">
            <Train className="w-3.5 h-3.5 text-blue-900" />
            Transit Plaza Live
          </span>
          <div className="flex items-center gap-3.5 text-[11px] text-slate-600">
            <span>Metro Status: <strong className="text-emerald-600 font-semibold">{stadiumState.transit.metroStatus}</strong></span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Electric Shuttles: <strong className="text-slate-800 font-mono font-medium">{stadiumState.transit.shuttleFrequencyMin}m intervals</strong></span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Clean Fleet size: <strong className="text-slate-800 font-mono font-medium">{stadiumState.transit.electricBusCount} buses active</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span className="hidden sm:inline">Stadium Energy: <strong className="text-amber-600 font-medium">Solar Microgrid Connected (100%)</strong></span>
          <button
            onClick={handleResetState}
            className="text-[10px] font-mono hover:text-slate-950 transition-all bg-white hover:bg-slate-50 px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1 cursor-pointer text-slate-600 shadow-sm"
            title="Reset simulation parameters to default"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            Reset State
          </button>
        </div>
      </div>

      {/* Main Tournament Banner & Title */}
      <header className="bg-blue-900 text-white flex flex-col md:flex-row md:items-center md:justify-between py-5 px-6 md:px-8 shrink-0 shadow-md relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[linear-gradient(45deg,#1e3a8a_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center shrink-0 shadow">
            <div className="w-6 h-6 border-4 border-blue-900 rounded-full border-t-transparent"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight uppercase tracking-wider font-display">FIFA World Cup 2026</h1>
            <p className="text-xs text-blue-200 font-medium">Operational Intelligence & Fan Experience Command</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4 md:mt-0">
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-blue-300 font-mono">Current Venue</p>
              <p className="text-sm font-semibold italic text-white">MetLife Stadium, NY/NJ</p>
            </div>
            <div className="h-10 w-px bg-blue-700/50"></div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-blue-300 font-mono">Match Status</p>
              <p className="text-sm font-semibold text-white">Match 42: FRA vs BRA | Pre-Match (T-120)</p>
            </div>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500/50 px-3.5 py-1 rounded-full flex items-center gap-2 shadow-sm shrink-0">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-white">SYSTEMS OPTIMAL</span>
          </div>
        </div>
      </header>

      {/* Sub-Header bar with navigation persona swaps */}
      <div className="bg-white border-b border-slate-200 py-3 px-6 md:px-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <p className="text-xs font-semibold text-slate-700 font-sans">
            Switch View Mode:
          </p>
        </div>
        {/* Persona Swapping Rails */}
        <div className="bg-slate-100 border border-slate-200 p-1 rounded-xl flex gap-1 shadow-inner max-w-max shrink-0">
          <button
            onClick={() => setPersona('operator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              persona === 'operator'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Venue Operator
          </button>
          <button
            onClick={() => setPersona('fan')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              persona === 'fan'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Spectator Hub
          </button>
          <button
            onClick={() => setPersona('volunteer')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              persona === 'volunteer'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Volunteer Desk
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 relative z-10">
        
        {/* Dynamic Warning Alert Bar if any high emergency is active */}
        {activeIncidents.some((i) => i.severity === 'high') && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-xs font-sans animate-pulse shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                <strong>Attention:</strong> High severity anomaly detected at ticket gateways. Open the operator advisory board below to trigger AI mitigation plans.
              </span>
            </div>
            <span className="hidden sm:inline font-mono uppercase bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold text-red-700">
              CRITICAL STATE
            </span>
          </div>
        )}

        {/* PERSOAN SWITCHED VIEWS */}
        {persona === 'operator' && (
          <div className="space-y-6">
            
            {/* Split row: Interactive Map & Live telemetry values */}
            <StadiumMap
              sectors={stadiumState.sectors}
              incidents={stadiumState.incidents}
              selectedSectorId={selectedSectorId}
              onSelectSector={setSelectedSectorId}
            />

            {/* Main simulation controller & advisory system */}
            <OperatorPanel
              stadiumState={stadiumState}
              onRefreshState={fetchStadiumState}
              onResolveIncident={handleResolveIncident}
              onReportIncident={handleReportIncident}
            />

            {/* Sustainability offsets and grid trackers */}
            <SustainabilityTracker metrics={stadiumState.sustainability} />

            {/* PHASE 3: Live Real Data & Enterprise Integration Matrix */}
            <RealDataIntegrationsHub />

          </div>
        )}

        {persona === 'fan' && (
          <div className="space-y-6">
            
            {/* Fan Concierge Chat (multilingual bot) + Interactive Wayfinding Guide */}
            <FanConcierge />

            {/* Stadium Visual locator */}
            <div className="space-y-3">
              <div>
                <h3 className="font-display font-semibold text-slate-800 text-base">Explore Your Stand Coordinates</h3>
                <p className="text-xs text-slate-500 mt-0.5">Understand seating clusters and accessibility entrances inside the arena loop.</p>
              </div>
              <StadiumMap
                sectors={stadiumState.sectors}
                incidents={stadiumState.incidents}
                selectedSectorId={selectedSectorId}
                onSelectSector={setSelectedSectorId}
              />
            </div>

          </div>
        )}

        {persona === 'volunteer' && (
          <div className="space-y-6">
            
            {/* Volunteer Assigned tasks & multilingual translation desk */}
            <VolunteerTasks
              stadiumState={stadiumState}
              onCompleteTask={handleCompleteTask}
            />

            {/* Mini map to coordinate locations */}
            <div className="space-y-3">
              <div>
                <h3 className="font-display font-semibold text-slate-800 text-base">Incidents & Sectors Locator Map</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Track where emergency and support tasks are located.</p>
              </div>
              <StadiumMap
                sectors={stadiumState.sectors}
                incidents={stadiumState.incidents}
                selectedSectorId={selectedSectorId}
                onSelectSector={setSelectedSectorId}
              />
            </div>

          </div>
        )}

      </main>

      {/* footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 md:px-8 mt-12 text-center text-xs text-slate-500 font-sans shadow-sm">
        <p>&copy; 2026 FIFA World Cup™ Stadium Operations & Fan Assistant Console. Powered by Google AI Studio & Gemini.</p>
        <p className="mt-1 font-mono text-[10px] text-slate-400">Environment: Cloud Run Container • Port: 3000 • Live Telemetry Stream Enabled</p>
      </footer>

    </div>
  );
}
