/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { StadiumState, Incident, Task, Sector, TransitStatus, SustainabilityMetrics } from './src/types';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI client (Server-Side Only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed data
const initialSectors: Sector[] = [
  {
    id: 'north',
    name: 'North Stand (Gate A & B)',
    crowdLevel: 'normal',
    concessionType: 'Organic Pitch Eats & Salads',
    menu: [
      { item: 'Sustainable Quinoa Wrap', price: 12.5, sustainable: true, co2OffsetGrams: 420 },
      { item: 'Organic Energy Smoothie', price: 7.5, sustainable: true, co2OffsetGrams: 200 },
      { item: 'Zero-Waste Cup Soda', price: 4.5, sustainable: true, co2OffsetGrams: 150 },
    ],
    accessibilityStatus: 'Elevator and wheelchair ramp fully operational at Gate A.',
    co2OffsetKg: 450,
    sensorCount: 12,
    occupancyPercent: 55,
  },
  {
    id: 'east',
    name: 'East Stand (Gate C & D)',
    crowdLevel: 'busy',
    concessionType: 'Zero-Plastic Beverage Plaza',
    menu: [
      { item: 'Rainwater-Brewed Local Ale', price: 9.0, sustainable: true, co2OffsetGrams: 300 },
      { item: 'Biodegradable Craft Cider', price: 9.5, sustainable: true, co2OffsetGrams: 280 },
      { item: 'Local Vegan Hot Dog', price: 11.0, sustainable: true, co2OffsetGrams: 510 },
    ],
    accessibilityStatus: 'Tactile paving leading to Sectors 112-124. Accessible seating available.',
    co2OffsetKg: 310,
    sensorCount: 14,
    occupancyPercent: 82,
  },
  {
    id: 'south',
    name: 'South Stand (Gate E)',
    crowdLevel: 'normal',
    concessionType: 'Green Field Bowls',
    menu: [
      { item: 'Sustainable Falafel Plate', price: 13.0, sustainable: true, co2OffsetGrams: 480 },
      { item: 'Compostable Fresh Fruit Cup', price: 6.0, sustainable: true, co2OffsetGrams: 220 },
      { item: 'Returnable-Cup Lemonade', price: 5.0, sustainable: true, co2OffsetGrams: 180 },
    ],
    accessibilityStatus: 'Hearing loop systems active. Accessible restrooms on Concourse level.',
    co2OffsetKg: 520,
    sensorCount: 10,
    occupancyPercent: 42,
  },
  {
    id: 'west',
    name: 'West Stand (Gate F)',
    crowdLevel: 'overcrowded',
    concessionType: 'Eco-Burgers & Clean Fries',
    menu: [
      { item: 'Plant-Based Stadium Burger', price: 14.0, sustainable: true, co2OffsetGrams: 650 },
      { item: 'Zero-Emission Crinkle Fries', price: 5.5, sustainable: true, co2OffsetGrams: 250 },
      { item: 'Fair-Trade Iced Coffee', price: 6.0, sustainable: true, co2OffsetGrams: 190 },
    ],
    accessibilityStatus: 'Sensory Room situated behind Section 102. Easy ramp access.',
    co2OffsetKg: 280,
    sensorCount: 16,
    occupancyPercent: 94,
  },
  {
    id: 'vip',
    name: 'VIP Pavilion & Media Suites',
    crowdLevel: 'normal',
    concessionType: 'Solar Gourmet Bistro',
    menu: [
      { item: 'Local Artisanal Cheese Board', price: 25.0, sustainable: true, co2OffsetGrams: 350 },
      { item: 'Organic Vine Cabernet', price: 18.0, sustainable: true, co2OffsetGrams: 400 },
      { item: 'Solar-Baked Lemon Tart', price: 10.0, sustainable: true, co2OffsetGrams: 210 },
    ],
    accessibilityStatus: 'VIP Concierge Elevator fully active. Assisted hearing packs ready.',
    co2OffsetKg: 120,
    sensorCount: 8,
    occupancyPercent: 48,
  },
  {
    id: 'transit',
    name: 'Metropolitan Transit Plaza',
    crowdLevel: 'busy',
    concessionType: 'Eco-Transit Espresso',
    menu: [
      { item: 'Organic Espresso Shot', price: 4.0, sustainable: true, co2OffsetGrams: 150 },
      { item: 'Locally Sourced Croissant', price: 5.0, sustainable: true, co2OffsetGrams: 180 },
    ],
    accessibilityStatus: 'Subway elevators fully active. Electric shuttle boarding at Bay 3.',
    co2OffsetKg: 890,
    sensorCount: 10,
    occupancyPercent: 78,
  },
];

const initialIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Gate D ticket scanner offline',
    sectorId: 'east',
    severity: 'high',
    description: 'Ticket scanner array offline due to a network switch drop. Queues are backing up past 35 minutes into the main plaza.',
    status: 'active',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'inc-2',
    title: 'Recycling bin overflow at West Stand',
    sectorId: 'west',
    severity: 'low',
    description: 'Bio-waste composting bin is reaching capacity near Sector 104 concession stalls, obstructing fan movement slightly.',
    status: 'active',
    timestamp: new Date().toISOString(),
  },
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Reroute incoming spectators to Gate C',
    description: 'Direct fans waiting near Gate D towards Gate C scanners which are currently operating at 20% capacity.',
    sectorId: 'east',
    assignedTo: 'Volunteer Elena (Team Alpha)',
    status: 'pending',
    incidentId: 'inc-1',
  },
  {
    id: 'task-2',
    title: 'Dispatch green team cleanup crew',
    description: 'Empty compost bins at Section 104 and place additional zero-waste instructional placards nearby.',
    sectorId: 'west',
    assignedTo: 'Eco-Crew Lead Hiro',
    status: 'pending',
    incidentId: 'inc-2',
  },
];

const initialTransit: TransitStatus = {
  metroStatus: 'Excellent',
  shuttleFrequencyMin: 8,
  electricBusCount: 16,
  parkAndRideOccupancy: 64,
};

const initialSustainability: SustainabilityMetrics = {
  recycledKg: 2450,
  waterSavedLiters: 8200,
  solarEnergyKwh: 4120,
  reusableCupsActive: 15800,
};

// Global in-memory application state
let stadiumState: StadiumState = {
  sectors: [...initialSectors],
  incidents: [...initialIncidents],
  tasks: [...initialTasks],
  transit: { ...initialTransit },
  sustainability: { ...initialSustainability },
};

// GET current state
app.get('/api/stadium/state', (req, res) => {
  res.json(stadiumState);
});

// POST reset state
app.post('/api/stadium/reset', (req, res) => {
  stadiumState = {
    sectors: JSON.parse(JSON.stringify(initialSectors)),
    incidents: [
      {
        id: 'inc-1',
        title: 'Gate D ticket scanner offline',
        sectorId: 'east',
        severity: 'high',
        description: 'Ticket scanner array offline due to a network switch drop. Queues are backing up past 35 minutes into the main plaza.',
        status: 'active',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'inc-2',
        title: 'Recycling bin overflow at West Stand',
        sectorId: 'west',
        severity: 'low',
        description: 'Bio-waste composting bin is reaching capacity near Sector 104 concession stalls, obstructing fan movement slightly.',
        status: 'active',
        timestamp: new Date().toISOString(),
      },
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Reroute incoming spectators to Gate C',
        description: 'Direct fans waiting near Gate D towards Gate C scanners which are currently operating at 20% capacity.',
        sectorId: 'east',
        assignedTo: 'Volunteer Elena (Team Alpha)',
        status: 'pending',
        incidentId: 'inc-1',
      },
      {
        id: 'task-2',
        title: 'Dispatch green team cleanup crew',
        description: 'Empty compost bins at Section 104 and place additional zero-waste instructional placards nearby.',
        sectorId: 'west',
        assignedTo: 'Eco-Crew Lead Hiro',
        status: 'pending',
        incidentId: 'inc-2',
      },
    ],
    transit: { ...initialTransit },
    sustainability: { ...initialSustainability },
  };
  res.json({ success: true, state: stadiumState });
});

// POST report a simulated incident
app.post('/api/stadium/incident', (req, res) => {
  const { title, sectorId, severity, description } = req.body;

  if (!title || !sectorId || !severity || !description) {
    res.status(400).json({ error: 'Missing required incident fields' });
    return;
  }

  const newIncidentId = `inc-${Date.now()}`;
  const newIncident: Incident = {
    id: newIncidentId,
    title,
    sectorId,
    severity,
    description,
    status: 'active',
    timestamp: new Date().toISOString(),
  };

  // Dynamically affect stadium state based on incident report
  const sectorIndex = stadiumState.sectors.findIndex((s) => s.id === sectorId);
  if (sectorIndex !== -1) {
    if (severity === 'high') {
      stadiumState.sectors[sectorIndex].crowdLevel = 'overcrowded';
      stadiumState.sectors[sectorIndex].occupancyPercent = Math.min(100, stadiumState.sectors[sectorIndex].occupancyPercent + 15);
    } else if (severity === 'medium') {
      stadiumState.sectors[sectorIndex].crowdLevel = 'busy';
      stadiumState.sectors[sectorIndex].occupancyPercent = Math.min(100, stadiumState.sectors[sectorIndex].occupancyPercent + 8);
    }
  }

  stadiumState.incidents.unshift(newIncident);

  // Automatically dispatch a volunteer task associated with this incident
  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: `Respond to: ${title}`,
    description: `Assist venue operations with resolving the following issue: ${description}`,
    sectorId,
    assignedTo: 'Pending Assignment (Nearby volunteers notified)',
    status: 'pending',
    incidentId: newIncidentId,
  };
  stadiumState.tasks.unshift(newTask);

  res.json({ success: true, incident: newIncident, task: newTask, state: stadiumState });
});

// POST resolve incident
app.post('/api/stadium/incident/resolve', (req, res) => {
  const { incidentId } = req.body;
  if (!incidentId) {
    res.status(400).json({ error: 'Missing incidentId' });
    return;
  }

  const incident = stadiumState.incidents.find((i) => i.id === incidentId);
  if (incident) {
    incident.status = 'resolved';

    // Also mark any associated task as completed
    stadiumState.tasks.forEach((t) => {
      if (t.incidentId === incidentId) {
        t.status = 'completed';
      }
    });

    // Ease crowd levels slightly for that sector
    const sector = stadiumState.sectors.find((s) => s.id === incident.sectorId);
    if (sector) {
      if (sector.crowdLevel === 'overcrowded') {
        sector.crowdLevel = 'busy';
        sector.occupancyPercent = Math.max(0, sector.occupancyPercent - 10);
      } else if (sector.crowdLevel === 'busy') {
        sector.crowdLevel = 'normal';
        sector.occupancyPercent = Math.max(0, sector.occupancyPercent - 8);
      }
      // Boost sustainability metrics for fixing problems!
      stadiumState.sustainability.recycledKg += 35;
      stadiumState.sustainability.waterSavedLiters += 120;
    }
  }

  res.json({ success: true, state: stadiumState });
});

// POST complete a task
app.post('/api/stadium/task/complete', (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    res.status(400).json({ error: 'Missing taskId' });
    return;
  }

  const task = stadiumState.tasks.find((t) => t.id === taskId);
  if (task) {
    task.status = 'completed';

    // If it was linked to an incident, let's resolve the incident too
    if (task.incidentId) {
      const incident = stadiumState.incidents.find((i) => i.id === task.incidentId);
      if (incident) {
        incident.status = 'resolved';
        // Reduce crowd levels
        const sector = stadiumState.sectors.find((s) => s.id === incident.sectorId);
        if (sector) {
          sector.crowdLevel = sector.crowdLevel === 'overcrowded' ? 'busy' : 'normal';
          sector.occupancyPercent = Math.max(30, sector.occupancyPercent - 12);
        }
      }
    }

    // Add environmental gains
    stadiumState.sustainability.reusableCupsActive += 150;
    stadiumState.sustainability.solarEnergyKwh += 20;
  }

  res.json({ success: true, state: stadiumState });
});

// API endpoint for GenAI-enabled Real-time Decision Support & Operations Advisory
app.post('/api/operations/advisory', async (req, res) => {
  try {
    const activeIncidents = stadiumState.incidents.filter((i) => i.status === 'active');
    const crowdedSectors = stadiumState.sectors.filter((s) => s.crowdLevel !== 'normal');

    // Build operational context for Gemini
    const contextPrompt = `
      You are the FIFA World Cup 2026 AI Venue Control Director.
      Analyze the current live stadium telemetry and generate a highly detailed operational decision support plan.

      STADIUM TELEMETRY SUMMARY:
      - Active incidents: ${JSON.stringify(activeIncidents)}
      - Sector crowd loads: ${JSON.stringify(crowdedSectors.map((s) => ({ id: s.id, name: s.name, load: s.crowdLevel, occupancy: s.occupancyPercent })))}
      - Metropolitan Transit Plaza load: ${stadiumState.transit.metroStatus} status, bus fleet size is ${stadiumState.transit.electricBusCount}, shuttle intervals at ${stadiumState.transit.shuttleFrequencyMin} mins.
      - Sustainability progress: ${stadiumState.sustainability.recycledKg}kg recycled, ${stadiumState.sustainability.solarEnergyKwh}kWh solar energy.

      TASK:
      Create an immediate tactical action plan to optimize crowd management, resolve technical/operational issues, incorporate eco-friendly transit decisions, and draft emergency/informational stadium announcements.

      YOU MUST RESPOND STRICTLY IN JSON matching this schema:
      {
        "summary": "High-level summary of the stadium's operational readiness and main bottlenecks.",
        "tacticalDirectives": ["List of 3-4 highly specific, immediate actions venue staff/volunteers must perform"],
        "transitAdjustment": "Suggested changes to public transit or electric shuttle frequencies to handle bottlenecks.",
        "sustainabilityTip": "An actionable, green instruction related to composting, power use, or cup deposits that helps operational sustainability.",
        "announcementDrafts": {
          "english": "A professional PA script in English to broadcast over speaker boards or push notifications.",
          "spanish": "A translation of the PA script in Spanish.",
          "portuguese": "A translation of the PA script in Portuguese.",
          "french": "A translation of the PA script in French.",
          "arabic": "A translation of the PA script in Arabic."
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contextPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tacticalDirectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            transitAdjustment: { type: Type.STRING },
            sustainabilityTip: { type: Type.STRING },
            announcementDrafts: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                spanish: { type: Type.STRING },
                portuguese: { type: Type.STRING },
                french: { type: Type.STRING },
                arabic: { type: Type.STRING },
              },
              required: ['english', 'spanish', 'portuguese', 'french', 'arabic'],
            },
          },
          required: ['summary', 'tacticalDirectives', 'transitAdjustment', 'sustainabilityTip', 'announcementDrafts'],
        },
      },
    });

    const data = JSON.parse(response.text?.trim() || '{}');
    res.json(data);
  } catch (error) {
    console.error('Advisory GenAI failed:', error);
    res.status(500).json({ error: 'Failed to generate advisory from Gemini.' });
  }
});

// API endpoint for Multilingual Fan & Volunteer Assistant Chat
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Missing or invalid messages history' });
    return;
  }

  try {
    // Inject custom, comprehensive World Cup context & instructions
    const systemInstruction = `
      You are the official FIFA World Cup 2026 Multilingual Smart Venue Concierge.
      You help fans, staff, and volunteers have a seamless, safe, sustainable, and enjoyable stadium experience.

      YOUR KNOWLEDGE BASE:
      1. Transport & Transit:
         - Tournament Matchday Ticket provides free access to local metropolitan trains, express transit shuttle loops, and clean electric bus lines.
         - Electric shuttle buses run between Metro Plaza and Gates A, C, and E every 5-10 minutes.
         - Heavy traffic is expected; recommend public transit, Park-and-Ride, or bike sharing.
      2. Accessibility & Accommodations:
         - Wheelchair lifts and priority elevators are operational at Gates A, C, and E.
         - Companion seating can be configured at Sectors 110, 122, and 205.
         - A specialized Sensory Room is located in the West Concourse behind Section 102 for sensory-sensitive spectators (noise-reducing headphones, tactile panels, calm lighting).
         - Hearing loop systems are integrated into South and North stands.
      3. Stadium Guidelines:
         - Clear Bag Policy is strictly enforced (bags must be clear plastic, vinyl, or PVC, maximum size 12x6x12 inches). Only tiny hand clutches (4.5x6.5 inches) are allowed without being clear.
         - Concessions are entirely cashless (credit cards, mobile wallets, WC-Prepaid cards accepted).
         - Water policy: Spectators can bring one empty, soft-sided reusable plastic bottle (up to 750ml). Metal flasks and glass are strictly prohibited.
      4. Sustainability Initiatives:
         - Reusable Cup Deposit Scheme: All beverage purchases include a $2 refundable cup levy. Return cups to Green Hub stations to claim your $2 back or donate it to reforestation.
         - Organic composting bins are color-coded in Emerald Green. Paper-recycling bins are Gold. All cutlery is made of bio-plastic from organic starches.
      5. Multilingual translation & Volunteer assistance:
         - Always respond in the language the user speaks (English, Spanish, Portuguese, French, Arabic, Japanese, etc.). Keep the tone friendly, enthusiastic, professional, and clear.
         - If volunteers ask you how to say certain key directions in other spectator languages (e.g., "how do I say 'please queue this way' in Arabic?"), give a clear translation and an easy phonetic pronunciation guide.

      Always respond concisely to ensure spectators can read your replies quickly on mobile devices during the loud match atmosphere.
    `;

    // Convert messages into @google/genai format.
    // The modern SDK expects standard message format or simple string arrays.
    // Let's format them as text parts.
    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ content: response.text });
  } catch (error) {
    console.error('Chat GenAI failed:', error);
    res.status(500).json({ error: 'Failed to process chat response from Gemini.' });
  }
});

// Configure Vite & production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted (Development mode)');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving static files from dist (Production mode)');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FIFA World Cup 2026 Server running on http://localhost:${PORT}`);
  });
}

startServer();
