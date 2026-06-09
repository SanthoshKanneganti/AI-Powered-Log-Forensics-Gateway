# Project Aegis // AI-Powered Log Forensics Gateway 🚨

An asynchronous Full-Stack Security Operations Center (SOC) telemetry webhook built with Node.js and TypeScript. The system captures live server log events, orchestrates a runtime data-compliance layer, executes real-time AI security evaluations via Gemini 2.5 Flash using strict JSON schemas, and streams live alerts to a dark-mode web console.

## 🎛️ System Architecture & Data Flow
1. **Ingestion Layer:** Node.js + Express API endpoint (`POST /webhook/log`) enforces strict data structure using native TypeScript type contracts.
2. **AI Enrichment Engine:** Incoming telemetry is processed asynchronously via the `@google/genai` SDK, forcing the Gemini 2.5 Flash model to output a deterministic JSON schema matching operational risk parameters.
3. **UI Synchronization:** Frontend HTML5 dashboard leverages utility-first Tailwind CSS aesthetics and an asynchronous polling engine to update threat metrics and generate color-coded warning arrays without interface reloads.

## 🚀 Technical Stack
* **Backend:** Node.js, TypeScript, Express, Dotenv
* **AI Integration:** Google Gen AI SDK (Gemini 2.5 Flash Core)
* **Frontend:** Vanilla JavaScript (ESNext Async/Fetch), Tailwind CSS
* **Runtime Execution:** TSX (TypeScript Execute)

## 📦 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/SanthoshKanneganti/AI-Powered-Log-Forensics-Gateway](https://github.com/SanthoshKanneganti/Project-Aegis.git)
   cd AI-Powered-Log-Forensics-Gateway

  2. Install Dependencies:

Bash
npm install

3.Configure Environment Variables:
Create a .env file in the root folder:

PORT=3000
GEMINI_API_KEY=your_live_google_studio_api_key

4.Launch the Infrastructure:

npx tsx src/index.ts
Open http://localhost:3000 in your browser to view the live dashboard interface.