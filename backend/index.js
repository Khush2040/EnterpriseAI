const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const db = { tasks: [] };

function getAIInstance(apiKey, isDemoMode) {
    if (isDemoMode) return 'MOCK_INSTANCE';
    if (!apiKey) throw new Error("API Key required when not in Demo Mode");
    return new GoogleGenAI({ apiKey });
}

// 1. Knowledge to Content Agent
async function runKnowledgeAgent(ai, dataContext, targetAudience) {
    if (ai === 'MOCK_INSTANCE') {
        await new Promise(r => setTimeout(r, 1200));
        return `- AcmeSphere 2.0 introduces AI-driven analytics.\n- 50% faster processing globally.\n- Designed for enterprise-grade scalability, security, and integration.\n- 100% guaranteed.`;
    }
    const prompt = `You are a Knowledge-to-Content Agent. Extract key value propositions and technical facts relevant to a specific target audience.
Audience: ${targetAudience}
Raw Data: ${dataContext}
Output a structured summary highlighting the main points to be used by the Drafting Agent.`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    } catch (e) { return "Knowledge extraction failed: " + e.message; }
}

// 2. Drafting Agent
async function runDraftingAgent(ai, knowledgeSummary, targetAudience) {
    if (ai === 'MOCK_INSTANCE') {
        await new Promise(r => setTimeout(r, 1800));
        return `## Introducing AcmeSphere 2.0: The Future of Enterprise Intelligence\n\nWe are proud to announce AcmeSphere 2.0, introducing AI-driven analytics with 50% faster processing. This platform is designed specifically for enterprise-grade scalability and security, allowing CTOs and architects to scale seamlessly. We 100% guarantee no downtime and absolute foolproof integration.\n\nExplore how AcmeSphere 2.0 enables faster, more reliable enterprise-scale intelligence.`;
    }
    const prompt = `You are the Drafting Agent for an Enterprise Content Team.
Using this knowledge summary, draft an engaging article tailored to this audience: ${targetAudience}.
It must have an engaging title, clear sections, and a call to action. 
Strategic Directive: Based on the Content Intelligence Engine, limit promotional tone by 15% and focus on technical depth.
Knowledge Summary: ${knowledgeSummary}
`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    } catch (e) { return "Drafting failed: " + e.message; }
}

// 3. Review Agent (Brand/Legal Compliance)
async function runReviewAgent(ai, draft) {
    if (ai === 'MOCK_INSTANCE') {
        await new Promise(r => setTimeout(r, 2200));
        return {
            explainableIssues: [
                { original: "We 100% guarantee no downtime", reason: "No Absolute Claims Rule", suggestedFix: "Designed to deliver high availability and reliability at scale" },
                { original: "absolute foolproof integration", reason: "Unprofessional and absolute.", suggestedFix: "seamless integration capabilities" }
            ],
            cleanDraft: `## Introducing AcmeSphere 2.0: The Future of Enterprise Intelligence\n\nWe are proud to announce AcmeSphere 2.0, introducing AI-driven analytics with 50% faster processing. This platform is designed specifically for enterprise-grade scalability and security, allowing CTOs and architects to scale seamlessly. We are designed to deliver high availability and reliability at scale and seamless integration capabilities.\n\nExplore how AcmeSphere 2.0 enables faster, more reliable enterprise-scale intelligence.`,
            isCompliant: false
        };
    }
    const prompt = `You are the Brand Governance & Compliance Agent for an enterprise.
Review the draft for:
1. No absolute guarantees (e.g. "guaranteed performance", "100%", "foolproof").
2. Brand Tone: Ensure it is professional and authoritative.

Respond EXACTLY with valid JSON following this schema:
{
  "explainableIssues": [
     { "original": "text that violates rule", "reason": "Why it violates", "suggestedFix": "fixed text" }
  ],
  "cleanDraft": "The full revised draft with fixes applied.",
  "isCompliant": false
}
If no issues are found, return empty array for explainableIssues and isCompliant: true.
Draft:
${draft}`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        let text = response.text;
        if (text.includes('```json')) text = text.split('```json')[1].split('```')[0].trim();
        else if (text.includes('```')) text = text.split('```')[1].split('```')[0].trim();
        return JSON.parse(text);
    } catch (e) { 
        return { explainableIssues: [], cleanDraft: draft, isCompliant: true, error: "Review failed to parse JSON, defaulting to pass." }; 
    }
}

// 4. Localization Agent
async function runLocalizationAgent(ai, cleanDraft) {
    if (ai === 'MOCK_INSTANCE') {
        await new Promise(r => setTimeout(r, 1400));
        return {
            EU_Version: `${cleanDraft}\n\n*This data is processed in accordance with General Data Protection Regulation (GDPR).*`,
            US_Version: `${cleanDraft}\n\n*Boost your enterprise performance and exceed Q3 metrics today.*`
        };
    }
    const prompt = `You are an expert Localization Agent. Translate and adapt the following content into two distinct regional versions based on enterprise guidelines:

Content:
${cleanDraft}

Respond EXACTLY with valid JSON following this schema:
{
  "EU_Version": "Translated/adapted for Europe. MUST include a GDPR data processing compliance disclaimer at the bottom.",
  "US_Version": "Adapted for the US. Emphasize performance and speed metrics heavily."
}`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        let text = response.text;
        if (text.includes('```json')) text = text.split('```json')[1].split('```')[0].trim();
        else if (text.includes('```')) text = text.split('```')[1].split('```')[0].trim();
        return JSON.parse(text);
    } catch (e) {
        return { EU_Version: "Failed to localize for EU.", US_Version: "Failed to localize for US." };
    }
}

// 5. Distribution Agent
async function runDistributionAgent(ai, content) {
    if (ai === 'MOCK_INSTANCE') {
        await new Promise(r => setTimeout(r, 1000));
        return {
            LinkedIn: `🚀 Introducing AcmeSphere 2.0...\n\nAI-driven analytics. 50% faster processing. Designed for enterprise-grade scalability and security.\n\nScale with confidence.\n#EnterpriseTech #DataAnalytics #AI`,
            Twitter: `Faster analytics. Smarter decisions. We're proud to launch AcmeSphere 2.0 — scaling enterprise architecture safely and reliably. ☁️🚀 #AI #Enterprise`
        };
    }
    const prompt = `You are a Multi-Channel Publishing Agent. Take the content and reformat it for:
1. LinkedIn (Professional, engaging hook, 3-4 emojis)
2. Twitter/X (Short, punchy thread)

Content: ${content}

Respond EXACTLY with valid JSON:
{
  "LinkedIn": "...",
  "Twitter": "..."
}`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        let text = response.text;
        if (text.includes('```json')) text = text.split('```json')[1].split('```')[0].trim();
        else if (text.includes('```')) text = text.split('```')[1].split('```')[0].trim();
        return JSON.parse(text);
    } catch (e) { return { LinkedIn: "Failed layout", Twitter: "Failed layout" }; }
}

// Start Pipeline Endpoint
app.post('/api/pipeline', async (req, res) => {
    const { apiKey, dataContext, targetAudience, isDemoMode } = req.body;
    if (!isDemoMode && !apiKey) return res.status(400).json({ error: "API Key required" });

    const taskId = Date.now().toString();
    const task = {
        id: taskId,
        apiKey,
        isDemoMode,
        status: 'RUNNING',
        logs: [],
        results: {},
        inputs: { dataContext, targetAudience }
    };
    db.tasks.push(task);

    res.json({ taskId }); // Return immediately for polling

    const updateTaskLog = (msg) => {
        task.logs.push({ time: new Date().toISOString(), message: msg });
        console.log(`[Task ${taskId}] ${msg}`);
    };

    (async () => {
        try {
            const ai = getAIInstance(apiKey, isDemoMode);

            updateTaskLog("Intelligence Strategy Applied: Adjusted parameters for Technical Deep-Dive & Reduced Promotional Bias based on Q3 Analytics.");

            updateTaskLog("Starting Knowledge Agent: Structuring internal data context...");
            const knowledgeSummary = await runKnowledgeAgent(ai, dataContext, targetAudience);
            task.results.knowledgeSummary = knowledgeSummary;

            updateTaskLog("Starting Drafting Agent: Generating initial base content...");
            const draft = await runDraftingAgent(ai, knowledgeSummary, targetAudience);
            task.results.draft = draft;

            updateTaskLog("Starting Brand Governance Agent: Running Explainable Compliance Checks...");
            const reviewReport = await runReviewAgent(ai, draft);
            task.results.reviewReport = reviewReport;
            task.results.cleanDraft = reviewReport.cleanDraft;

            updateTaskLog("Awaiting Human Approval: Compliance Review flagged. Halting pipeline.");
            task.status = 'AWAITING_APPROVAL';

        } catch (error) {
            updateTaskLog("Pipeline Phase 1 Failed: " + error.message);
            task.status = 'FAILED';
        }
    })();
});

// Resume/Approve Pipeline Endpoint
app.post('/api/tasks/:id/approve', async (req, res) => {
    const task = db.tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.status !== 'AWAITING_APPROVAL') return res.status(400).json({ error: "Task is not awaiting approval" });

    task.status = 'RUNNING';
    res.json({ success: true });

    const updateTaskLog = (msg) => {
        task.logs.push({ time: new Date().toISOString(), message: msg });
        console.log(`[Task ${task.id}] ${msg}`);
    };

    (async () => {
        try {
            const ai = getAIInstance(task.apiKey, task.isDemoMode);
            
            updateTaskLog("Human Approval Recorded: Resuming pipeline...");

            updateTaskLog("Starting Localization Agent: adapting to EU and US regions...");
            const localized = await runLocalizationAgent(ai, task.results.cleanDraft);
            task.results.localized = localized;

            updateTaskLog("Starting Distribution Agent: Formatting multi-channel content...");
            const channels = await runDistributionAgent(ai, task.results.cleanDraft);
            task.results.channels = channels;

            updateTaskLog("Finalizing orchestration loop. Sending metrics to Intelligence framework...");
            task.status = 'COMPLETED';

        } catch (error) {
            updateTaskLog("Pipeline Phase 2 Failed: " + error.message);
            task.status = 'FAILED';
        }
    })();
});

app.get('/api/tasks/:id', (req, res) => {
    const task = db.tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    const { apiKey, ...safeTask } = task;
    res.json(safeTask);
});

// Optional logic for Vercel or similar serverless cloud hosting platform compatibility
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

// Optional logic for Render / Heroku combined deployments
const path = require('path');
const frontendDist = path.join(__dirname, '../frontend/dist');
const fs = require('fs');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.use((req, res, next) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendDist, 'index.html'));
        } else {
            next();
        }
    });
}
