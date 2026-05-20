import { GoogleGenAI } from "@google/genai";
import { 
  DatabaseSchema, 
  ScheduledJob, 
  BlogPost, 
  NotificationItem, 
  PublishingLog 
} from "../src/types";
import { 
  runKeywordAgent, 
  runBlogWriterAgent, 
  runSEOOptimizerAgent, 
  runAutoPublisherAgent, 
  runAnalyticsAgent, 
  logAgentActivity 
} from "./agents";

// Continuous scheduler interval identifier
let activeLoopTimer: NodeJS.Timeout | null = null;

// Initialize background scheduler
export function initBackgroundAutomation(
  loadDb: () => DatabaseSchema,
  saveDb: (data: DatabaseSchema) => void,
  aiClient: GoogleGenAI | null,
  broadcastStateSync: () => void,
  broadcastNotification: (notif: NotificationItem) => void
) {
  if (activeLoopTimer) {
    clearInterval(activeLoopTimer);
    console.log("[AutomationScheduler] Resetting active scheduled daemon thread...");
  }

  // Scan and execute queued items every 15 seconds for hot demo feel!
  // In production, this would trigger deep cron jobs
  activeLoopTimer = setInterval(async () => {
    try {
      const db = loadDb();
      if (!db.scheduledJobs) db.scheduledJobs = [];

      // Check if any job is currently scheduled and pending
      const pendingJob = db.scheduledJobs.find(job => job.status === "pending" && new Date(job.scheduledAt) <= new Date());
      if (pendingJob) {
        console.log(`[AutomationScheduler] Found pending task: ID=${pendingJob.id}, Type=${pendingJob.taskType}`);
        await executeJob(db, pendingJob, aiClient, saveDb, broadcastStateSync, broadcastNotification);
      } else {
        // Auto-feed simulation: If there are no pending tasks, simulate an autonomous agent cycle
        // to maintain continuous generation and showcase "SaaS Company" self-operation!
        const randomChance = Math.random();
        if (randomChance < 0.15) { // 15% checking slot triggers auto discovery loop!
          console.log("[AutomationScheduler] Triggering autonomous daily Keyword discovery cycle...");
          await autoTriggerCompleteSEOCompanyFlow(db, aiClient, saveDb, broadcastStateSync, broadcastNotification);
        }
      }
    } catch (err) {
      console.error("[AutomationScheduler] Thread execution error:", err);
    }
  }, 15000);

  console.log("[AutomationScheduler] Background self-driving SaaS engine active (Running interval scanning loop).");
}

// Full Orchestrator Flow: Keyword -> Writer -> Optimizer -> Publisher -> Analytics
export async function autoTriggerCompleteSEOCompanyFlow(
  db: DatabaseSchema,
  aiClient: GoogleGenAI | null,
  saveDb: (data: DatabaseSchema) => void,
  broadcastStateSync: () => void,
  broadcastNotification: (notif: NotificationItem) => void
): Promise<void> {
  const seedWords = ["competitor metrics API", "crawl budget limits", "static web schemas", "react visual charts", "backlinks strategy"];
  const seed = seedWords[Math.floor(Math.random() * seedWords.length)];

  // Create job queue log items
  const baseJobId = `pipe-${Date.now()}`;
  logAgentActivity(db, "CEO AI Coordinator", "keyword_research", `Auto-Triggered Multi-Agent SEO Company pipeline targeting: "${seed}"`);

  try {
    // 1. Keyword Research Agent finds keyword
    const keywords = await runKeywordAgent(db, aiClient, seed);
    const selectedKeywordItem = keywords[0];
    const targetKeyword = selectedKeywordItem ? selectedKeywordItem.keyword : `automated ${seed} optimization`;

    // 2. Content Agent writes article
    const rawDraft = await runBlogWriterAgent(db, aiClient, targetKeyword, "professional");

    // 3. SEO Agent optimizes article
    const optimizedPost = await runSEOOptimizerAgent(db, aiClient, rawDraft, targetKeyword);

    // 4. Publisher Agent publishes blog
    await runAutoPublisherAgent(db, optimizedPost);

    // 5. Analytics Agent tracks performance
    await runAnalyticsAgent(db, optimizedPost);

    // Final global alert
    const pipelineCompleteNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: "content_generation",
      title: "AI SEO Pipeline Completed",
      message: `CEO Autonomous Loop succeeded! Discovered, compiled, optimized, and published: "${optimizedPost.title}".`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift(pipelineCompleteNotif);
    
    saveDb(db);
    broadcastNotification(pipelineCompleteNotif);
    broadcastStateSync();

  } catch (err: any) {
    console.error("[AutonomousPipeline] Complete Flow Failed: ", err);
    logAgentActivity(db, "CEO AI Coordinator", "publishing", `Autonomous Pipeline Failed: ${err.message || err}`, "error");
    saveDb(db);
  }
}

// Scheduled Job Executon Engine with automatic retries and failed jobs logger
export async function executeJob(
  db: DatabaseSchema,
  job: ScheduledJob,
  aiClient: GoogleGenAI | null,
  saveDb: (data: DatabaseSchema) => void,
  broadcastStateSync: () => void,
  broadcastNotification: (notif: NotificationItem) => void
): Promise<void> {

  job.status = "running";
  job.attempts += 1;
  saveDb(db);
  broadcastStateSync();

  try {
    const activeAgent = db.agents.find(a => a.id === job.agentId) || {
      name: "Default Scheduled Bot",
      voiceTone: "professional" as const,
      topicHub: "General Audits"
    };

    if (job.taskType === "keyword_research") {
      const seed = activeAgent.topicHub || "programmatic metrics";
      await runKeywordAgent(db, aiClient, seed);

    } else if (job.taskType === "content_writing" || job.taskType === "seo_optimization") {
      // Pick a random keyword from target keywords or research keywords
      const keysAvailable = db.keywords.slice(0, 5).map(k => k.keyword);
      const queryKeyword = keysAvailable[Math.floor(Math.random() * keysAvailable.length)] || "automated web index limits";

      // Write blog
      const draft = await runBlogWriterAgent(db, aiClient, queryKeyword, activeAgent.voiceTone, job.agentId);
      
      // Optimize blog
      const optimized = await runSEOOptimizerAgent(db, aiClient, draft, queryKeyword);

      // Publish blog
      await runAutoPublisherAgent(db, optimized);

      // Save to listings
      db.posts.unshift(optimized);

    } else if (job.taskType === "publishing") {
      const draftPost = db.posts.find(p => p.status === "draft");
      if (draftPost) {
        await runAutoPublisherAgent(db, draftPost);
      } else {
        throw new Error("No pending blog posts in Draft status found in CMS queue.");
      }

    } else if (job.taskType === "analytics_tracking") {
      await runAnalyticsAgent(db);

    } else {
      // General fallbacks
      await runAnalyticsAgent(db);
    }

    // Success transition
    job.status = "completed";
    job.completedAt = new Date().toISOString();
    logAgentActivity(db, "System Scheduler", job.taskType, `Successfully completed task ID=${job.id}.`);

  } catch (e: any) {
    console.error(`[AutomationScheduler] Error executing job ID ${job.id}:`, e);
    
    job.errorMessage = e.message || "Unknown execution timeout error";
    
    if (job.attempts < job.maxAttempts) {
      job.status = "pending"; // Requeue for retry
      const backoffSec = Math.pow(2, job.attempts) * 10; // Exponential backup coordinates
      job.scheduledAt = new Date(Date.now() + backoffSec * 1000).toISOString();
      
      logAgentActivity(
        db, 
        "System Scheduler", 
        job.taskType, 
        `Job execution attempt #${job.attempts} failed: ${job.errorMessage}. Retrying in ${backoffSec}s.`,
        "warning"
      );
    } else {
      job.status = "failed";
      logAgentActivity(
        db, 
        "System Scheduler", 
        job.taskType, 
        `Job permanently failed after ${job.attempts}/${job.maxAttempts} attempts: ${job.errorMessage}. logged as failed_job.`,
        "error"
      );
    }
  }

  saveDb(db);
  broadcastStateSync();
}

// Add a new scheduled job helper
export function pushNewScheduledJob(
  db: DatabaseSchema,
  agentId: string,
  taskType: ScheduledJob['taskType'],
  scheduledAt: string
): ScheduledJob {
  const newJob: ScheduledJob = {
    id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    agentId,
    taskType,
    scheduledAt,
    status: "pending",
    attempts: 0,
    maxAttempts: 3
  };

  if (!db.scheduledJobs) db.scheduledJobs = [];
  db.scheduledJobs.push(newJob);
  return newJob;
}
