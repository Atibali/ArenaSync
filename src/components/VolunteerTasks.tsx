/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task, StadiumState } from '../types';
import { ClipboardList, CheckCircle2, User, MapPin, Sparkles, Languages, Volume2, HelpCircle, RefreshCw } from 'lucide-react';

interface VolunteerTasksProps {
  stadiumState: StadiumState;
  onCompleteTask: (taskId: string) => Promise<void>;
}

const COMMON_PHRASES = [
  'Welcome to the FIFA World Cup 2026!',
  'Please present your digital match ticket.',
  'Bags must be clear plastic. No large backpacks are allowed.',
  'Step-free elevator access is located to your left.',
  'Bring your empty reusable cup here to claim your $2 deposit refund.',
  'Please form a queue here in this corridor.',
  'Sensory rooms and sensory headsets are available free-of-charge.',
];

const TARGET_LANGUAGES = [
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'de', name: 'German (Deutsch)' },
];

export default function VolunteerTasks({ stadiumState, onCompleteTask }: VolunteerTasksProps) {
  const [selectedPhrase, setSelectedPhrase] = useState(COMMON_PHRASES[0]);
  const [targetLang, setTargetLang] = useState('es');
  const [translationResult, setTranslationResult] = useState('');
  const [translationLoading, setTranslationLoading] = useState(false);

  // Trigger phrase translation via server-side Gemini
  const handleTranslatePhrase = async () => {
    setTranslationLoading(true);
    setTranslationResult('');
    const langName = TARGET_LANGUAGES.find((l) => l.code === targetLang)?.name || 'target language';
    
    const promptText = `
      I am a FIFA volunteer at the 2026 World Cup stadium.
      Please translate this exact phrase: "${selectedPhrase}" into ${langName}.
      Provide:
      1. The precise translation.
      2. A simple, step-by-step phonetic pronunciation guide in brackets so I can read and say it aloud to a foreign spectator easily.
      Keep it brief and friendly.
    `;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: promptText }
          ]
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTranslationResult(data.content);
      } else {
        setTranslationResult('Failed to contact translation assistant.');
      }
    } catch (err) {
      console.error(err);
      setTranslationResult('Error generating translation.');
    } finally {
      setTranslationLoading(false);
    }
  };

  const pendingTasks = stadiumState.tasks.filter((t) => t.status === 'pending');
  const completedTasks = stadiumState.tasks.filter((t) => t.status === 'completed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="volunteer-desk-widget">
      
      {/* Volunteer Active Task Board */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[490px]">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                <ClipboardList className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm">Volunteer Dispatch Board</h3>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">Assigned service-level agreements and crowd assistance.</p>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              {pendingTasks.length} Pending Duties
            </span>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/40 mx-auto mb-2" />
              <p className="text-xs font-sans text-slate-600">All dispatched duties completed!</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Thank your volunteers for helping secure a green tournament.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {pendingTasks.map((task) => (
                <div key={task.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start justify-between gap-3 hover:border-slate-300 hover:bg-slate-100/50 transition-all shadow-sm">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{task.title}</h4>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] font-mono text-slate-400 uppercase pt-1">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {task.sectorId} Stand
                      </span>
                      <span className="flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5 text-slate-400" />
                        {task.assignedTo}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {completedTasks.length > 0 && (
          <div className="border-t border-slate-100 pt-2.5 mt-4 flex items-center justify-between text-[11px] text-slate-550 font-sans">
            <span>Completed volunteer duties during this shift:</span>
            <span className="font-mono text-slate-600 bg-slate-50 border border-slate-250 px-2 py-0.5 rounded text-[10px]">{completedTasks.length} tasks synced with Control</span>
          </div>
        )}
      </div>

      {/* Multilingual Translation Desk */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[490px]">
        <div>
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <Languages className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm">Volunteer Translation Desk</h3>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">Convert helpful stadium directions with phonetic guidelines.</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Common Phrases Select */}
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Select Directions Phrase</label>
              <select
                value={selectedPhrase}
                onChange={(e) => setSelectedPhrase(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-sans cursor-pointer shadow-sm"
              >
                {COMMON_PHRASES.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Target Language Select */}
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Select Spectator Language</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-sans cursor-pointer shadow-sm"
              >
                {TARGET_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleTranslatePhrase}
              disabled={translationLoading}
              className="w-full bg-slate-800 hover:bg-slate-950 disabled:bg-slate-200 text-white font-semibold font-sans text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              {translationLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span className="text-slate-600">Generating Translation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-bounce" />
                  Generate AI Translation & Guide
                </>
              )}
            </button>
          </div>
        </div>

        {/* Translation Output Frame */}
        <div className="flex-1 mt-4 overflow-y-auto">
          {!translationResult && !translationLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 px-4 py-8">
              <Volume2 className="w-10 h-10 text-slate-300 mb-2 animate-pulse" />
              <p className="text-[11px] font-sans text-slate-500">Pick an instruction phrase and tap translate to generate a clean, phonetic speaking card.</p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 h-full flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-900 uppercase block mb-1.5">
                  AI SPEAKING CARD
                </span>
                <p className="text-xs text-slate-700 font-sans leading-relaxed whitespace-pre-line">
                  {translationResult}
                </p>
              </div>
              <p className="text-[9px] text-slate-400 font-mono mt-3 text-right">
                Powered by Gemini-3.5-Flash
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
