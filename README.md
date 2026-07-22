# FIFA World Cup 2026 Stadium Operations & Fan Assistant

A GenAI-powered full-stack tactical command center, crowd-control simulator, and multilingual spectator assistant designed for the **FIFA World Cup 2026**. This application bridges real-time stadium telemetry, dynamic incident response, sustainable offsets, and inclusive, multilingual wayfinding into a high-performance, single-screen operator dashboard and fan concierge.

---

## 🏟️ Chosen Vertical: Mega-Event Venue & Eco-Stadium Logistics (FIFA 2026)

Managing stadium operations for FIFA World Cup matches involves coordinating hundreds of thousands of spectators, resolving venue-wide operational and transit bottlenecks, translating emergency directions for a global audience, and tracking carbon offsets in real-time. This solution is built for **stadium operators**, **volunteer crew members**, and **international spectators**.

---

## 🧠 Approach & Operational Logic

This application uses a full-stack, server-authoritative state engine combined with **Gemini models** to process real-time incidents and generate structured tactical recommendations.

```
       [ Simulated Stadium Incident / What-If Stress Scenario ] ──> [ High-Priority Alert Dispatcher ]
                                │
                                ▼
                 [ Server-Side Gemini API Proxy ] ──> [ JSON Schema-Guaranteed Strategy ]
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
[Tactical Directives]  [Multilingual PA Speech]  [Carbon-Smart Meals]
```

1. **Structured Telemetry & What-If Stress Simulator**:
   * When an operator runs a What-If Stress Simulation (e.g., Halftime Concession Rush, Severe Weather Evacuation, Post-Match Egress), the server updates stadium sector crowd densities and queries **Gemini-3.5-Flash** for structured tactical directives, crowd rerouting, and safety notes.

2. **Smart Spectator Assistance & Carbon Concession Finder**:
   * **Fan Chat Assistant**: Translates multi-turn user inquiries on the fly into route instructions, ticketing details, and accessible services.
   * **Carbon-Smart Concession Finder**: Recommends low-emission food & beverage combinations tailored to spectator seating stands and dietary requirements (Vegan, Organic, Gluten-Free) with carbon offset calculations.
   * **Wayfinding & Routing Logic**: A localized pathfinding calculator computes step-free trajectories enriched with sensory room locations, accessible elevators, and eco-cup refund stations.

3. **Decentralized Volunteer Gamification & Multilingual Desk**:
   * Operational incident boards synchronize tasks to the **Volunteer Dispatch Desk**, featuring **Eco Gamification Badges** (Eco Champion, Multilingual Bridge) and shift impact points.
   * **Phonetic Translation Cards**: Translates common instructions into multiple global dialects with phonetic pronunciation guides.

---

## ✨ Core Features & Technical Architecture

### 1. 🤖 GenAI Operational Decision Advisor
* **Tactical Command**: Synthesizes cumulative stadium telemetry into clean executive summaries.
* **Incident Interventions**: Delivers numbered, actionable steps for volunteer crews.
* **Transit & Offsets**: Dynamically modifies public transit recommendations and flags real-time sustainability optimization tips.
* **PA Announcement Translator & Audio Synthesizer**: Creates ready-to-broadcast emergency scripts translated across **English, Spanish, French, German, and Portuguese**, with built-in **Web Speech API Audio Playback** for live stadium PA announcements.

### 2. ⚡ Matchday Stress Simulator & Real Data Integration Hub
* **Scenario Engine**: Simulates four critical matchday phases (Pre-Match Gate Rush, Halftime Concession Peak, Post-Match Egress, Severe Weather Alert).
* **Live Venue Weather (Open-Meteo REST API)**: Direct connection to MetLife Stadium GPS coordinates (40.8128° N, 74.0742° W) fetching live temperature (°C/°F), precipitation, UV index, and wind speed.
* **Search-Grounded FIFA Intelligence**: Gemini-3.5-Flash with Google Search Grounding for live World Cup news, transit policies, and host venue directives.
* **Exportable Audit Ledger (CSV)**: One-click export of full venue incidents, volunteer actions, and microgrid solar/water metrics (`GET /api/operations/export-ledger`).
* **Enterprise Hardware Protocols**: Complete protocol map for turnstiles (MQTT/RTSP), transit updates (GTFS Realtime), smart cup bins (LoRaWAN/MQTT), and PA audio synthesis (Web Speech API).

### 3. 🚨 Active Operational Incidents Panel
* Displays real-time critical issues with color-coded severity levels (`high`, `medium`, `low`).
* **Custom Reporter**: Enables operators to inject custom incidents with location sectors, title, and detail logs, simulating actual live-stadium stress environments.
* **Task Resolution Loop**: Instantaneous incident resolution archiving logs directly into central storage.

### 4. 💬 Smart Multilingual Fan Concierge & Carbon Concession Finder
* Multi-turn chat interface leveraging server-side **Gemini models** to guide global visitors.
* **Carbon-Smart Concession Finder**: Queries menu emissions data to suggest sustainable meal combos with CO₂ savings metrics.
* Quick-access chips for frequently asked questions (ticket issues, medical centers, accessibility accommodations, water refill spots).

### 5. 🗺️ Interactive Wayfinding & Accessibility Router
* Fully interactive custom path calculation matching 6 entrance gates with all key seating sections (North, South, East, West, Club, Suite).
* Automatically extracts and appends custom **Accessibility Assist** notices (step-free ramps, quiet zones, elevators) and **Sustainability Steps** (composting schemes, cup refunds).

### 6. 🏆 Volunteer Dispatch Board & Gamification Leaderboard
* Dynamically manages assigned duties and displays pending tasks with real-time sector assignments and volunteer crew tags.
* **Gamification Badges**: Tracks volunteer impact points, recycled cups milestone badges, and multilingual assistance metrics.
* **Phonetic Card Generator**: Generates phonetic pronunciation guides for volunteers to communicate fluently with global visitors.

### 7. 🌿 Eco-Stadium Sustainability Monitor
* Real-time progress tracker for zero-waste initiatives.
* **Reusable Cup Scheme**: Logs cumulative refund payouts ($2 deposit refund scheme).
* **Solar & Water Microgrids**: Monitors live solar energy harvesting (kWh) and rainwater conservation metrics against tournament goals.

---

## 🛠️ Focus Areas & Evaluation Standards

### 🛡️ 1. Security & Keys
* **Zero Public Key Leaks**: All Gemini AI prompts, system context, and generation calls are strictly encapsulated behind a secure, server-side `/api/*` architecture.
* **Local Sanitization**: Inputs are validated and bound to prevent command or parameter injection.

### 📦 2. Resource Efficiency
* **Local React Performance**: Standardized primitives and layout structures avoid unnecessary virtual DOM re-renders.
* **Bundle Compliance**: Clean code splitting ensures the repository remains highly lightweight, well below the 10 MB challenge limit.

### 🎨 3. UI/UX & Responsive Design
* **Professional Polish Theme**: Clean, accessible layout utilizing high-contrast slate, emerald, and amber palettes with clear typographic hierarchy and rounded card structures.
* **Fluid Layout**: Tailored for full responsive range (`sm` through `xl`), guaranteeing visual beauty on both tablet terminals and standard widescreen desktop operator screens.

### ♿ 4. Accessibility (A11y)
* Generous contrast ratios across dark/light transitions.
* Logical layout with clear focus borders.
* Dedicated focus on accessible step-free routes, tactile maps, and sensory-friendly rest zones.

---

## 🚀 Running the Project Locally

### 1. Setup Environment
Define your API credentials in `.env` (refer to `.env.example`):
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
To spin up both the Vite frontend asset pipeline and the Express server-side Gemini router:
```bash
npm run dev
```
The application will run on **http://localhost:3000** (Port 3000).

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📝 Key Assumptions Made
1. **Dynamic Volatility**: Modeled under standard tournament density levels, assuming localized crowd flows would shift based on active sector incidents.
2. **Offline-First Resilience**: All essential path calculations, volunteer rosters, and core database interactions degrade gracefully and remain fully functional offline or in low-connectivity conditions when Gemini responses are pending.

