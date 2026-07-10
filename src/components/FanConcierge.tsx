/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, Send, Bot, User, Compass, HelpCircle, Shield, Sparkles, Navigation, Accessibility, Footprints, AlertCircle, RefreshCw } from 'lucide-react';

const SUGGESTED_QUERIES = [
  { text: 'Clear bag policy rules', icon: Shield },
  { text: ' Sensory room location', icon: Accessibility },
  { text: 'Deposit on reusable cups', icon: Footprints },
  { text: "Translate 'Please step forward' to Spanish", icon: Bot },
];

const ENTRANCES = [
  { id: 'gate-a', name: 'Gate A (North Stand)' },
  { id: 'gate-c', name: 'Gate C (East Stand)' },
  { id: 'gate-e', name: 'Gate E (South Stand)' },
  { id: 'gate-f', name: 'Gate F (West Stand)' },
];

const DESTINATIONS = [
  { id: 'north', name: 'North Stand (Sections 101-109)' },
  { id: 'east', name: 'East Stand (Sections 110-120)' },
  { id: 'south', name: 'South Stand (Sections 121-130)' },
  { id: 'west', name: 'West Stand (Sections 131-140)' },
  { id: 'vip', name: 'VIP Pavilion & Suites' },
  { id: 'transit', name: 'Metropolitan Transit Plaza' },
];

export default function FanConcierge() {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! Hola! Bonjour! I am your official 2026 FIFA World Cup Smart Venue Assistant. Ask me anything about transport shuttles, clear bag rules, wheelchair accessibility, or eco-friendly concessions in English, Spanish, French, or any other language!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Wayfinding state
  const [startGate, setStartGate] = useState('gate-a');
  const [targetDest, setTargetDest] = useState('north');
  const [routeInfo, setRouteInfo] = useState<any>(null);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle send message
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const historyToSend = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: data.content,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'model',
          content: 'I am experiencing a temporary connection lag with stadium control. Please try asking again in a moment.',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Compute local step-by-step route
  const handleCalculateRoute = () => {
    // Generate simple, logical mock pathing directions
    let steps: string[] = [];
    let accessNotes: string = '';
    let ecoNotes: string = '';

    const gateName = ENTRANCES.find((g) => g.id === startGate)?.name || 'Entrance';
    const destName = DESTINATIONS.find((d) => d.id === targetDest)?.name || 'Destination';

    steps.push(`Pass through safety detectors at ${gateName}. (Have your digital WC-2026 Mobile Pass ready).`);

    if (startGate === 'gate-a') {
      if (targetDest === 'north') {
        steps.push('Walk straight through the North Concourse for 30 meters.');
        steps.push('Your section access ramp is on the left hand side next to Organic Pitch Eats.');
        accessNotes = 'Ramp has a gentle 5-degree slope. Companion toilets are available directly opposite Section 104.';
        ecoNotes = 'Dispose of compostable food wraps in the green bins right outside your ramp entrance.';
      } else if (targetDest === 'west') {
        steps.push('After security, turn right and follow the interior concourse curve.');
        steps.push('Pass Section 105; West Stand access ramps begin in 80 meters.');
        accessNotes = 'Elevator 2 (North-West Concourse) is active for wheelchair seating access on the upper tiers.';
        ecoNotes = 'There is a Reusable Cup Refund Station at the West Corridor intersection. Return cups to receive $2 back.';
      } else {
        steps.push('After safety clearance, follow the yellow floor arrows marked CONCOURSE LOOP clockwise.');
        steps.push(`Continue past the North concession plazas until you reach the main entrances for ${destName}.`);
        accessNotes = 'Wheelchair-friendly golf-shuttles operate frequently along the external ring for fans with mobility passes.';
        ecoNotes = 'This route passes the Solar Canopy Sector which powers 30% of the stadium lights.';
      }
    } else if (startGate === 'gate-f') {
      if (targetDest === 'west') {
        steps.push('Enter through the West Concourse archways.');
        steps.push('Section entry portals 131-140 are immediately ahead.');
        accessNotes = 'The main Stadium Sensory Room is directly behind Section 102. Request complimentary noise-canceling headsets from volunteer staff.';
        ecoNotes = 'Eco-Burger stands in this concourse use 100% starched bamboo cutlery. Please compost after use.';
      } else {
        steps.push('After security screening, follow the green arrows for CONCOURSE LOOP anti-clockwise.');
        steps.push(`Walk past the West seating gates until you arrive at ${destName}.`);
        accessNotes = 'Tactile tiles are placed on the path to guide visually-impaired spectators towards accessible exits.';
        ecoNotes = 'Rerouting past the zero-waste water hydration stations. Refill your soft-sided bottle for free!';
      }
    } else {
      steps.push(`Proceed past the ${gateName} service desks.`);
      steps.push(`Head towards the inner ring and walk towards ${destName} following the overhead display signals.`);
      accessNotes = 'Priority elevators and ramps are operational at this gate entrance. Assistive listening devices are available at Guest Services.';
      ecoNotes = 'Green composting drop-offs are operational every 20 meters.';
    }

    setRouteInfo({
      gateName,
      destName,
      steps,
      accessNotes,
      ecoNotes,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="stadium-fan-hub">
      
      {/* Smart Multilingual Assistant Chat */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-150 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-850 text-sm">Smart Multilingual Assistant</h3>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">FIFA World Cup 2026 Concierge • Gemini Active</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-mono text-[10px] px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Multilingual AI
          </span>
        </div>

        {/* Message Stage */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-blue-50 text-blue-900 border-blue-100'
              }`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Balloon */}
              <div className={`rounded-2xl px-4 py-2.5 text-xs font-sans leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-900 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
              }`}>
                {msg.content}
                <div className="text-[8px] opacity-55 font-mono mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Translating response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Query Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-150 overflow-x-auto flex gap-2 scrollbar-none whitespace-nowrap">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full px-3 py-1.5 text-[10px] font-sans transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              <q.icon className="w-3 h-3 text-blue-900" />
              {q.text}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50/50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your question in any language (e.g., Where is Gate E?)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            className="flex-1 bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-sans shadow-sm"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || loading}
            className="bg-blue-900 hover:bg-blue-850 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Wayfinding & Accessibility Routing Guide */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[520px]">
        <div>
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
              <Compass className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm">Interactive Wayfinding Guide</h3>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">Find step-free routes, sensory zones, and composting points.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Start Gate dropdown */}
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Select Your Entrance Gate</label>
              <select
                value={startGate}
                onChange={(e) => setStartGate(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-sans cursor-pointer shadow-sm"
              >
                {ENTRANCES.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Target Destination dropdown */}
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Select Your Seat Section</label>
              <select
                value={targetDest}
                onChange={(e) => setTargetDest(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-sans cursor-pointer shadow-sm"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalculateRoute}
              className="w-full bg-slate-800 hover:bg-slate-950 text-white font-semibold font-sans text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-500" />
              Calculate Smart Route
            </button>
          </div>
        </div>

        {/* Route Output Area */}
        <div className="flex-1 mt-4 overflow-y-auto pr-1">
          {!routeInfo ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 px-4 py-8">
              <Compass className="w-12 h-12 text-slate-300 mb-2 animate-pulse" />
              <p className="text-xs font-sans text-slate-500">Choose your starting gate and stand above to compute a step-by-step custom stadium trajectory.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 shadow-sm">
                <div className="font-semibold text-slate-800 border-b border-slate-200 pb-1.5 mb-1.5 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  Your Route Directions
                </div>
                <div className="space-y-2">
                  {routeInfo.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-2 text-slate-700">
                      <span className="font-mono text-amber-600 font-bold shrink-0">{idx + 1}.</span>
                      <p className="font-sans leading-normal">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility warning card */}
              {routeInfo.accessNotes && (
                <div className="bg-amber-50 border border-amber-150 rounded-lg p-3 flex gap-2 shadow-sm text-amber-900">
                  <Accessibility className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-700 block mb-0.5">Accessibility Assist</span>
                    <p className="text-amber-800 font-sans leading-normal text-[11px]">{routeInfo.accessNotes}</p>
                  </div>
                </div>
              )}

              {/* Eco tip card */}
              {routeInfo.ecoNotes && (
                <div className="bg-emerald-50 border border-emerald-150 rounded-lg p-3 flex gap-2 shadow-sm text-emerald-900">
                  <Footprints className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-700 block mb-0.5">Sustainability Step</span>
                    <p className="text-emerald-800 font-sans leading-normal text-[11px]">{routeInfo.ecoNotes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
