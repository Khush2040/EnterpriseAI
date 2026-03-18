# Enterprise Content AI - Hackathon Project

This is a multi-agent orchestration platform that automates the lifecycle of enterprise content from raw knowledge ingestion to localized, multi-channel distribution.

## Features
- **Knowledge-to-Content Agent**: Extracts key value props from internal raw data.
- **Drafting Agent**: Generates tailored content based on the knowledge schema.
- **Brand Governance & Compliance Agent**: Reviews tone and legal guardrails (e.g., no absolute guarantees).
- **Localization Agent**: Translates verified clean drafts into multiple languages.
- **Multi-Channel Publishing Agent**: Formats content perfectly for LinkedIn, Twitter, and Internal Blogs.
- **Content Intelligence Engine**: Monitors performance trends (mocked in the UI for the dashboard).

## Tech Stack
- **Frontend**: Vite + React + Vanilla CSS (Premium Glassmorphism Design)
- **Backend**: Node.js + Express
- **AI Engine**: Google GenAI SDK (`@google/genai`)

## How to Run

1. **Start the Backend server** (Handles agent orchestration)
   ```bash
   cd backend
   npm install
   node index.js
   ```
   *Runs on port 3001*

2. **Start the Frontend portal** (The beautiful dashboard)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Runs on port 5173 (or 5180/another if occupied)*

3. **Get your API Key**
   - Head over to Google AI Studio and grab a Gemini API key.
   - Paste the API key directly into the top right input of the dashboard when it opens.

## How to Demo to Judges
- Open the **Content Pipeline** tab.
- Paste some realistic "fake" product release data into the context box (or leave the default).
- Click **Execute Multi-Agent Pipeline**.
- The judges will see the real-time orchestrator running, lighting up each step of the pipeline.
- Expand the terminal window to show the agents actually thinking and communicating!
- Once finished, click through the tabs to see the Clean Draft, the Compliance Report, the Localized versions, and the Multi-Channel Formats. 
- Go to the **Intelligence** and **Brand Center** tabs to walk through your theoretical roadmap for analytics and governance.

Good luck!
# EnterpriseAI
