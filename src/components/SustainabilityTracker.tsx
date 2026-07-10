/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SustainabilityMetrics } from '../types';
import { Footprints, Droplets, Sun, Recycle, HelpCircle, Award } from 'lucide-react';

interface SustainabilityTrackerProps {
  metrics: SustainabilityMetrics;
}

export default function SustainabilityTracker({ metrics }: SustainabilityTrackerProps) {
  // Goals for calculations
  const recycleGoal = 5000;
  const waterGoal = 15000;
  const solarGoal = 10000;

  // Calculate carbon footprint offset from reusable cups (approx 120 grams per reuse)
  const co2SavedKg = ((metrics.reusableCupsActive * 120) / 1000).toFixed(1);

  // Percentages
  const recyclePct = Math.min(100, Math.round((metrics.recycledKg / recycleGoal) * 100));
  const waterPct = Math.min(100, Math.round((metrics.waterSavedLiters / waterGoal) * 100));
  const solarPct = Math.min(100, Math.round((metrics.solarEnergyKwh / solarGoal) * 100));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden" id="sustainability-dashboard">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-800 tracking-wide flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            2026 Eco-Stadium Sustainability Monitor
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Tracking resource offsets, solar microgrids, and the reusable cup deposit scheme.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-sm">
          <Footprints className="w-4 h-4" />
          <span>Total CO₂ Saved: {co2SavedKg} kg</span>
        </div>
      </div>

      {/* Grid of Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Reusable Cups Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                REUSABLE CUP SCHEME
              </span>
              <div className="text-xl font-mono font-bold text-slate-800">
                {metrics.reusableCupsActive.toLocaleString()}
              </div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <Recycle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-[11px] text-slate-550 font-sans mt-3 leading-relaxed border-t border-slate-200/60 pt-2">
            Fans receive $2 refund per cup. Direct carbon displacement offset is active.
          </p>
        </div>

        {/* Recycling Progress */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  WASTE RECYCLED
                </span>
                <div className="text-xl font-mono font-bold text-slate-800">
                  {metrics.recycledKg.toLocaleString()} / {recycleGoal} kg
                </div>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                <Recycle className="w-4 h-4 text-amber-600 animate-spin-slow" />
              </div>
            </div>
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${recyclePct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Progress</span>
                <span>{recyclePct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rainwater Conservation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  RAINWATER CONSERVED
                </span>
                <div className="text-xl font-mono font-bold text-slate-800">
                  {metrics.waterSavedLiters.toLocaleString()} / {waterGoal} L
                </div>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${waterPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Progress</span>
                <span>{waterPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Solar Energy */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  SOLAR GRID HARVEST
                </span>
                <div className="text-xl font-mono font-bold text-slate-800">
                  {metrics.solarEnergyKwh.toLocaleString()} / {solarGoal} kWh
                </div>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <Sun className="w-4 h-4 text-yellow-600 animate-pulse" />
              </div>
            </div>
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${solarPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Progress</span>
                <span>{solarPct}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sustainable Footnote Info */}
      <div className="mt-5 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-xs text-slate-550 shadow-sm">
        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="font-sans leading-normal">
          Organic composting and recycled water supplies are managed dynamically based on sector density metrics. Complete volunteer duties to boost offsets.
        </p>
      </div>

    </div>
  );
}
