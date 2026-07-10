/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sector, Incident, CrowdLevel } from '../types';
import { AlertTriangle, Shield, CheckCircle, Users, Coffee, Footprints } from 'lucide-react';

interface StadiumMapProps {
  sectors: Sector[];
  incidents: Incident[];
  selectedSectorId: string | null;
  onSelectSector: (id: string) => void;
}

export default function StadiumMap({
  sectors,
  incidents,
  selectedSectorId,
  onSelectSector,
}: StadiumMapProps) {
  
  // Helper to retrieve color scheme of a sector based on crowd density
  const getCrowdColors = (level: CrowdLevel, isSelected: boolean) => {
    const baseClass = isSelected ? 'ring-2 ring-brand-gold stroke-2' : 'stroke-1';
    switch (level) {
      case 'overcrowded':
        return {
          fill: 'fill-red-500/10 hover:fill-red-500/20',
          stroke: 'stroke-red-500',
          badge: 'bg-red-50 text-red-700 border-red-200',
          pulse: 'animate-pulse',
          bgGlow: 'bg-red-50/50',
          borderAccent: 'border-red-200',
        };
      case 'busy':
        return {
          fill: 'fill-amber-500/10 hover:fill-amber-500/20',
          stroke: 'stroke-amber-500',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          pulse: '',
          bgGlow: 'bg-amber-50/50',
          borderAccent: 'border-amber-200',
        };
      case 'normal':
      default:
        return {
          fill: 'fill-emerald-500/5 hover:fill-emerald-500/15',
          stroke: 'stroke-emerald-500/70',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          pulse: '',
          bgGlow: 'bg-emerald-50/40',
          borderAccent: 'border-emerald-200',
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden" id="stadium-map-widget">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between mb-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-800 tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Stadium Layout & Sector Telemetry
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Click on any region below to review crowd thresholds, green menu concessions, and local accessibility metrics.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Normal (&lt;60%)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Busy (60-85%)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Overcrowded (&gt;85%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Interactive SVG Render Stage */}
        <div className="lg:col-span-7 flex items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-inner">
          <svg
            viewBox="0 0 500 360"
            className="w-full h-auto max-h-[300px] drop-shadow-[0_0_15px_rgba(16,185,129,0.05)]"
          >
            {/* Outer Ring Athletics Track (Aesthetic Backdrop) */}
            <ellipse
              cx="250"
              cy="165"
              rx="235"
              ry="145"
              className="fill-none stroke-slate-200 stroke-2"
            />
            <ellipse
              cx="250"
              cy="165"
              rx="225"
              ry="135"
              className="fill-none stroke-slate-200/50 stroke-1 stroke-dasharray-[4,4]"
            />

            {/* SECTOR: Metropolitan Transit Plaza (External Connector) */}
            {(() => {
              const sec = sectors.find(s => s.id === 'transit')!;
              const colors = getCrowdColors(sec?.crowdLevel || 'normal', selectedSectorId === 'transit');
              return (
                <g className="cursor-pointer" onClick={() => onSelectSector('transit')}>
                  <rect
                    x="20"
                    y="290"
                    width="110"
                    height="50"
                    rx="8"
                    className={`${colors.fill} ${colors.stroke} transition-all duration-300 stroke-[1.5] ${selectedSectorId === 'transit' ? 'stroke-brand-gold stroke-2 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]' : ''}`}
                  />
                  <text
                    x="75"
                    y="320"
                    textAnchor="middle"
                    className="fill-slate-600 font-display text-[10px] font-medium tracking-wide uppercase pointer-events-none"
                  >
                    Transit Hub
                  </text>
                  {/* Incident warning overlay */}
                  {incidents.some(i => i.sectorId === 'transit' && i.status === 'active') && (
                    <circle cx="115" cy="295" r="8" className="fill-red-500 animate-ping" />
                  )}
                  {incidents.some(i => i.sectorId === 'transit' && i.status === 'active') && (
                    <g transform="translate(110, 290)">
                      <polygon points="5,0 10,9 0,9" className="fill-brand-gold stroke-red-600 stroke-[0.5]" />
                    </g>
                  )}
                </g>
              );
            })()}

            {/* Soccer Pitch Centerpiece */}
            <g className="opacity-85 pointer-events-none">
              {/* Green Field */}
              <rect
                x="150"
                y="115"
                width="200"
                height="100"
                rx="4"
                className="fill-slate-100 stroke-slate-300 stroke-1"
              />
              {/* Field Grass Stripes */}
              <line x1="175" y1="115" x2="175" y2="215" className="stroke-slate-200/40 stroke-[25]" />
              <line x1="225" y1="115" x2="225" y2="215" className="stroke-slate-200/40 stroke-[25]" />
              <line x1="275" y1="115" x2="275" y2="215" className="stroke-slate-200/40 stroke-[25]" />
              <line x1="325" y1="115" x2="325" y2="215" className="stroke-slate-200/40 stroke-[25]" />

              <rect
                x="150"
                y="115"
                width="200"
                height="100"
                fill="none"
                className="stroke-emerald-600/20 stroke-1.5"
              />
              {/* Center Circle */}
              <circle
                cx="250"
                cy="165"
                r="25"
                fill="none"
                className="stroke-emerald-600/20 stroke-1.5"
              />
              <circle cx="250" cy="165" r="1.5" className="fill-emerald-500" />
              {/* Half-line */}
              <line
                x1="250"
                y1="115"
                x2="250"
                y2="215"
                className="stroke-emerald-600/20 stroke-1.5"
              />
              {/* Penalty Boxes */}
              <rect
                x="150"
                y="140"
                width="25"
                height="50"
                fill="none"
                className="stroke-emerald-600/20 stroke-1.5"
              />
              <rect
                x="325"
                y="140"
                width="25"
                height="50"
                fill="none"
                className="stroke-emerald-600/20 stroke-1.5"
              />
              {/* Goals */}
              <line x1="147" y1="155" x2="147" y2="175" className="stroke-slate-400 stroke-2" />
              <line x1="353" y1="155" x2="353" y2="175" className="stroke-slate-400 stroke-2" />
            </g>

            {/* SECTORS: Stands surrounding the pitch */}
            {[
              {
                id: 'north',
                name: 'North Stand',
                points: '120,40 380,40 340,95 160,95',
                labelX: 250,
                labelY: 65,
                incX: 350,
                incY: 55,
              },
              {
                id: 'east',
                name: 'East Stand',
                points: '395,50 460,105 460,225 395,280 355,200 355,130',
                labelX: 410,
                labelY: 170,
                incX: 435,
                incY: 130,
              },
              {
                id: 'south',
                name: 'South Stand',
                points: '120,290 380,290 340,235 160,235',
                labelX: 250,
                labelY: 265,
                incX: 140,
                incY: 275,
              },
              {
                id: 'west',
                name: 'West Stand',
                points: '105,50 40,105 40,225 105,280 145,200 145,130',
                labelX: 90,
                labelY: 170,
                incX: 65,
                incY: 130,
              },
              {
                id: 'vip',
                name: 'VIP Suites',
                points: '170,10 330,10 320,32 180,32',
                labelX: 250,
                labelY: 21,
                incX: 310,
                incY: 20,
              },
            ].map((s) => {
              const sec = sectors.find(item => item.id === s.id)!;
              const colors = getCrowdColors(sec?.crowdLevel || 'normal', selectedSectorId === s.id);
              const isSelected = selectedSectorId === s.id;
              
              return (
                <g key={s.id} className="cursor-pointer" onClick={() => onSelectSector(s.id)}>
                  {/* Sector Polygon block */}
                  <polygon
                    points={s.points}
                    className={`${colors.fill} ${colors.stroke} ${colors.pulse} transition-all duration-300 stroke-[1.5] ${isSelected ? 'stroke-brand-gold stroke-[2.5] filter drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]' : ''}`}
                  />
                  {/* Label */}
                  <text
                    x={s.labelX}
                    y={s.labelY}
                    textAnchor="middle"
                    className={`font-display text-[9px] font-bold tracking-wide pointer-events-none ${isSelected ? 'fill-brand-gold' : 'fill-slate-800'}`}
                  >
                    {s.name}
                  </text>
                  <text
                    x={s.labelX}
                    y={s.labelY + 10}
                    textAnchor="middle"
                    className="font-mono text-[8px] fill-slate-500 pointer-events-none"
                  >
                    {sec ? `${sec.occupancyPercent}%` : ''}
                  </text>

                  {/* Incident warning overlay */}
                  {incidents.some(i => i.sectorId === s.id && i.status === 'active') && (
                    <g transform={`translate(${s.incX}, ${s.incY})`}>
                      <circle cx="0" cy="0" r="10" className="fill-red-500/20 stroke-red-500 stroke-1 animate-pulse" />
                      <path d="M-4,3 L0,-5 L4,3 Z" className="fill-brand-gold stroke-red-600 stroke-[0.5]" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Sector Panel Details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          {(() => {
            const currentSector = sectors.find(s => s.id === (selectedSectorId || 'north'));
            if (!currentSector) return null;

            const activeSectIncidents = incidents.filter(i => i.sectorId === currentSector.id && i.status === 'active');
            const colorMeta = getCrowdColors(currentSector.crowdLevel, true);

            return (
              <div className={`flex-1 flex flex-col justify-between border rounded-xl p-4 transition-all duration-300 ${colorMeta.bgGlow} ${colorMeta.borderAccent}`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-wider text-brand-gold uppercase">
                        Sector Profile
                      </span>
                      <h3 className="font-display font-bold text-slate-800 text-base">
                        {currentSector.name}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-mono border px-2 py-0.5 rounded uppercase tracking-wider font-semibold ${colorMeta.badge}`}>
                      {currentSector.crowdLevel}
                    </span>
                  </div>

                  {/* Telemetry rows */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded border border-slate-200 p-2 text-center shadow-sm">
                      <div className="text-[9px] text-slate-500 font-sans uppercase">Live Load</div>
                      <div className="text-sm font-mono font-bold text-emerald-600 mt-0.5">
                        {currentSector.occupancyPercent}%
                      </div>
                    </div>
                    <div className="bg-white rounded border border-slate-200 p-2 text-center shadow-sm">
                      <div className="text-[9px] text-slate-500 font-sans uppercase">CO2 Offset</div>
                      <div className="text-sm font-mono font-bold text-slate-800 mt-0.5 flex items-center justify-center gap-1">
                        <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                        {currentSector.co2OffsetKg}kg
                      </div>
                    </div>
                  </div>

                  {/* Accessibility & Safety section */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[10px] font-bold text-slate-600 tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-brand-gold" />
                      Accessibility & Facilities
                    </div>
                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed shadow-sm">
                      {currentSector.accessibilityStatus}
                    </p>
                  </div>

                  {/* Concession section */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-600 tracking-wider flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-emerald-600" />
                      Concession: {currentSector.concessionType}
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 space-y-1.5 shadow-sm">
                      {currentSector.menu.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-slate-700 flex items-center gap-1">
                            {item.item}
                            {item.sustainable && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded border border-emerald-200 font-mono">
                                Eco
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-slate-500">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Local Sector Alerts list */}
                {activeSectIncidents.length > 0 && (
                  <div className="mt-4 border-t border-red-200 pt-3">
                    <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Active Sector Anomalies ({activeSectIncidents.length})
                    </span>
                    <div className="space-y-1.5">
                      {activeSectIncidents.map(inc => (
                        <div key={inc.id} className="text-[11px] bg-red-50 text-red-800 border border-red-100 p-2 rounded leading-normal shadow-sm">
                          <div className="font-semibold">{inc.title}</div>
                          <div className="opacity-90 text-[10px] mt-0.5">{inc.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
