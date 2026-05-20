import { DatabaseSchema, ScheduledJob } from "../src/types";

export interface QueueStatus {
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
}

export function getQueueStatus(db: DatabaseSchema): QueueStatus {
  const jobs = db.scheduledJobs || [];
  return {
    total: jobs.length,
    pending: jobs.filter(j => j.status === "pending").length,
    running: jobs.filter(j => j.status === "running").length,
    completed: jobs.filter(j => j.status === "completed").length,
    failed: jobs.filter(j => j.status === "failed").length
  };
}

export function enqueueJob(
  db: DatabaseSchema,
  agentId: string,
  taskType: ScheduledJob['taskType'],
  scheduledAt: string = new Date().toISOString(),
  maxAttempts: number = 3
): ScheduledJob {
  const newJob: ScheduledJob = {
    id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    agentId,
    taskType,
    scheduledAt,
    status: "pending",
    attempts: 0,
    maxAttempts
  };

  if (!db.scheduledJobs) db.scheduledJobs = [];
  db.scheduledJobs.push(newJob);
  return newJob;
}

export function clearCompletedJobs(db: DatabaseSchema): void {
  if (db.scheduledJobs) {
    db.scheduledJobs = db.scheduledJobs.filter(j => j.status !== "completed");
  }
}

export function resetFailedJobs(db: DatabaseSchema): void {
  if (db.scheduledJobs) {
    db.scheduledJobs = db.scheduledJobs.map(j => {
      if (j.status === "failed") {
        return {
          ...j,
          status: "pending",
          attempts: 0,
          scheduledAt: new Date().toISOString()
        };
      }
      return j;
    });
  }
}
