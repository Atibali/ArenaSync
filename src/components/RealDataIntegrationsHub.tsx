import React, { useState, useEffect } from 'react';
import { RealWeatherData, LiveFifaNews } from '../types';
import {
  CloudSun,
  Radio,
  FileSpreadsheet,
  Globe,
  Database,
  CheckCircle2,
  ExternalLink,
  Cpu,
  RefreshCw,
  Sparkles,
  Download,
  Server,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Zap,
} from 'lucide-react';

export default function RealDataIntegrationsHub() {
  const [weather, setWeather] = useState<RealWeatherData | null>(null);
  const [news, setNews] = useState<LiveFifaNews | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  const fetchLiveWeather = async () => {
    setWeatherLoading(true);
    try {
      const res = await fetch('/api/weather/live');
      if (res.ok) {
        const data = await res.json();
        setWeather(data.weather);
      }
    } catch (err) {
      console.error('Failed to fetch live weather:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchLiveNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch('/api/operations/live-fifa-news');
      if (res.ok) {
        const data = await res.json();
        setNews(data.briefing);
      }
    } catch (err) {
      console.error('Failed to fetch live news:', err);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
    fetchLiveNews();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6" id="phase3-real-data-hub">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-900 text-white rounded-xl shadow-md">
            <Globe className="w-5 h-5 text-brand-gold animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-slate-800 text-base">
                Live Data & Enterprise Integration Hub
              </h2>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                Production-Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Live meteorological feeds, Gemini Search Grounding, exportable audit ledgers, and IoT protocol bridges.
            </p>
          </div>
        </div>

        {/* Audit Export Link */}
        <a
          href="/api/operations/export-ledger"
          download="FIFA_2026_Stadium_Ledger.csv"
          className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          Export Stadium Ledger (CSV)
        </a>
      </div>

      {/* Grid Row 1: Live Open-Meteo Weather API & Live Gemini Search News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Live Open-Meteo Weather Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-800">
                  Live Venue Weather (Open-Meteo REST API)
                </span>
              </div>
              <button
                onClick={fetchLiveWeather}
                disabled={weatherLoading}
                className="text-[10px] font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${weatherLoading ? 'animate-spin text-blue-600' : ''}`} />
                Refresh API
              </button>
            </div>

            {weather ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      {weather.temperatureF}°F ({weather.temperatureC}°C)
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold block font-sans">
                      {weather.weatherCondition}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {weather.location}
                    </span>
                    <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase inline-block mt-1">
                      {weather.isLive ? '● Live Sensor Feed' : 'Cached Feed'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="bg-white border border-slate-200 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 block font-mono flex items-center justify-center gap-1">
                      <Wind className="w-3 h-3 text-slate-400" /> Wind
                    </span>
                    <span className="font-bold text-slate-800 font-mono">{weather.windSpeedKmh} km/h</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 block font-mono flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-400" /> Rain
                    </span>
                    <span className="font-bold text-slate-800 font-mono">{weather.precipitationMm} mm</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 block font-mono flex items-center justify-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" /> UV Index
                    </span>
                    <span className="font-bold text-slate-800 font-mono">{weather.uvIndex} / 11</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">Connecting to Open-Meteo REST service...</div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 font-mono">
            API Endpoint: <code className="bg-white border border-slate-200 px-1 py-0.5 rounded text-slate-600">GET /api/weather/live</code>
          </p>
        </div>

        {/* Live Grounded Gemini World Cup News */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  Search-Grounded FIFA World Cup 2026 Directives
                </span>
              </div>
              <button
                onClick={fetchLiveNews}
                disabled={newsLoading}
                className="text-[10px] font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${newsLoading ? 'animate-spin text-blue-600' : ''}`} />
                Query Gemini Grounded
              </button>
            </div>

            {news ? (
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-900 block font-sans">
                  {news.headline}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                  {news.summary}
                </p>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">Querying Gemini Search Grounding...</div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Powered by Gemini-3.5-Flash</span>
            <span className="text-emerald-700 font-semibold">● Google Search Grounded</span>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Production Hardware & Data Integration Reference Table */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
          <Server className="w-4 h-4 text-slate-600" />
          Enterprise IoT & Stadium Hardware API Connectivity Guide
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Stadium Subsystem</th>
                <th className="p-3">Live Active API / Protocol</th>
                <th className="p-3">Production Enterprise Solution</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
              <tr>
                <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                  Meteorological Weather
                </td>
                <td className="p-3 font-mono text-[11px] text-blue-700">Open-Meteo REST API</td>
                <td className="p-3 text-slate-600">MetLife Stadium Live GPS Lat/Lon Weather Station</td>
                <td className="p-3">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    CONNECTED
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Grounded Intelligence
                </td>
                <td className="p-3 font-mono text-[11px] text-blue-700">Gemini 3.5 Flash Search</td>
                <td className="p-3 text-slate-600">Google GenAI SDK Grounding Pipeline</td>
                <td className="p-3">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    CONNECTED
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  Turnstile Optical Scanners
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">MQTT Broker / RTSP Video</td>
                <td className="p-3 text-slate-600">Dahua / Axis Optical Gates via MQTT (<code className="bg-slate-100 px-1 py-0.5 rounded">mqtt://turnstile.stadium.internal</code>)</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    READY TO HOOK
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Public Transit Feeds
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">GTFS Realtime Protocol</td>
                <td className="p-3 text-slate-600">NJ Transit / MTA Transit Feeds (<code className="bg-slate-100 px-1 py-0.5 rounded">/gtfs-rt/trip-updates</code>)</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    READY TO HOOK
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Smart Eco Cup Bins
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">Ultrasonic Micro-Sensors</td>
                <td className="p-3 text-slate-600">LoRaWAN Smart Bin Sensors to Server Telemetry Proxy</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    READY TO HOOK
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
