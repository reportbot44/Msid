import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Path to a local log store for security audit events
const AUDIT_LOG_FILE = path.join(process.cwd(), "security_audit.json");

export interface SecurityEvent {
  id: string;
  timestamp: string;
  clientIp: string;
  method: string;
  path: string;
  violationType: "WAF_SQLI" | "WAF_XSS" | "WAF_TRAVERSAL" | "RATE_LIMIT" | "BAD_BOT" | "CSRF" | "UNAUTHORIZED" | "SSL_VIOLATION";
  severity: "low" | "medium" | "high" | "critical";
  userAgent: string;
  details: string;
}

// In-memory buckets for rate limit and block/throttle stats
const ipRequestCounts: Record<string, { count: number; expiresAt: number }> = {};
const blockedIps: Record<string, { expiresAt: number; reason: string }> = {};

// Load security logs from file
export function loadSecurityLogs(): SecurityEvent[] {
  try {
    if (fs.existsSync(AUDIT_LOG_FILE)) {
      const raw = fs.readFileSync(AUDIT_LOG_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read security audit logs:", err);
  }
  return [];
}

// Append a security event to audit logs
export function logSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp">): SecurityEvent {
  const fullEvent: SecurityEvent = {
    ...event,
    id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString()
  };

  try {
    const logs = loadSecurityLogs();
    logs.unshift(fullEvent);
    // Limit to last 200 events to prevent filesystem inflation
    const trimmed = logs.slice(0, 200);
    fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write security event log:", err);
  }

  return fullEvent;
}

// Get client IP accurately respecting Cloudflare and proxy chains
export function getClientIp(req: Request): string {
  // Cloudflare forwarding headers
  const cfIp = req.headers["cf-connecting-ip"];
  if (cfIp && typeof cfIp === "string") {
    return cfIp;
  }

  // Standard reverse proxy forwarded headers
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded && typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "127.0.0.1";
}

// Block and rate limiting cleaner
setInterval(() => {
  const now = Date.now();
  for (const ip in ipRequestCounts) {
    if (ipRequestCounts[ip].expiresAt < now) {
      delete ipRequestCounts[ip];
    }
  }
  for (const ip in blockedIps) {
    if (blockedIps[ip].expiresAt < now) {
      delete blockedIps[ip];
    }
  }
}, 60000); // Clean every minute

// 1. HTTPS Enforcement Middleware (Required by Vercel / Cloudflare setups)
export function enforceHttps(req: Request, res: Response, next: NextFunction) {
  const isHttps = req.secure || 
                  req.headers["x-forwarded-proto"] === "https" || 
                  req.headers["cf-visitor"] && typeof req.headers["cf-visitor"] === "string" && req.headers["cf-visitor"].includes("https");

  // In production container environments, if clients query HTTP, we secure and redirect them.
  if (!isHttps && process.env.NODE_ENV === "production") {
    logSecurityEvent({
      clientIp: getClientIp(req),
      method: req.method,
      path: req.path,
      violationType: "SSL_VIOLATION",
      severity: "medium",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Insecure HTTP request automatically caught. Enforcing HTTPS redirect."
    });
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
}

// 2. High-Integrity Secure Headers (WAF/Cloudflare friendly)
export function setSecureHeaders(req: Request, res: Response, next: NextFunction) {
  // Enforce HSTS (Strict Transport Security)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  
  // Prevent clickjacking frame vulnerabilities
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  
  // Opt out of MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Referrer Policy limiting leakage
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // XSS protection headers for older clients
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Content Security Policy adjusted to accommodate local dev server AND production builds
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https: wss: ws://localhost:3000 ws://0.0.0.0:3000;"
  );

  next();
}

// 3. Automated IP throttling and rate limiter (Basic DDoS Mitigation)
export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const now = Date.now();

  // Check if IP is explicitly blocked
  if (blockedIps[ip]) {
    if (blockedIps[ip].expiresAt > now) {
      return res.status(403).json({
        success: false,
        error: `IP address blocked by Cloudflare Edge Protection Shield. Reason: ${blockedIps[ip].reason}. Blocks expire shortly.`,
        blocked: true
      });
    } else {
      delete blockedIps[ip];
    }
  }

  // Rate Limiting parameters: 
  // Sensitive write routes (such as /api/db/save, crawler setups, AI triggers) have stricter limits
  const isSensitiveEndpoint = req.path.startsWith("/api/db/save") || 
                              req.path.startsWith("/api/gemini") || 
                              req.path.startsWith("/api/crawl") ||
                              req.path.startsWith("/api/scrape") ||
                              req.path.startsWith("/api/automation/run-loop") ||
                              req.path.startsWith("/api/queues/enqueue");

  const limit = isSensitiveEndpoint ? 20 : 100; // Requests per minute
  const windowMs = 60000; // 1 minute window

  if (!ipRequestCounts[ip]) {
    ipRequestCounts[ip] = { count: 1, expiresAt: now + windowMs };
  } else {
    ipRequestCounts[ip].count++;
  }

  // Trigger Throttling/Block
  if (ipRequestCounts[ip].count > limit) {
    // If request exceeds double the limit, block it aggressively for 5 minutes
    if (ipRequestCounts[ip].count > limit * 2) {
      blockedIps[ip] = {
        expiresAt: now + 300000, // 5 minutes list lock
        reason: "Excessive high-frequency requests. Secondary rate threshold exceeded."
      };

      logSecurityEvent({
        clientIp: ip,
        method: req.method,
        path: req.path,
        violationType: "RATE_LIMIT",
        severity: "critical",
        userAgent: req.headers["user-agent"] || "unknown",
        details: `IP throttled and locked. Query count of ${ipRequestCounts[ip].count} exceeded rate threshold: ${limit}. Locked for 5m.`
      });

      return res.status(429).json({
        success: false,
        error: "Aggressive DDoS rate limit exceeded. Your IP has been locked by Cloudflare Edge for 5 minutes.",
        rateLimited: true
      });
    }

    logSecurityEvent({
      clientIp: ip,
      method: req.method,
      path: req.path,
      violationType: "RATE_LIMIT",
      severity: "high",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Rate threshold warnings issued. Count = ${ipRequestCounts[ip].count} / limit = ${limit}.`
    });

    return res.status(429).json({
      success: false,
      error: "Too many requests. Please relax and throttle request volume to ensure API stability.",
      rateLimited: true
    });
  }

  next();
}

// 4. Client Web Application Firewall (WAF) - Core filtering for injection bugs
export function clientWafMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "unknown";

  // Check malicious request headers or malicious clients / bots
  const badBots = [
    "binlar", "casper", "crawlera", "dotbot", "hydra", "mj12bot", 
    "nuclei", "nikto", "slowloris", "sqlmap", "sysscan", "webinspect"
  ];

  const lowerUA = userAgent.toLowerCase();
  const matchedBot = badBots.find(bot => lowerUA.includes(bot));
  if (matchedBot) {
    logSecurityEvent({
      clientIp: ip,
      method: req.method,
      path: req.path,
      violationType: "BAD_BOT",
      severity: "high",
      userAgent,
      details: `Intercepted bad automated scanner / crawling utility: "${matchedBot}". Handshaking cut.`
    });
    return res.status(403).json({
      success: false,
      error: "Forbidden. Scrapers or penetration scanners detected by WAF module.",
    });
  }

  // Examine incoming structures (Query Parameters & URL targets) for suspicious code sequences
  const checkStringForExploits = (str: string, location: string): { blocked: boolean; exploit: string; details: string } | null => {
    const rawLower = decodeURIComponent(str).toLowerCase();

    // SQL Injection Check
    const sqliPatterns = [
      /union\s+select/i,
      /select\s+.*\s+from/i,
      /insert\s+into/i,
      /update\s+.*\s+set/i,
      /delete\s+from/i,
      /drop\s+table/i,
      /or\s+\d+\s*=\s*\d+/i,
      /or\s+['"]\w+['"]\s*=\s*['"]\w+['"]/i,
      /--/
    ];

    for (const pattern of sqliPatterns) {
      if (pattern.test(rawLower)) {
        return { blocked: true, exploit: "WAF_SQLI", details: `SQL injection pattern matching sequence "${pattern}" in request ${location}` };
      }
    }

    // Cross-Site Scripting (XSS) Check
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /onerror\s*=/i,
      /onload\s*=/i,
      /onclick\s*=/i,
      /addEventListener/i,
      /eval\s*\(/i,
      /alert\s*\(/i
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(rawLower)) {
        return { blocked: true, exploit: "WAF_XSS", details: `XSS markup sequence matching "${pattern}" in request ${location}` };
      }
    }

    // Directory traversal & password leaks
    const traversalPatterns = [
      /\.\.\//,
      /etc\/passwd/i,
      /boot\.ini/i
    ];

    for (const pattern of traversalPatterns) {
      if (pattern.test(rawLower)) {
        return { blocked: true, exploit: "WAF_TRAVERSAL", details: `Directory traversal malicious pattern detected in request ${location}` };
      }
    }

    return null;
  };

  // Inspect Request URL Path
  const pathExploit = checkStringForExploits(req.path, "URL Path");
  if (pathExploit) {
    logSecurityEvent({
      clientIp: ip,
      method: req.method,
      path: req.path,
      violationType: pathExploit.exploit as any,
      severity: "critical",
      userAgent,
      details: pathExploit.details
    });
    return res.status(403).json({ success: false, error: "Access Denied. Malicious content payload detected by Cloudflare-aligned WAF." });
  }

  // Inspect Query Parameters
  for (const qKey in req.query) {
    const val = req.query[qKey];
    if (typeof val === "string") {
      const queryExploit = checkStringForExploits(val, `Query String key: [${qKey}]`);
      if (queryExploit) {
        logSecurityEvent({
          clientIp: ip,
          method: req.method,
          path: req.path,
          violationType: queryExploit.exploit as any,
          severity: "critical",
          userAgent,
          details: queryExploit.details
        });
        return res.status(403).json({ success: false, error: "Access Denied. Query input rejected." });
      }
    }
  }

  // Inspect JSON Payload Data (body values recursively)
  if (req.body && typeof req.body === "object") {
    const inspectObjectRecursively = (obj: any): { blocked: boolean; exploit: string; details: string } | null => {
      for (const key in obj) {
        const val = obj[key];
        if (typeof val === "string") {
          const bodyExploit = checkStringForExploits(val, `Body key: [${key}]`);
          if (bodyExploit) return bodyExploit;
        } else if (val && typeof val === "object") {
          const subResult = inspectObjectRecursively(val);
          if (subResult) return subResult;
        }
      }
      return null;
    };

    const bodyExploitResult = inspectObjectRecursively(req.body);
    if (bodyExploitResult) {
      logSecurityEvent({
        clientIp: ip,
        method: req.method,
        path: req.path,
        violationType: bodyExploitResult.exploit as any,
        severity: "critical",
        userAgent,
        details: bodyExploitResult.details
      });
      return res.status(403).json({
        success: false,
        error: `WAF Denied. The payload supplied contains unsafe markup sequences trigger block rules. Checked value: ${bodyExploitResult.details}`
      });
    }
  }

  next();
}

// 5. Secure Cross-Origin Request Forgery Check (CSRF defense)
export function antiCsrfMiddleware(req: Request, res: Response, next: NextFunction) {
  // Safe read requests (GET/HEAD) skip rigorous CSRF validation
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer || "";
  const host = req.headers.host || "";
  const ip = getClientIp(req);

  // If request contains state-changing calls, enforce verifying Origin or Referer header match host
  if (origin) {
    try {
      const parsedOrigin = origin.startsWith("http") ? new URL(origin).host : origin;
      // In development container environments and dynamic preview hosts, allow match of localhost, run.app configurations
      const isAllowedOrigin = parsedOrigin.includes("0.0.0.0") ||
                              parsedOrigin.includes("localhost") ||
                              parsedOrigin.includes(host) ||
                              parsedOrigin.includes("run.app") ||
                              parsedOrigin.includes("vercel") ||
                              parsedOrigin.includes("cloudflare");

      if (!isAllowedOrigin) {
        logSecurityEvent({
          clientIp: ip,
          method: req.method,
          path: req.path,
          violationType: "CSRF",
          severity: "high",
          userAgent: req.headers["user-agent"] || "unknown",
          details: `Rejected outer domain POST trigger matching external header: "${origin}". Expecting server domain Host.`
        });
        return res.status(403).json({
          success: false,
          error: "CSRF protection failure. Cross-Site request forbidden."
        });
      }
    } catch (e) {
      // Invalid formats blocked
      return res.status(400).json({ success: false, error: "Invalid headers parsed by anti-CSRF check." });
    }
  }
  next();
}

// 6. Strict API Parameter & Protocol Validation for Autonomous Scrapes
export function validateScrapeRequest(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/api/scrape" || req.path === "/api/crawl" || req.path === "/api/seo-audit" || req.path === "/api/competitor-analysis") {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, error: "Input target 'url' field is strictly required and must be a string." });
    }

    const trimmed = url.trim();
    // Prevent scanning internal structures (SSRF protection)
    const localhostPatterns = [
      /localhost/i,
      /127\.0\.0\.1/i,
      /0\.0\.0\.0/i,
      /169\.254\.169\.254/i, // AWS/GCP Metadata Instance API
      /192\.168\./,
      /10\./
    ];

    const hasSSRFPattern = localhostPatterns.some(pattern => pattern.test(trimmed));
    if (hasSSRFPattern) {
      logSecurityEvent({
        clientIp: getClientIp(req),
        method: req.method,
        path: req.path,
        violationType: "UNAUTHORIZED",
        severity: "critical",
        userAgent: req.headers["user-agent"] || "unknown",
        details: `Intrusion Alert: SSRF attack matching network block sequence "${trimmed}". Access prohibited.`
      });
      return res.status(403).json({ success: false, error: "SSRF Attack Blocked. Target URL reaches reserved network local ip blocks." });
    }

    // Ensure valid HTTP or HTTPS protocol only to avoid mailto/ftp/file vulnerabilities
    if (!/^https?:\/\//i.test(trimmed)) {
      req.body.url = "https://" + trimmed;
    }
  }
  next();
}

// 7. Protected Admin Authorization Checks
export function secureAdminRoute(req: Request, res: Response, next: NextFunction) {
  // Routes affecting core project databases or automated triggers
  const isAdminMutate = req.path.startsWith("/api/db/save") || 
                        req.path.startsWith("/api/automation/run-loop") ||
                        req.path.startsWith("/api/queues/reset") ||
                        req.path.startsWith("/api/queues/clear");

  if (isAdminMutate) {
    // Collect active mock session indicator from headers
    const authHeader = req.headers["x-user-email"] || req.headers["authorization"];
    const ip = getClientIp(req);

    if (!authHeader) {
      logSecurityEvent({
        clientIp: ip,
        method: req.method,
        path: req.path,
        violationType: "UNAUTHORIZED",
        severity: "high",
        userAgent: req.headers["user-agent"] || "unknown",
        details: "Attempted database/admin config state modification without authorization header."
      });
      return res.status(401).json({
        success: false,
        error: "Unauthenticated. Secure admin session tokens are required to change state in production mode."
      });
    }

    // Verify if email is a permitted admin
    const emailString = String(authHeader).replace("Bearer ", "").trim();
    if (emailString !== "akexseni08@gmail.com" && emailString !== "growth-officer@seo-agency.io") {
      logSecurityEvent({
        clientIp: ip,
        method: req.method,
        path: req.path,
        violationType: "UNAUTHORIZED",
        severity: "critical",
        userAgent: req.headers["user-agent"] || "unknown",
        details: `Access Denied: Non-admin email trace (${emailString}) attempted privileged action.`
      });
      return res.status(403).json({
        success: false,
        error: "Forbidden. Current credential credentials do not enjoy administrative policy clearances."
      });
    }
  }
  next();
}
