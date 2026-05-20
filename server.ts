import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { initialDatabase } from "./src/data";
import { 
  BlogPost, 
  KeywordItem, 
  SEOAgent, 
  TopicCluster, 
  ContentGapItem, 
  DatabaseSchema, 
  NotificationItem, 
  KeywordRankingHistory, 
  CompetitorStrategy, 
  TrafficSourceData, 
  SEOPerformanceReport 
} from "./src/types";
import { initBackgroundAutomation, autoTriggerCompleteSEOCompanyFlow } from "./lib/automation";
import { generateStaticCMSFiles } from "./workers/publisher";
import { getQueueStatus, clearCompletedJobs, resetFailedJobs, enqueueJob } from "./queues/index";
import { scrapeUrl, runAISEOAuditAgent, runAICompetitorAnalysisAgent, executeCrawlJob } from "./lib/scraping-agents";

dotenv.config();

const DB_FILE = path.join(process.cwd(), "db.json");

// Read/Write DB JSON support
function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      // Heuristic auto-merge empty entities to keep schema aligned back-and-forth
      if (!parsed.users) parsed.users = initialDatabase.users || [];
      if (!parsed.projects) parsed.projects = initialDatabase.projects || [];
      if (!parsed.scheduledJobs) parsed.scheduledJobs = initialDatabase.scheduledJobs || [];
      if (!parsed.generatedImages) parsed.generatedImages = initialDatabase.generatedImages || [];
      if (!parsed.publishingLogs) parsed.publishingLogs = initialDatabase.publishingLogs || [];
      if (!parsed.automationLogs) parsed.automationLogs = initialDatabase.automationLogs || [];
      if (!parsed.crawls) parsed.crawls = [];
      if (!parsed.competitorReports) parsed.competitorReports = [];
      if (!parsed.siteAudits) parsed.siteAudits = [];
      return parsed;
    }
  } catch (err) {
    console.error("Error reading database file, resetting to fallback: ", err);
  }
  // Initialize with initial dataset
  saveDb(initialDatabase);
  return initialDatabase;
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file: ", err);
  }
}

// Ensure database is initialized
loadDb();

// Instantiating Gemini Client with telemetry user-agent header
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Successfully initialized GoogleGenAI client with GEMINI_API_KEY.");
  } catch (e) {
    console.error("Error creating GoogleGenAI client:", e);
  }
} else {
  console.log("Warning: GEMINI_API_KEY is missing or contains placeholder. Initializing in flexible preview mode with smart AI fallback templates.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Create HTTP Server wrapper
  const server = http.createServer(app);

  // WebSocket Server setup
  const wss = new WebSocketServer({ server });
  const activeClients = new Set<WebSocket>();

  wss.on("connection", (ws: WebSocket) => {
    activeClients.add(ws);
    console.log(`[WS] Client connected. Active clients: ${activeClients.size}`);
    
    // Send immediate sync confirmation
    ws.send(JSON.stringify({ 
      type: "connection_success", 
      message: "Connected to real-time SEO Copilot event pipeline." 
    }));

    ws.on("close", () => {
      activeClients.delete(ws);
      console.log(`[WS] Client disconnected. Active clients: ${activeClients.size}`);
    });

    ws.on("error", (err) => {
      console.error("[WS] Client connection error:", err);
    });
  });

  // Helper to broadcast notifications
  function broadcastNotification(notification: NotificationItem) {
    const payload = JSON.stringify({ type: "notification", data: notification });
    for (const client of activeClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  // Helper to broadcast full state sync
  function broadcastStateSync() {
    try {
      const db = loadDb();
      const payload = JSON.stringify({ type: "db_update", data: db });
      for (const client of activeClients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    } catch (e) {
      console.error("Failed to broadcast state sync:", e);
    }
  }

  app.use(express.json());

  // --- API Endpoints ---

  // 1. Get current DB state
  app.get("/api/db", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      res.json({ success: true, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Save complete DB state (Full sync supporting CRUD)
  app.post("/api/db/save", (req: Request, res: Response) => {
    try {
      const { db } = req.body;
      if (!db) {
        return res.status(400).json({ success: false, error: "Database state missing." });
      }
      saveDb(db);
      res.json({ success: true, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Helper function to handle fallback generation when API key is not ready
  function getKeywordFallbacks(seed: string): KeywordItem[] {
    const cleanSeed = seed.toLowerCase().trim();
    return [
      {
        id: `kw-${Date.now()}-1`,
        keyword: `${cleanSeed} strategy optimization`,
        volume: 3800 + Math.floor(Math.random() * 2000),
        difficulty: 25 + Math.floor(Math.random() * 40),
        intent: "commercial",
        cpc: parseFloat((2 + Math.random() * 6).toFixed(2)),
        competition: Math.random() > 0.5 ? "medium" : "high",
        trend: Array.from({ length: 12 }, () => 40 + Math.floor(Math.random() * 60)),
        cluster: `${seed.charAt(0).toUpperCase() + seed.slice(1)} Hub`
      },
      {
        id: `kw-${Date.now()}-2`,
        keyword: `best tool for ${cleanSeed}`,
        volume: 1200 + Math.floor(Math.random() * 1000),
        difficulty: 45 + Math.floor(Math.random() * 30),
        intent: "transactional",
        cpc: parseFloat((4 + Math.random() * 10).toFixed(2)),
        competition: "high",
        trend: Array.from({ length: 12 }, () => 50 + Math.floor(Math.random() * 50)),
        cluster: `${seed.charAt(0).toUpperCase() + seed.slice(1)} Tools`
      },
      {
        id: `kw-${Date.now()}-3`,
        keyword: `how to optimize ${cleanSeed}`,
        volume: 5400 + Math.floor(Math.random() * 3000),
        difficulty: 15 + Math.floor(Math.random() * 25),
        intent: "informational",
        cpc: parseFloat((0.8 + Math.random() * 2).toFixed(2)),
        competition: "low",
        trend: Array.from({ length: 12 }, () => 60 + Math.floor(Math.random() * 40)),
        cluster: `${seed.charAt(0).toUpperCase() + seed.slice(1)} Guides`
      },
      {
        id: `kw-${Date.now()}-4`,
        keyword: `free ${cleanSeed} software`,
        volume: 2900 + Math.floor(Math.random() * 1500),
        difficulty: 30 + Math.floor(Math.random() * 20),
        intent: "navigational",
        cpc: parseFloat((0.5 + Math.random() * 2).toFixed(2)),
        competition: "medium",
        trend: Array.from({ length: 12 }, () => 30 + Math.floor(Math.random() * 70)),
        cluster: `${seed.charAt(0).toUpperCase() + seed.slice(1)} Core`
      },
      {
        id: `kw-${Date.now()}-5`,
        keyword: `enterprise ${cleanSeed} platforms`,
        volume: 850,
        difficulty: 65 + Math.floor(Math.random() * 20),
        intent: "transactional",
        cpc: parseFloat((12 + Math.random() * 15).toFixed(2)),
        competition: "high",
        trend: Array.from({ length: 12 }, () => 20 + Math.floor(Math.random() * 80)),
        cluster: "Enterprise Search"
      }
    ];
  }

  // 3. Keyword Research Engine
  app.post("/api/gemini/keywords", async (req: Request, res: Response) => {
    const { seed } = req.body;
    if (!seed || typeof seed !== "string" || !seed.trim()) {
      return res.status(400).json({ success: false, error: "Seed phrase is required." });
    }

    if (!aiClient) {
      console.log("No GEMINI_API_KEY available for search research. Using rich fallback keywords dynamic simulator.");
      return res.json({ success: true, keywords: getKeywordFallbacks(seed), generatedBy: "Mock AI (Local Playground Mode)" });
    }

    try {
      const prompt = `Perform extensive SEO keyword research based on the seed phrase: "${seed}".
      Generate a valid JSON array of exactly 5 related keywords.
      Do not wrap JSON in markdown tags (such as \`\`\`json). Return ONLY pure raw valid JSON code.
      Each item in the array MUST match this TypeScript format exactly:
      {
        "keyword": "string keyword",
        "volume": number (monthly search volume between 100 and 20000),
        "difficulty": number (SEO difficulty score from 0 to 100),
        "intent": "commercial" | "transactional" | "informational" | "navigational",
        "cpc": number (average CPC in USD from 0.2 to 25.00),
        "competition": "high" | "medium" | "low",
        "trend": Array of exactly 12 integers representing search trend values from 10 to 100,
        "cluster": "string name of a logical topical hub content cluster (e.g. 'Advanced AI Content Audit')"
      }`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "List of researched SEO keywords",
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                volume: { type: Type.INTEGER },
                difficulty: { type: Type.INTEGER },
                intent: { type: Type.STRING, enum: ["commercial", "transactional", "informational", "navigational"] },
                cpc: { type: Type.NUMBER },
                competition: { type: Type.STRING, enum: ["high", "medium", "low"] },
                trend: {
                  type: Type.ARRAY,
                  items: { type: Type.INTEGER }
                },
                cluster: { type: Type.STRING }
              },
              required: ["keyword", "volume", "difficulty", "intent", "cpc", "competition", "trend", "cluster"]
            }
          }
        }
      });

      const text = response.text || "";
      const jsonParsed = JSON.parse(text.trim());
      
      const keywordsWithIds = jsonParsed.map((item: any, idx: number) => ({
        id: `kw-${Date.now()}-${idx}`,
        ...item
      }));

      // Merge into local DB
      const db = loadDb();
      db.keywords = [...keywordsWithIds, ...db.keywords].slice(0, 30); // keep max 30
      
      const keywordNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "opportunity",
        title: "Keywords Research Done",
        message: `Discovered ${keywordsWithIds.length} high-potential keyword targets for '${seed}'.`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      if (!db.notifications) db.notifications = [];
      db.notifications = [keywordNotif, ...db.notifications].slice(0, 50);

      saveDb(db);
      broadcastNotification(keywordNotif);
      broadcastStateSync();

      res.json({ success: true, keywords: keywordsWithIds, generatedBy: "Google Gemini 3.5-flash" });
    } catch (err: any) {
      console.error("Gemini keywords search failed, fallback simulation triggered:", err);
      const db = loadDb();
      const fallbacks = getKeywordFallbacks(seed);
      db.keywords = [...fallbacks, ...(db.keywords || [])].slice(0, 30);
      
      const fallbackNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "opportunity",
        title: "Keywords Research Completed (Simulation)",
        message: `Simulated keywords research for '${seed}'. Added ${fallbacks.length} sample optimization targets.`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      if (!db.notifications) db.notifications = [];
      db.notifications = [fallbackNotif, ...db.notifications].slice(0, 50);
      saveDb(db);
      
      broadcastNotification(fallbackNotif);
      broadcastStateSync();

      res.json({ success: true, keywords: fallbacks, generatedBy: "Mock Fallback Engine" });
    }
  });

  // 4. Content Gap & Competitor Analyzer
  app.post("/api/gemini/gap-analysis", async (req: Request, res: Response) => {
    const { competitorUrl, targetUrl } = req.body;
    if (!competitorUrl || !targetUrl) {
      return res.status(400).json({ success: false, error: "Competitor URL and Target URL are required." });
    }

    const fallbacks: ContentGapItem[] = [
      {
        id: `gap-${Date.now()}-1`,
        competitorUrl,
        targetUrl,
        keyword: `${competitorUrl.split(".")[0]} core integrations automation`,
        competitorRank: 2,
        yourRank: "unindexed",
        gapVolume: 2400,
        difficulty: 35,
        recommendation: `Develop an immediate custom landing page contrasting your direct integrations with ${competitorUrl}.`
      },
      {
        id: `gap-${Date.now()}-2`,
        competitorUrl,
        targetUrl,
        keyword: `alternative comparison tool software`,
        competitorRank: 5,
        yourRank: 58,
        gapVolume: 1200,
        difficulty: 42,
        recommendation: "Build a highly interactive feature mapping comparison grid matrix comparing specific product specs."
      },
      {
        id: `gap-${Date.now()}-3`,
        competitorUrl,
        targetUrl,
        keyword: `how to automate technical blogging content`,
        competitorRank: 8,
        yourRank: "unindexed",
        gapVolume: 4900,
        difficulty: 28,
        recommendation: "Publish a deep technical pillar guide with code block snippets focusing on autonomous automated webhooks."
      }
    ];

    if (!aiClient) {
      return res.json({ success: true, gaps: fallbacks, generatedBy: "Mock AI (Local Playground Mode)" });
    }

    try {
      const prompt = `Analyze content gaps between the competitor website: "${competitorUrl}" and the target website: "${targetUrl}".
      Generate a list of exactly 3 specific high-opportunity search terms that the competitor ranks for but target remains weak or unindexed.
      Return ONLY raw JSON conforming to this schema array:
      [{
        "keyword": "search keyterm",
        "competitorRank": number (rank 1 to 10),
        "yourRank": number (your rank 15 to 100) or the string "unindexed",
        "gapVolume": number (search volumes),
        "difficulty": number (SEO difficulty),
        "recommendation": "specific advice on how to build content to steal this gap rank"
      }]`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "List of SEO content gaps found",
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                competitorRank: { type: Type.INTEGER },
                yourRank: { type: Type.STRING }, // Accepts both numbers or "unindexed"
                gapVolume: { type: Type.INTEGER },
                difficulty: { type: Type.INTEGER },
                recommendation: { type: Type.STRING }
              },
              required: ["keyword", "competitorRank", "yourRank", "gapVolume", "difficulty", "recommendation"]
            }
          }
        }
      });

      const text = response.text || "";
      const jsonParsed = JSON.parse(text.trim());
      const gapsWithIds = jsonParsed.map((item: any, idx: number) => ({
        id: `gap-${Date.now()}-${idx}`,
        competitorUrl,
        targetUrl,
        ...item
      }));

      // Save to server state
      const db = loadDb();
      db.gaps = [...gapsWithIds, ...db.gaps].slice(0, 20);
      saveDb(db);

      res.json({ success: true, gaps: gapsWithIds, generatedBy: "Google Gemini 3.5-flash" });
    } catch (err: any) {
      console.error("Gap analysis failed, fallback triggered: ", err);
      res.json({ success: true, gaps: fallbacks, generatedBy: "Mock Fallback Engine" });
    }
  });

  // 5. Topic Clustering Engine
  app.post("/api/gemini/topic-clusters", async (req: Request, res: Response) => {
    const { keywords } = req.body;
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ success: false, error: "An array of keywords is required." });
    }

    const fallbacks: TopicCluster[] = [
      {
        id: `clus-${Date.now()}-1`,
        name: "SaaS Content Automation Strategy",
        volume: keywords.length * 1200,
        mainIntent: "commercial",
        keywordsCount: keywords.length,
        keywords: keywords,
        pillarTopic: "Pillar layout on integrating automated SEO scheduler pipelines",
        description: "Focuses on building authority around modern automated article generation and schedule distribution loops."
      }
    ];

    if (!aiClient) {
      return res.json({ success: true, clusters: fallbacks, generatedBy: "Mock AI (Local Playground Mode)" });
    }

    try {
      const prompt = `Classify and cluster this list of search keywords: [${keywords.join(", ")}] into structural target-intent clusters.
      Group them into logical clusters. For the main cluster, generate a JSON object conforming to this schema array representing topic clusters:
      [{
        "name": "Cluster Hub Name",
        "volume": number (cumulative target search volume estimation),
        "mainIntent": "commercial" | "transactional" | "informational" | "navigational",
        "keywordsCount": number of matched words belonging to cluster,
        "keywords": Array of strings (matched keywords),
        "pillarTopic": "Pillar content theme title recommendation to anchor this cluster",
        "description": "Brief educational description explaining this semantic search cluster context"
      }]`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "Topics Clusters array",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                volume: { type: Type.INTEGER },
                mainIntent: { type: Type.STRING, enum: ["commercial", "transactional", "informational", "navigational"] },
                keywordsCount: { type: Type.INTEGER },
                keywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                pillarTopic: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "volume", "mainIntent", "keywordsCount", "keywords", "pillarTopic", "description"]
            }
          }
        }
      });

      const text = response.text || "";
      const jsonParsed = JSON.parse(text.trim());
      const clustersWithIds = jsonParsed.map((item: any, idx: number) => ({
        id: `clus-${Date.now()}-${idx}`,
        ...item
      }));

      const db = loadDb();
      db.clusters = [...clustersWithIds, ...db.clusters].slice(0, 15);
      saveDb(db);

      res.json({ success: true, clusters: clustersWithIds, generatedBy: "Google Gemini 3.5-flash" });
    } catch (err: any) {
      console.error("Clustering failed, fallback triggered: ", err);
      res.json({ success: true, clusters: fallbacks, generatedBy: "Mock Fallback Engine" });
    }
  });

  // 6. AI Content Generator & On-Page SEO Optimizer
  app.post("/api/gemini/generate-content", async (req: Request, res: Response) => {
    const { title, targetKeywords, tone, outline } = req.body;
    if (!title || !targetKeywords || !Array.isArray(targetKeywords)) {
      return res.status(400).json({ success: false, error: "Title and target keywords listing are required." });
    }

    const keywordList = targetKeywords.join(", ");
    const voiceTone = tone || "professional";
    const userOutline = outline || "Introduction, Core Technical Advantages, Best optimization steps, Conclusion.";

    const fallbackMarkdown = `# ${title}

In a fast-evolving digital space, modern web properties face strict index constraints. Integrating structured tools accelerates growth.

## Core Pillars of ${title}

Deploying standard entity structures helps search engines spider and map core value pillars easily.

### 1. Keyword Integration
Including high-value target keywords like **${targetKeywords[0] || "ai analytics"}** improves relevance matches. Ensure that terms are woven organically into your heading tags.

### 2. Contextual Flow
Crafting detailed answers to conversational long-tail queries satisfies searchers immediately, reducing bounce metrics.

---

## Technical Performance Recommendations
- **Mobile Fluidity:** Use viewport-friendly containers.
- **Microdata Schema:** Inject WebSite profiles programmatically.
- **Fast Loadtimes:** Compress layouts and cache asset states.`;

    const fallbackPost: BlogPost = {
      id: `post-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-str0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      excerpt: `Unlocking the critical mechanics of ${title} using customized search automation frameworks.`,
      content: fallbackMarkdown,
      metaTitle: `${title} | Organic Search Playbook`,
      metaDescription: `Discover how to implement core parameters of ${title} aiming to hit ranks on: ${keywordList}.`,
      keywordsUsed: targetKeywords,
      status: "draft",
      wordCount: 742,
      readTime: 3,
      seoScore: 85,
      authorType: "Manual",
      createdAt: new Date().toISOString()
    };

    if (!aiClient) {
      // Save simulated draft
      const db = loadDb();
      db.posts = [fallbackPost, ...db.posts];
      
      const draftNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "content_generation",
        title: "AI Draft Generation",
        message: `Generated custom SEO draft: "${title}" (Estimated Score: 85/100).`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      if (!db.notifications) db.notifications = [];
      db.notifications = [draftNotif, ...db.notifications].slice(0, 50);

      saveDb(db);
      broadcastNotification(draftNotif);
      broadcastStateSync();

      return res.json({ success: true, post: fallbackPost, generatedBy: "Mock AI (Local Playground Mode)" });
    }

    try {
      const prompt = `Write an optimized long-form SEO blog post in markdown.
      Title: "${title}"
      Target Keywords to organically integrate: [${keywordList}]
      Voice Tone: "${voiceTone}"
      Content Outline: "${userOutline}"

      Provide the complete article, Meta Title, Meta Description, and an estimated SEO Score in raw JSON.
      Do not output any markdown codeblock markers at root (e.g. do not surround the JSON response with \`\`\`json). Return strictly pure valid JSON matching this schema:
      {
        "contentMarkdown": "fully structured long markdown string using standard markdown headers, bullets, formatting, and integrating target keywords organically",
        "excerpt": "one-sentence concise article summary for search cards list",
        "metaTitle": "SEO meta title (maximum 60 characters)",
        "metaDescription": "SEO meta description (maximum 160 characters, with high-intent keywords included)",
        "wordCount": number,
        "readTime": number (minutes),
        "seoScore": number (calculated on keyword usage density and header hierarchy from 70 to 100)
      }`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              contentMarkdown: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              metaTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              wordCount: { type: Type.INTEGER },
              readTime: { type: Type.INTEGER },
              seoScore: { type: Type.INTEGER }
            },
            required: ["contentMarkdown", "excerpt", "metaTitle", "metaDescription", "wordCount", "readTime", "seoScore"]
          }
        }
      });

      const text = response.text || "";
      const jsonParsed = JSON.parse(text.trim());

      const generatedPost: BlogPost = {
        id: `post-${Date.now()}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-str0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt: jsonParsed.excerpt,
        content: jsonParsed.contentMarkdown,
        metaTitle: jsonParsed.metaTitle,
        metaDescription: jsonParsed.metaDescription,
        keywordsUsed: targetKeywords,
        status: "draft",
        wordCount: jsonParsed.wordCount,
        readTime: jsonParsed.readTime,
        seoScore: jsonParsed.seoScore,
        authorType: "Manual",
        createdAt: new Date().toISOString()
      };

      const db = loadDb();
      db.posts = [generatedPost, ...db.posts];
      
      const finalNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "content_generation",
        title: "AI Draft Ready",
        message: `Success! Compiled long-form article "${title}" with target SEO score: ${generatedPost.seoScore}/100.`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      if (!db.notifications) db.notifications = [];
      db.notifications = [finalNotif, ...db.notifications].slice(0, 50);

      saveDb(db);
      broadcastNotification(finalNotif);
      broadcastStateSync();

      res.json({ success: true, post: generatedPost, generatedBy: "Google Gemini 3.5-flash" });
    } catch (err: any) {
      console.error("AI Generation failed, fallback simulation loaded: ", err);
      const db = loadDb();
      db.posts = [fallbackPost, ...db.posts];
      
      const errNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "content_generation",
        title: "AI Generation Done (Fallback)",
        message: `Generated fallback draft: "${title}" (Score: 85).`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      if (!db.notifications) db.notifications = [];
      db.notifications = [errNotif, ...db.notifications].slice(0, 50);

      saveDb(db);
      broadcastNotification(errNotif);
      broadcastStateSync();

      res.json({ success: true, post: fallbackPost, generatedBy: "Fallback Simulation Engine" });
    }
  });

  // 7. Trigger Autonomous SEO Agent loop
  app.post("/api/agents/run", async (req: Request, res: Response) => {
    const { agentId } = req.body;
    if (!agentId) {
      return res.status(400).json({ success: false, error: "Agent ID is required." });
    }

    const db = loadDb();
    const agentIndex = db.agents.findIndex(a => a.id === agentId);
    if (agentIndex === -1) {
      return res.status(404).json({ success: false, error: "Agent not found." });
    }

    const agent = db.agents[agentIndex];
    const selectKeyword = agent.targetKeywords[Math.floor(Math.random() * agent.targetKeywords.length)] || "autonomous ai seo workflows";

    // Build immediate title based on agent purpose & keyword
    const suggestedTitle = `Automating ${selectKeyword.charAt(0).toUpperCase() + selectKeyword.slice(1)} for Enterprise Growth`;

    let postToIncorporate: BlogPost;

    try {
      if (aiClient) {
        const prompt = `You are the autonomous SEO agent named "${agent.name}". Your objective: "${agent.purpose}".
        Focus on this select primary keyword: "${selectKeyword}".
        Write an advanced, highly authoritative, technical markdown blog post.
        Return strictly a valid JSON matching this schema:
        {
          "title": "complete SEO title",
          "contentMarkdown": "long-form post with H2/H3 headers incorporating '${selectKeyword}'",
          "excerpt": "concise cards overview",
          "metaTitle": "google index meta title",
          "metaDescription": "optimized snippet",
          "wordCount": number,
          "readTime": number,
          "seoScore": number
        }`;

        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                contentMarkdown: { type: Type.STRING },
                excerpt: { type: Type.STRING },
                metaTitle: { type: Type.STRING },
                metaDescription: { type: Type.STRING },
                wordCount: { type: Type.INTEGER },
                readTime: { type: Type.INTEGER },
                seoScore: { type: Type.INTEGER }
              },
              required: ["title", "contentMarkdown", "excerpt", "metaTitle", "metaDescription", "wordCount", "readTime", "seoScore"]
            }
          }
        });

        const text = response.text || "";
        const p = JSON.parse(text.trim());

        postToIncorporate = {
          id: `post-${Date.now()}`,
          title: p.title,
          slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          excerpt: p.excerpt,
          content: p.contentMarkdown,
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          keywordsUsed: [selectKeyword],
          status: "published", // Automatically published by autonomous agent!
          wordCount: p.wordCount,
          readTime: p.readTime,
          seoScore: p.seoScore,
          authorType: "AI Agent",
          agentId: agent.id,
          createdAt: new Date().toISOString()
        };
      } else {
        // Mock generation
        postToIncorporate = {
          id: `post-${Date.now()}`,
          title: suggestedTitle,
          slug: suggestedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          excerpt: `How an autonomous automated agent optimized web properties programmatically focusing on ${selectKeyword}.`,
          content: `# ${suggestedTitle}\n\nAutomated indexing protocols represent the ultimate SEO game-changer in 2026.\n\n## The Autonomous SEO Strategy\n\nBy matching entities with search intent automatically, our Agent continuously designs schema topologies and distributes markdown resources to web crawlers organic endpoints.`,
          metaTitle: `${suggestedTitle} | Optimized Agent Index`,
          metaDescription: `Discover technical implementation steps for ${selectKeyword} mapped and scheduled in real-time.`,
          keywordsUsed: [selectKeyword],
          status: "published",
          wordCount: 852,
          readTime: 4,
          seoScore: 91,
          authorType: "AI Agent",
          agentId: agent.id,
          createdAt: new Date().toISOString()
        };
      }

      // Update agent metrics & DB
      agent.generatedCount += 1;
      agent.lastRun = new Date().toISOString();
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (agent.frequency === "daily" ? 1 : 7));
      agent.nextRun = nextDate.toISOString();

      db.agents[agentIndex] = agent;
      db.posts = [postToIncorporate, ...db.posts];
      saveDb(db);

      res.json({ success: true, post: postToIncorporate, agent });
    } catch (e: any) {
      console.error("Agent execution cycle failed", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // 8. Notifications read endpoint
  app.post("/api/notifications/read", (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const db = loadDb();
      if (!db.notifications) db.notifications = [];
      const notifIndex = db.notifications.findIndex(n => n.id === id);
      if (notifIndex !== -1) {
        db.notifications[notifIndex].isRead = true;
        saveDb(db);
        broadcastStateSync();
      }
      res.json({ success: true, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. Read all notifications
  app.post("/api/notifications/read-all", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      if (db.notifications) {
        db.notifications = db.notifications.map(n => ({ ...n, isRead: true }));
        saveDb(db);
        broadcastStateSync();
      }
      res.json({ success: true, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 10. Clear notifications
  app.post("/api/notifications/clear", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      db.notifications = [];
      saveDb(db);
      broadcastStateSync();
      res.json({ success: true, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 11. Trigger dynamic simulated real-time WebSocket notification from UI
  app.post("/api/notifications/simulate", (req: Request, res: Response) => {
    try {
      const { type } = req.body;
      const db = loadDb();
      
      let notif: NotificationItem;
      const timestamp = new Date().toISOString();

      if (type === "ranking_change") {
        const keywords = ["semantic seo tool", "programmatic keyword clusters", "ai anchor theme optimizer"];
        const selected = keywords[Math.floor(Math.random() * keywords.length)];
        const boost = 5 + Math.floor(Math.random() * 20);
        const finalRank = 2 + Math.floor(Math.random() * 8);

        notif = {
          id: `notif-${Date.now()}`,
          type: "ranking_change",
          title: "Rank Escalated!",
          message: `Keyword '${selected}' jumped +${boost} spots to position #${finalRank} on Google Mobile index.`,
          isRead: false,
          createdAt: timestamp
        };

        // Update ranking history to demonstrate real-time tracking
        if (db.rankings) {
          const rankIndex = Math.floor(Math.random() * db.rankings.length);
          const rankToUpdate = db.rankings[rankIndex];
          if (rankToUpdate) {
            rankToUpdate.prevRank = rankToUpdate.currentRank;
            rankToUpdate.currentRank = finalRank;
            rankToUpdate.history = [...rankToUpdate.history, { date: "Today", rank: finalRank }].slice(-8);
          }
        }
      } else if (type === "opportunity") {
        const words = ["how to automate site crawl limits", "react schema structured payload", "competitor content metrics engine"];
        const keyword = words[Math.floor(Math.random() * words.length)];
        const vol = 1200 + Math.floor(Math.random() * 5000);
        notif = {
          id: `notif-${Date.now()}`,
          type: "opportunity",
          title: "Critical Search Gap Discovered",
          message: `Competitor ranks on top spot for '${keyword}' (Search Volume: ${vol.toLocaleString()}). Generate targeted pillar copy now.`,
          isRead: false,
          createdAt: timestamp
        };
      } else if (type === "content_generation") {
        notif = {
          id: `notif-${Date.now()}`,
          type: "content_generation",
          title: "Background AI Agent triggered",
          message: "Periodic sitemap spider crawler completed. Discovered fresh topical nodes suitable for clustering workflows.",
          isRead: false,
          createdAt: timestamp
        };
      } else {
        notif = {
          id: `notif-${Date.now()}`,
          type: "system_alert",
          title: "Technical Core Web Audit Complete",
          message: "System diagnosed mobile viewport optimization error solved automatically using static compression middleware.",
          isRead: false,
          createdAt: timestamp
        };
      }

      if (!db.notifications) db.notifications = [];
      db.notifications = [notif, ...db.notifications].slice(0, 50);
      saveDb(db);

      // Trigger WebSockets broadcast
      broadcastNotification(notif);
      broadcastStateSync();

      res.json({ success: true, notification: notif, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 12. Advanced reporting generator endpoint with Gemini + Smart templates
  app.post("/api/reports/generate", async (req: Request, res: Response) => {
    try {
      const { title, domain } = req.body;
      const targetDomain = domain || "my-saas-platform.com";
      const reportTitle = title || "SEO Performance Overview Index";

      const db = loadDb();

      let createdReport: SEOPerformanceReport;

      if (aiClient) {
        try {
          const prompt = `Generate a professional executive SEO audit report for the web domain: "${targetDomain}".
          Focus on providing high-value analytics insight. Title the report: "${reportTitle}".
          Do not include tags or backticks (no \`\`\`json). Return strictly pure valid JSON matching this schema:
          {
            "summary": "detailed 3-sentence performance overview mapping traffic levels and crawler patterns",
            "seoScore": number (calculated technical score between 75 and 100),
            "organicTraffic": number (estimated monthly search visitors between 10000 and 150000),
            "topInsights": [
              "string: Insight #1 (e.g., semantic keyword clustering effectiveness)",
              "string: Insight #2 (e.g., competitor gap opportunities to exploit)",
              "string: Insight #3 (e.g., page crawl audit recommendation or mobile index schemas)"
            ]
          }`;

          const response = await aiClient.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  seoScore: { type: Type.INTEGER },
                  organicTraffic: { type: Type.INTEGER },
                  topInsights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["summary", "seoScore", "organicTraffic", "topInsights"]
              }
            }
          });

          const json = JSON.parse((response.text || "").trim());

          createdReport = {
            id: `rep-${Date.now()}`,
            title: reportTitle,
            domain: targetDomain,
            createdAt: new Date().toISOString(),
            summary: json.summary,
            seoScore: json.seoScore,
            organicTraffic: json.organicTraffic,
            topInsights: json.topInsights
          };
        } catch (apiErr) {
          console.error("Gemini report generation failed, fallback trigger: ", apiErr);
          createdReport = getFallbackReport(reportTitle, targetDomain);
        }
      } else {
        createdReport = getFallbackReport(reportTitle, targetDomain);
      }

      // Merge and save
      if (!db.seoReports) db.seoReports = [];
      db.seoReports = [createdReport, ...db.seoReports];
      
      // Broadcast WebSocket notification about report compilation
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "system_alert",
        title: "SEO Performance Report Generated",
        message: `Compiled SEO report: "${createdReport.title}" targeting ${targetDomain} (SEO Score: ${createdReport.seoScore}/100).`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      db.notifications = [notif, ...(db.notifications || [])].slice(0, 50);
      saveDb(db);

      broadcastNotification(notif);
      broadcastStateSync();

      res.json({ success: true, report: createdReport, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  function getFallbackReport(title: string, domain: string): SEOPerformanceReport {
    const defaultTraffic = 45000 + Math.floor(Math.random() * 30000);
    const score = 80 + Math.floor(Math.random() * 15);
    return {
      id: `rep-${Date.now()}`,
      title: title,
      domain: domain,
      createdAt: new Date().toISOString(),
      seoScore: score,
      organicTraffic: defaultTraffic,
      summary: `Organic traffic levels for ${domain} have stabilized at approximately ${defaultTraffic.toLocaleString()} sessions per month. Content clusters are performing well, but competitor gap analysis indicates aggressive competitor schema implementations could cause future ranking decay.`,
      topInsights: [
        "A 12% rise in informational keyword rank visibility highlights outstanding semantic SEO content authority.",
        "Your site remains unindexed on 3 highCPC competitor search gap terms; focus immediate generation resources on saas backlinking tools.",
        "Solve the pending critical schema warnings to recover crawling budget speeds by up to 15%."
      ]
    };
  }


  // --- AUTO CMS WEBSITE PUBLISHING CHANNELS ---

  app.get("/sitemap.xml", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      const files = generateStaticCMSFiles(db);
      res.header("Content-Type", "application/xml");
      res.send(files.sitemapXml);
    } catch (e: any) {
      res.status(500).send(`<error>${e.message}</error>`);
    }
  });

  app.get("/robots.txt", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      const files = generateStaticCMSFiles(db);
      res.header("Content-Type", "text/plain");
      res.send(files.robotsTxt);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  });

  app.get("/rss.xml", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      const files = generateStaticCMSFiles(db);
      res.header("Content-Type", "application/xml");
      res.send(files.rssFeedXml);
    } catch (e: any) {
      res.status(500).send(`<error>${e.message}</error>`);
    }
  });


  // --- AUTONOMOUS QUEUE ENGINE API CONTROLLERS ---

  app.post("/api/automation/run-loop", async (req: Request, res: Response) => {
    try {
      const db = loadDb();
      await autoTriggerCompleteSEOCompanyFlow(db, aiClient, saveDb, broadcastStateSync, broadcastNotification);
      res.json({ success: true, message: "CEO Autonomous Multi-Agent Loop has run successfully." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/queues/status", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      const status = getQueueStatus(db);
      res.json({ success: true, status, jobs: db.scheduledJobs || [], logs: db.publishingLogs || [], automaton: db.automationLogs || [] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/queues/enqueue", (req: Request, res: Response) => {
    try {
      const { agentId, taskType, offsetSec } = req.body;
      const db = loadDb();
      const scheduledAt = new Date(Date.now() + (parseInt(offsetSec) || 0) * 1000).toISOString();
      const job = enqueueJob(db, agentId || "manual-admin", taskType, scheduledAt);
      saveDb(db);
      broadcastStateSync();
      res.json({ success: true, job });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/queues/reset", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      resetFailedJobs(db);
      saveDb(db);
      broadcastStateSync();
      res.json({ success: true, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/queues/clear", (req: Request, res: Response) => {
    try {
      const db = loadDb();
      clearCompletedJobs(db);
      saveDb(db);
      broadcastStateSync();
      res.json({ success: true, db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });


  // --- AUTONOMOUS SCRAPING & AUDIT ENGINES APIs ---

  app.post("/api/scrape", async (req: Request, res: Response) => {
    try {
      const { url, respectRobots } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: "Missing parameter 'url'" });
      }
      const result = await scrapeUrl(url, respectRobots !== false);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/crawl", async (req: Request, res: Response) => {
    try {
      const { url, maxPages } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: "Missing parameter 'url'" });
      }
      const db = loadDb();
      const limit = parseInt(maxPages) || 5;

      // Unblock client instantly. Running crawling thread as a polite async sub-process
      executeCrawlJob(db, url, limit, saveDb, broadcastStateSync);

      res.json({ 
        success: true, 
        message: `Autonomous Spider launched successfully. Mapped targets: ${url}. Mapped page limit: ${limit}` 
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/seo-audit", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: "Missing parameter 'url'" });
      }
      const db = loadDb();
      
      // 1. Scrap page
      const scraped = await scrapeUrl(url);
      
      // 2. Perform SEO audit through Agent
      const report = await runAISEOAuditAgent(scraped);

      // 3. Save to database history
      if (!db.siteAudits) db.siteAudits = [];
      db.siteAudits.unshift(report);

      // Create a notification
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "system_alert",
        title: "New SEO Audit Completed",
        message: `SEO Audit Agent evaluated "${url}". Computed score: ${report.seoScore}/100 with ${report.totalIssuesCount} actions flagged.`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift(notif);

      saveDb(db);
      broadcastStateSync();
      
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/competitor-analysis", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: "Missing parameter 'url' or competitor domain." });
      }
      const db = loadDb();
      
      // Parse hostname
      let domain = url;
      try {
        const parsed = new URL(url);
        domain = parsed.hostname;
      } catch {
        // Assume already domain or raw text
      }

      // 1. Scrape seed page
      const scraped = await scrapeUrl(url);

      // 2. Perform Competitor strategic assessment
      const report = await runAICompetitorAnalysisAgent(domain, [scraped]);

      // 3. Save to database reports
      if (!db.competitorReports) db.competitorReports = [];
      db.competitorReports.unshift(report);

      // Add as dynamic competitor strategy list too to feed main app strategies views!
      if (!db.competitorStrategies) db.competitorStrategies = [];
      db.competitorStrategies.unshift({
        id: `comp-strat-${Date.now()}`,
        domain,
        sharedKeywords: Math.floor(Math.random() * 20) + 10,
        authorityScore: report.overallScore,
        topKeywords: report.topCompetitorKeywords.map(k => ({
          keyword: k.keyword,
          trafficShare: k.density * 10,
          rank: Math.floor(Math.random() * 8) + 1
        })),
        strategyType: report.overallScore > 75 ? 'Content-Focused' : report.overallScore > 60 ? 'Balanced' : 'Technical',
        backlinksCount: report.backlinkSignalsScore * 12
      });

      // Notify
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "ranking_change",
        title: "Competitor Analysis Cached",
        message: `Competitor Analysis Agent evaluated domain: "${domain}". Strategy Mapped: "${report.strategyAssessment.substring(0, 80)}...". Score calculated: ${report.overallScore}/100.`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift(notif);

      saveDb(db);
      broadcastStateSync();

      res.json({ success: true, report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });


  // --- Vite & Production Static File Fallback Setup ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Launch background self-operating SEO automation loop daemon
  initBackgroundAutomation(
    loadDb,
    saveDb,
    aiClient,
    broadcastStateSync,
    broadcastNotification
  );

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Express and WebSocket server running on http://localhost:${PORT}`);
  });
}

startServer();
