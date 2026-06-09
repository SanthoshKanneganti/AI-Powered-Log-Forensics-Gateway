import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 📁 NEW: Tell Express to look inside a folder named "public" for our frontend files
app.use(express.static('public'));

const aiKey = process.env.GEMINI_API_KEY;
const ai = aiKey && aiKey !== 'your_actual_gemini_api_key_here' ? new GoogleGenAI({ apiKey: aiKey }) : null;

interface SecurityLog {
    timestamp: string;
    ipAddress: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    statusCode: number;
    payloadSize: number;
    userAgent: string;
}

// 🗄️ NEW: In-memory array to store captured security logs for our frontend dashboard
const logHistory: any[] = [];

// 🌐 NEW: GET route for our frontend dashboard to retrieve the latest logs
app.get('/api/logs', (req: Request, res: Response) => {
    res.json(logHistory);
});

// 🛡️ Webhook POST Route
app.post('/webhook/log', async (req: Request, res: Response): Promise<void> => {
    try {
        const logData: SecurityLog = req.body;

        if (!logData.ipAddress || !logData.endpoint || !logData.method) {
            res.status(400).json({ error: "Invalid log format." });
            return;
        }

        console.log(`\n📥 [LOG RECEIVED] Parsing security profile for: ${logData.ipAddress}`);

        let aiAnalysis: any;

        if (ai) {
            const prompt = `Analyze this server log entry for potential malicious activity or anomalies:\n${JSON.stringify(logData, null, 2)}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            riskScore: { type: "INTEGER", description: "Risk rating from 1 to 10" },
                            classification: { type: "STRING", description: "Threat classification category" },
                            summary: { type: "STRING", description: "Precise forensic summary sentence" }
                        },
                        required: ["riskScore", "classification", "summary"]
                    }
                }
            });

            aiAnalysis = JSON.parse(response.text || "{}");
        } else {
            aiAnalysis = {
                riskScore: logData.statusCode >= 400 ? 9 : 2,
                classification: logData.statusCode >= 400 ? "Unauthorized Access Attempt" : "Standard Traffic",
                summary: "Mock Mode: Active firewall heuristics flag this traffic configuration."
            };
        }

        // 🧠 Create a unified package containing raw data + AI evaluation
        const unifiedLogRecord = {
            id: Date.now(), // Unique identifier
            raw: logData,
            forensics: aiAnalysis
        };

        // Push to the front of our array so the newest alerts show up at the top
        logHistory.unshift(unifiedLogRecord);

        // Keep the history bounded to the last 50 entries so memory doesn't leak
        if (logHistory.length > 50) logHistory.pop();

        res.status(200).json({
            status: "success",
            logCaptured: logData.endpoint,
            forensics: aiAnalysis
        });

    } catch (error) {
        console.error("🔴 Server processing error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Fullstack Server is live at http://localhost:${PORT}`);
});