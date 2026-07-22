/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Incident, StadiumState, Severity, ScenarioAnalysis, MatchPhase } from '../types';
import { AlertTriangle, Sparkles, Send, CheckCircle2, Clock, MapPin, RefreshCw, Volume2, Globe, FileText, Check, Play, Pause, Activity, Zap, Layers, Flame } from 'lucide-react';

interface OperatorPanelProps {
  stadiumState: StadiumState;
  onRefreshState: () => void;
  onResolveIncident: (incidentId: string) => Promise<void>;
  onReportIncident: (title: string, sectorId: string, severity: Severity, description: string) => Promise<void>;
}

interface AdvisoryResponse {
  summary: string;
  tacticalDirectives: string[];
  transitAdjustment: string;
  sustainabilityTip: string;
  announcementDrafts: {
    english: string;
    spanish: string;
    portuguese: string;
    french: string;
    arabic: string;
  };
}

const PRESET_INCIDENTS = [
  {
    title: 'Metro shuttle loop deadlock',
    sectorId: 'transit',
    severity: 'high' as Severity,
    description: 'Heavy vehicle backup in the transit circular lanes. Shuttle frequency has plummeted, raising transit queue times to 40 mins.',
  },
  {
    title: 'Heavy sector bottleneck',
    sectorId: 'west',
    severity: 'medium' as Severity,
    description: 'Spectators entering Sector 104 are standing in tight corridors, creating a safety crowding threshold breach.',
  },
  {
    title: 'Dehydration assist request',
    sectorId: 'south',
    severity: 'low' as Severity,
    description: 'High heat index at South Stand; spectator water queue is 15 minutes. Requests for more eco-compostable cooling cups.',
  },
];

export default function OperatorPanel({
  stadiumState,
  onRefreshState,
  onResolveIncident,
  onReportIncident,
}: OperatorPanelProps) {
  // New incident fields
  const [incTitle, setIncTitle] = useState('');
  const [incSector, setIncSector] = useState('north');
  const [incSeverity, setIncSeverity] = useState<Severity>('medium');
  const [incDesc, setIncDesc] = useState('');

  // AI Advisory state
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'spanish' | 'portuguese' | 'french' | 'arabic'>('english');
  const [copiedText, setCopiedText] = useState(false);
  const [broadcasted, setBroadcasted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Phase 2: What-If Scenario State
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<ScenarioAnalysis | null>(null);

  // Submit custom incident
  const handleCustomIncidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle || !incDesc) return;
    await onReportIncident(incTitle, incSector, incSeverity, incDesc);
    // Clear fields
    setIncTitle('');
    setIncDesc('');
  };

  // Pull GenAI Advisory
  const handleFetchAdvisory = async () => {
    setAdvisoryLoading(true);
    setAdvisory(null);
    setBroadcasted(false);
    try {
      const res = await fetch('/api/operations/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setAdvisory(data);
      } else {
        console.error('Failed to retrieve AI advisory');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdvisoryLoading(false);
    }
  };

  // Phase 2: Run What-If Scenario Simulation
  const handleRunScenario = async (phase: MatchPhase) => {
    setScenarioLoading(true);
    try {
      const res = await fetch('/api/operations/simulate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase }),
      });
      if (res.ok) {
        const data = await res.json();
        setScenarioResult(data.analysis);
        onRefreshState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScenarioLoading(false);
    }
  };

  // Web Speech API text-to-speech audio player
  const speakPAAnnouncement = (text: string, langKey: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser window.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const langCodeMap: Record<string, string> = {
      english: 'en-US',
      spanish: 'es-ES',
      portuguese: 'pt-BR',
      french: 'fr-FR',
      arabic: 'ar-SA',
    };
    utterance.lang = langCodeMap[langKey] || 'en-US';
    utterance.rate = 0.9; // clear, deliberate PA speaker pace

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Helper copy function
  const copyAnnouncementToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleBroadcast = () => {
    setBroadcasted(true);
    setTimeout(() => setBroadcasted(false), 3000);
  };

  const activeIncidents = stadiumState.incidents.filter((i) => i.status === 'active');
  const resolvedIncidents = stadiumState.incidents.filter((i) => i.status === 'resolved');

  return (
    <div className="space-y-6" id="stadium-operator-console">
      
      {/* PHASE 2: Matchday What-If Stress Simulator Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm">
                Matchday What-If Scenario Stress Simulator
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                Test stadium resilience under peak match conditions using Gemini predictive telemetry models.
              </p>
            </div>
          </div>
          {stadiumState.activeMatchPhase && (
            <span className="font-mono text-[10px] bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider font-semibold self-start sm:self-auto">
              Current Mode: {stadiumState.activeMatchPhase}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleRunScenario('pre_match')}
            disabled={scenarioLoading}
            className="bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl p-3 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Pre-Match Influx</span>
              <Activity className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-[10px] text-slate-500">T-90m gate pressure & transit influx</p>
          </button>

          <button
            onClick={() => handleRunScenario('halftime')}
            disabled={scenarioLoading}
            className="bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-xl p-3 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800">Halftime Surge</span>
              <Flame className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-[10px] text-slate-500">Concession queue & cup scheme surge</p>
          </button>

          <button
            onClick={() => handleRunScenario('post_match')}
            disabled={scenarioLoading}
            className="bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl p-3 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">Post-Match Exit</span>
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[10px] text-slate-500">Mass evacuation & bus fleet dispatch</p>
          </button>

          <button
            onClick={() => handleRunScenario('severe_weather')}
            disabled={scenarioLoading}
            className="bg-slate-50 hover:bg-red-50 hover:border-red-300 border border-slate-200 rounded-xl p-3 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 group-hover:text-red-800">Weather Protocol</span>
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            </div>
            <p className="text-[10px] text-slate-500">Sudden storm shelter & transit delay</p>
          </button>
        </div>

        {scenarioLoading && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-xs text-slate-600">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Simulating matchday physics and calculating crowd risk score...</span>
          </div>
        )}

        {scenarioResult && !scenarioLoading && (
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{scenarioResult.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">Risk Assessment Score:</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  scenarioResult.riskScore > 70 ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {scenarioResult.riskScore} / 100
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-sans leading-relaxed">
              {scenarioResult.aiCommentary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-mono font-bold text-slate-500 block mb-1">CRITICAL BOTTLENECKS</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                  {scenarioResult.crowdBottlenecks.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-mono font-bold text-slate-500 block mb-1">STAFF REDEPLOYMENT</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                  {scenarioResult.recommendedDeployments.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-mono font-bold text-slate-500 block mb-1">TRANSIT & ENERGY</span>
                <p className="text-[11px] text-slate-700 font-sans">{scenarioResult.transitDirective}</p>
                <p className="text-[10px] font-mono text-amber-700 mt-1">Energy Surge: +{scenarioResult.estimatedEnergySurgeKwh} kWh</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2026 AI Advisory & Strategic Command Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-800 tracking-wide">
                GenAI Operational Decision Advisor
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Real-time, schema-guaranteed tactical insights, sustainable offsets, and stadium announcements.
              </p>
            </div>
          </div>
          <button
            onClick={handleFetchAdvisory}
            disabled={advisoryLoading}
            className="mt-3 md:mt-0 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-850 disabled:bg-slate-200 text-white font-semibold font-sans text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {advisoryLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-slate-600">Synthesizing Telemetry...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-brand-gold animate-bounce" />
                Generate AI Command Advisory
              </>
            )}
          </button>
        </div>

        {advisoryLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-900 animate-spin" />
              <Sparkles className="w-4 h-4 text-brand-gold absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-sans font-medium text-slate-800">Retrieving Active Stadium States...</p>
              <p className="text-xs font-mono text-slate-400 mt-1">Calling Gemini-3.5-Flash Decision Models</p>
            </div>
          </div>
        )}

        {!advisoryLoading && !advisory && (
          <div className="border border-dashed border-slate-200 rounded-xl py-12 px-4 text-center">
            <Volume2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-sans text-slate-700">No active advisory compiled yet.</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Simulate some incidents below, then tap the advisor button to get real-time crowd control plans and translations.
            </p>
          </div>
        )}

        {advisory && (
          <div className="space-y-6 relative z-10 animate-fade-in">
            {/* Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-[10px] font-mono font-bold tracking-wider text-blue-900 uppercase block mb-1">
                EXECUTIVE SUMMARY
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {advisory.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tactical Directives */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-900 uppercase block mb-3">
                  TACTICAL DIRECTIVES FOR STAFF
                </span>
                <div className="space-y-2.5">
                  {advisory.tacticalDirectives.map((dir, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-5 h-5 rounded bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed font-sans">{dir}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource & Sustainable Adjustments */}
              <div className="space-y-4">
                {/* Transit Adjustment */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-blue-900 uppercase block mb-1">
                    AI TRANSIT INTERVENTION
                  </span>
                  <p className="text-xs text-slate-700 font-sans leading-relaxed">
                    {advisory.transitAdjustment}
                  </p>
                </div>

                {/* Sustainability Offset tip */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-700 uppercase block mb-1">
                    SUSTAINABLE LOGISTICS TIP
                  </span>
                  <p className="text-xs text-emerald-800 font-sans leading-relaxed">
                    {advisory.sustainabilityTip}
                  </p>
                </div>
              </div>
            </div>

            {/* PA Announcement Translator & Web Speech Synthesizer */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-2.5 mb-3 gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  Multilingual Stadium PA Broadcast Board
                </span>
                <div className="flex flex-wrap gap-1">
                  {(['english', 'spanish', 'portuguese', 'french', 'arabic'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveTab(lang)}
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded border transition-all cursor-pointer ${
                        activeTab === lang
                          ? 'bg-blue-900 text-white border-blue-900 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-250 rounded p-3.5 relative shadow-sm">
                <p className="text-xs font-sans text-slate-800 leading-relaxed italic pr-24">
                  &ldquo;{advisory.announcementDrafts[activeTab]}&rdquo;
                </p>
                
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <button
                    onClick={() => speakPAAnnouncement(advisory.announcementDrafts[activeTab], activeTab)}
                    className={`p-1.5 rounded border transition-all text-[10px] flex items-center gap-1 cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                        : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                    }`}
                    title="Audio Speech Preview"
                  >
                    {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {isPlayingAudio ? 'Stop' : 'Audio'}
                  </button>

                  <button
                    onClick={() => copyAnnouncementToClipboard(advisory.announcementDrafts[activeTab])}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 hover:text-slate-900 transition-all text-[10px] flex items-center gap-1 cursor-pointer"
                    title="Copy Announcement"
                  >
                    {copiedText ? <Check className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3" />}
                    {copiedText ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={handleBroadcast}
                  className="bg-blue-900 hover:bg-blue-850 text-white font-sans text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {broadcasted ? 'Announcements Dispatched!' : 'Broadcast Live PA Feed'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simulator Section & Active Incident Logging */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Active Incident List */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-base">Active Operational Incidents</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Real-time venue failures needing volunteer coordination.</p>
              </div>
              <span className="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full font-mono border border-red-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                {activeIncidents.length} Active
              </span>
            </div>

            {activeIncidents.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-400/40 mx-auto mb-2" />
                <p className="text-sm font-sans text-slate-600">No active incidents reported.</p>
                <p className="text-xs mt-1">Stadium systems are fully nominal!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {activeIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={`border rounded-xl p-4 transition-all duration-200 bg-slate-50/50 ${
                      inc.severity === 'high'
                        ? 'border-red-200 hover:border-red-300'
                        : inc.severity === 'medium'
                        ? 'border-amber-200 hover:border-amber-300'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            inc.severity === 'high'
                              ? 'text-red-500'
                              : inc.severity === 'medium'
                              ? 'text-amber-500'
                              : 'text-slate-500'
                          }`}
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-800 leading-normal">
                            {inc.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-mono text-slate-500 mt-1 uppercase">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {inc.sectorId} Sector
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-sans mt-2 leading-relaxed">
                            {inc.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onResolveIncident(inc.id)}
                        className="bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-700 font-mono text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all hover:border-blue-900 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resolved Incidents Accordion Count */}
          {resolvedIncidents.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
              <span>Resolved Anomalies:</span>
              <span className="font-mono text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">{resolvedIncidents.length} logs archived</span>
            </div>
          )}
        </div>

        {/* Manual Scenario Injector */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-slate-800 text-base border-b border-slate-100 pb-3 mb-4">
            Inject Incident Scenario
          </h3>

          {/* Presets */}
          <div className="mb-5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block mb-2">
              QUICK SCENARIO INJECTORS
            </span>
            <div className="space-y-2">
              {PRESET_INCIDENTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onReportIncident(p.title, p.sectorId, p.severity, p.description)}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 p-2.5 rounded-lg transition-all text-xs flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2 pr-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.severity === 'high' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                    <div className="font-medium text-slate-700 group-hover:text-slate-950 truncate">
                      {p.title}
                    </div>
                  </div>
                  <span className="font-mono text-[9px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase">
                    + Inject
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Form */}
          <form onSubmit={handleCustomIncidentSubmit} className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block">
              REPORT CUSTOM EXCEPTION
            </span>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Incident Title</label>
              <input
                type="text"
                placeholder="e.g. Gate F backup, Lost item, Scanner down..."
                value={incTitle}
                onChange={(e) => setIncTitle(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-sans shadow-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Location Sector</label>
                <select
                  value={incSector}
                  onChange={(e) => setIncSector(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none transition-all font-sans cursor-pointer shadow-sm"
                >
                  <option value="north">North Stand</option>
                  <option value="east">East Stand</option>
                  <option value="south">South Stand</option>
                  <option value="west">West Stand</option>
                  <option value="vip">VIP Pavilion</option>
                  <option value="transit">Transit Hub</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Severity Level</label>
                <select
                  value={incSeverity}
                  onChange={(e) => setIncSeverity(e.target.value as Severity)}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none transition-all font-sans cursor-pointer shadow-sm"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Emergency</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Description / Details</label>
              <textarea
                placeholder="Describe what is happening and what resources are required..."
                value={incDesc}
                onChange={(e) => setIncDesc(e.target.value)}
                required
                rows={2}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-sans shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-850 text-white font-semibold font-sans text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Incident Alert
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
