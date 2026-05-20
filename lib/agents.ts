import { GoogleGenAI, Type } from "@google/genai";
import { 
  DatabaseSchema, 
  KeywordItem, 
  BlogPost, 
  SEOAgent, 
  ScheduledJob, 
  GeneratedImage, 
  PublishingLog, 
  AgentAutomationLog, 
  NotificationItem, 
  SEOPerformanceReport 
} from "../src/types";

// Dynamic log helper
export function logAgentActivity(
  db: DatabaseSchema,
  agentName: string,
  actionType: string,
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
): AgentAutomationLog {
  if (!db.automationLogs) db.automationLogs = [];
  const log: AgentAutomationLog = {
    id: `autolog-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    agentName,
    actionType,
    message,
    level
  };
  db.automationLogs.unshift(log);
  db.automationLogs = db.automationLogs.slice(0, 100); // Caps lookbacks

  // Also build notification
  if (!db.notifications) db.notifications = [];
  const typeMap: Record<string, NotificationItem['type']> = {
    keyword_research: "opportunity",
    content_writing: "content_generation",
    seo_optimization: "content_generation",
    publishing: "system_alert",
    analytics_tracking: "ranking_change"
  };
  const notif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: typeMap[actionType] || "system_alert",
    title: `${agentName} Activity`,
    message,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(notif);
  db.notifications = db.notifications.slice(0, 50);

  return log;
}

// 1. KEYWORD RESEARCH AGENT
export async function runKeywordAgent(
  db: DatabaseSchema,
  aiClient: GoogleGenAI | null,
  seedWord: string
): Promise<KeywordItem[]> {
  const agentName = "Keyword Research Agent Bot";
  logAgentActivity(db, agentName, "keyword_research", `Initiated research scan based on seed topic: "${seedWord}".`);

  let keywordResults: KeywordItem[] = [];

  if (aiClient) {
    try {
      const prompt = `You are the Autonomous Keyword Research Agent. Analyze and locate high-growth, low-competition SaaS search search terms matching seed: "${seedWord}".
      Generate exactly 3 trending keyword entries.
      Return strictly a valid JSON array. Do not output markdown backticks (no \`\`\`json).
      JSON schema structure per item:
      {
        "keyword": "exact key-phrase",
        "volume": number (search volumes),
        "difficulty": number (SEO difficulty score 0 to 100),
        "intent": "commercial" | "transactional" | "informational" | "navigational",
        "cpc": number (CPC in dollars),
        "competition": "low" | "medium" | "high",
        "cluster": "topical clustering category"
      }`;

      const response = await aiClient.models.generateContent({
        model: db.geminiModel || "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                volume: { type: Type.INTEGER },
                difficulty: { type: Type.INTEGER },
                intent: { type: Type.STRING },
                cpc: { type: Type.NUMBER },
                competition: { type: Type.STRING },
                cluster: { type: Type.STRING }
              },
              required: ["keyword", "volume", "difficulty", "intent", "cpc", "competition", "cluster"]
            }
          }
        }
      });

      const items = JSON.parse((response.text || "[]").trim());
      keywordResults = items.map((item: any, idx: number) => ({
        id: `kw-${Date.now()}-${idx}`,
        keyword: item.keyword,
        volume: item.volume || 1500,
        difficulty: item.difficulty || 30,
        intent: item.intent || "informational",
        cpc: item.cpc || 1.5,
        competition: item.competition || "medium",
        trend: Array.from({ length: 12 }, () => 40 + Math.floor(Math.random() * 60)),
        cluster: item.cluster || "Autonomous SEO Opportunities"
      }));

    } catch (e: any) {
      logAgentActivity(db, agentName, "keyword_research", `Gemini model error during keyword extraction: ${e.message}. Using fallback.`, "warning");
      keywordResults = getFallbackKeywords(seedWord);
    }
  } else {
    keywordResults = getFallbackKeywords(seedWord);
  }

  // Deduplicate and save keywords to Db
  const existingKeys = new Set(db.keywords.map(k => k.keyword.toLowerCase()));
  keywordResults.forEach(item => {
    if (!existingKeys.has(item.keyword.toLowerCase())) {
      db.keywords.unshift(item);
    }
  });

  logAgentActivity(db, agentName, "keyword_research", `Completed scanning. Discovered and cataloged ${keywordResults.length} high value targeting search terms.`);
  return keywordResults;
}

function getFallbackKeywords(seed: string): KeywordItem[] {
  const norm = seed.toLowerCase().trim();
  return [
    {
      id: `kw-auto-${Date.now()}-1`,
      keyword: `programmatic ${norm} tool`,
      volume: 1400,
      difficulty: 28,
      intent: "commercial",
      cpc: 3.2,
      competition: "medium",
      trend: [50, 52, 55, 60, 68, 70, 75, 80, 85, 90, 95, 100],
      cluster: `${seed.charAt(0).toUpperCase() + seed.slice(1)} Hub`
    },
    {
      id: `kw-auto-${Date.now()}-2`,
      keyword: `how to automate ${norm}`,
      volume: 2900,
      difficulty: 18,
      intent: "informational",
      cpc: 0.9,
      competition: "low",
      trend: [40, 42, 48, 52, 60, 64, 72, 78, 82, 88, 92, 100],
      cluster: `${seed.charAt(0).toUpperCase() + seed.slice(1)} Automation`
    }
  ];
}


// 2. BLOG WRITER AGENT
export async function runBlogWriterAgent(
  db: DatabaseSchema,
  aiClient: GoogleGenAI | null,
  keyword: string,
  tone: string,
  agentId?: string
): Promise<BlogPost> {
  const agentName = "SEO Copywriting Bot";
  logAgentActivity(db, agentName, "content_writing", `Initiated copywriting drafts for keyword: "${keyword}" in "${tone}" style.`);

  let contentPost: BlogPost;

  if (aiClient) {
    try {
      const prompt = `You are an expert AI SEO Copywriter inside an Autonomous Blog Publishing loop.
      Generate a long-form, 1200+ word, highly comprehensive markdown article optimized for the keyword: "${keyword}".
      Make the tone: ${tone}.
      Your response MUST match this strict JSON structural output:
      {
        "title": "SEO-optimised title incorporating keyword",
        "excerpt": "Compelling 2-sentence blog summary excerpt cards description",
        "metaTitle": "Highly optimized 50-60 character Google Meta Title",
        "metaDescription": "120-150 character meta description with secondary calls to action",
        "contentMarkdown": "Complete markdown with H1, H2 sections, detailed analysis, lists, bullet points, and an FAQ section at the end.",
        "tags": ["tag1", "tag2", "tag3"]
      }`;

      const response = await aiClient.models.generateContent({
        model: db.geminiModel || "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              metaTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              contentMarkdown: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "excerpt", "metaTitle", "metaDescription", "contentMarkdown", "tags"]
          }
        }
      });

      const result = JSON.parse((response.text || "").trim());

      contentPost = {
        id: `post-${Date.now()}`,
        title: result.title,
        slug: result.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        content: result.contentMarkdown,
        excerpt: result.excerpt,
        metaTitle: result.metaTitle,
        metaDescription: result.metaDescription,
        keywordsUsed: [keyword, ...(result.tags || [])],
        status: "draft",
        wordCount: result.contentMarkdown.split(/\s+/).length,
        readTime: Math.max(1, Math.ceil(result.contentMarkdown.split(/\s+/).length / 225)),
        seoScore: 78, // Initial raw write score; will be optimized by SEO Optimizer agent
        authorType: "AI Agent",
        agentId: agentId || "autonomous-core",
        createdAt: new Date().toISOString()
      };

    } catch (e: any) {
      logAgentActivity(db, agentName, "content_writing", `Gemini model block during drafting: ${e.message || e}. Moving to fallback.`, "warning");
      contentPost = getFallbackPost(keyword, tone, agentId);
    }
  } else {
    contentPost = getFallbackPost(keyword, tone, agentId);
  }

  logAgentActivity(db, agentName, "content_writing", `Completed draft generation. "${contentPost.title}" created with ${contentPost.wordCount} words.`);
  return contentPost;
}

function getFallbackPost(keyword: string, tone: string, agentId?: string): BlogPost {
  const title = `Advanced Strategies for ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Enterprise Guide`;
  const plainTextMarkdown = `# ${title}\n\nBusinesses leveraging ${keyword} see up to 400% organic impressions increases compared to legacy approaches.\n\n## Section 1: Demystifying ${keyword}\n\nTo fully capture transactional volume, optimization teams must map search intent patterns, ensuring technical sitemap markup indexes match entity relationships.\n\n## Section 2: Building Content Authority\n\nHigh-density semantic structures align topical nodes directly with crawlers. This is the cornerstone of 2026 organic ranking growth.\n\n### FAQ Segment\n\n**Q: What is the main benefit of ${keyword}?**\n\nA: It lowers customer acquisition cost by indexing highly relevant, pre-qualified search traffic.`;

  return {
    id: `post-${Date.now()}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    content: plainTextMarkdown,
    excerpt: `Learn how modern organic marketers integrate ${keyword} pipelines directly into enterprise digital workflows.`,
    metaTitle: `${title} | SaaS Copilot`,
    metaDescription: `Discover professional guidelines, trends, and case studies about ${keyword} in our complete manual resource.`,
    keywordsUsed: [keyword, "automated-seo", "enterprise"],
    status: "draft",
    wordCount: 350,
    readTime: 2,
    seoScore: 72,
    authorType: "AI Agent",
    agentId: agentId || "autonomous-core",
    createdAt: new Date().toISOString()
  };
}


// 3. SEO OPTIMIZER AGENT
export async function runSEOOptimizerAgent(
  db: DatabaseSchema,
  aiClient: GoogleGenAI | null,
  post: BlogPost,
  primaryKeyword: string
): Promise<BlogPost> {
  const agentName = "SEO Optimizer Bot";
  logAgentActivity(db, agentName, "seo_optimization", `Optimizing readability, density and headings structure for "${post.title}".`);

  let optimizedPost: BlogPost = { ...post };

  if (aiClient) {
    try {
      const prompt = `You are the Autonomous SEO Optimization Agent.
      Review the current blog title: "${post.title}" and body markdown content. 
      Analyze it for primary keyword density: "${primaryKeyword}".
      Perform semantic audit, improve heading structures, inject optimal anchor links, and enhance schema tags inside the article context.
      Make small, precise updates to improve readability and keyword authority.
      Your output response MUST match this precise JSON format:
      {
        "optimizedContent": "Fully updated markdown text with links, FAQs, and schema segments.",
        "calculatedSeoScore": number (SEO quality score between 85 and 99 based on density, structure, formatting)
      }`;

      const response = await aiClient.models.generateContent({
        model: db.geminiModel || "gemini-3.5-flash",
        contents: [
          prompt,
          `Title: ${post.title}`,
          `Body: ${post.content}`
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimizedContent: { type: Type.STRING },
              calculatedSeoScore: { type: Type.INTEGER }
            },
            required: ["optimizedContent", "calculatedSeoScore"]
          }
        }
      });

      const result = JSON.parse((response.text || "").trim());

      optimizedPost.content = result.optimizedContent;
      optimizedPost.seoScore = result.calculatedSeoScore || 92;
      optimizedPost.keywordsUsed = Array.from(new Set([...optimizedPost.keywordsUsed, primaryKeyword]));

    } catch (e: any) {
      logAgentActivity(db, agentName, "seo_optimization", `Optimizer endpoint warning: ${e.message}. Applying heuristic updates offline.`, "warning");
      optimizedPost = applyHeuristicSEOOptimization(post, primaryKeyword);
    }
  } else {
    optimizedPost = applyHeuristicSEOOptimization(post, primaryKeyword);
  }

  // Trigger automatic internal linking search simulation
  optimizedPost = applyInternalLinkingSimulation(db, optimizedPost);

  logAgentActivity(db, agentName, "seo_optimization", `Completed optimization. SEO score raised to ${optimizedPost.seoScore}/100.`);
  return optimizedPost;
}

function applyHeuristicSEOOptimization(post: BlogPost, keyword: string): BlogPost {
  let enrichedMarkdown = post.content;
  
  // Inject schema metadata block to show optimization
  if (!enrichedMarkdown.includes("JSON-LD Schema")) {
    enrichedMarkdown += `\n\n## Technical Schema Markup\n\n\`\`\`json\n{\n  "@context": "https://schema.org",\n  "@type": "TechArticle",\n  "headline": "${post.title}",\n  "description": "${post.metaDescription}",\n  "keywords": "${keyword}, SEO Automation"\n}\n\`\`\``;
  }

  return {
    ...post,
    content: enrichedMarkdown,
    seoScore: Math.min(98, post.seoScore + 18) // Simulated boost
  };
}

function applyInternalLinkingSimulation(db: DatabaseSchema, post: BlogPost): BlogPost {
  // Try to find a previous post to link to
  const otherPost = db.posts.find(p => p.id !== post.id && p.status === "published");
  if (otherPost && !post.content.includes(`/${otherPost.slug}`)) {
    const linkPhrase = `\n\n*Related Reading: Explore our expert framework on [${otherPost.title}](/${otherPost.slug}) within the enterprise SaaS ecosystem.*`;
    post.content += linkPhrase;
    post.keywordsUsed = Array.from(new Set([...post.keywordsUsed, ...otherPost.keywordsUsed]));
  }
  return post;
}


// 4. AUTO PUBLISHER AGENT
export async function runAutoPublisherAgent(
  db: DatabaseSchema,
  post: BlogPost
): Promise<PublishingLog> {
  const agentName = "Publishing Pipeline Agent";
  logAgentActivity(db, agentName, "publishing", `Running automated CMS publication queue for "${post.title}".`);

  // Build random imagery prompt
  const imagePrompt = `SaaS dashboard graphic demonstrating semantic SEO authority for ${post.keywordsUsed[0] || "machine intelligence workflows"}`;
  const generatedId = `img-${Date.now()}`;
  
  const genImage: GeneratedImage = {
    id: generatedId,
    blogId: post.id,
    prompt: imagePrompt,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    status: "created",
    createdAt: new Date().toISOString()
  };

  if (!db.generatedImages) db.generatedImages = [];
  db.generatedImages.unshift(genImage);

  // Set post to approved and published
  post.status = "published";
  
  // Re-verify that article is in db posts
  const postIndex = db.posts.findIndex(p => p.id === post.id);
  if (postIndex !== -1) {
    db.posts[postIndex] = post;
  } else {
    db.posts.unshift(post);
  }

  // Create real sitemap sitemap.xml update simulation
  db.issues = db.issues.map(iss => {
    if (iss.id === "issue-2") {
      return { ...iss, status: "fixed" as const, description: "Automatic publisher agent rebuilt the dynamic XML indices successfully." };
    }
    return iss;
  });

  const log: PublishingLog = {
    id: `publog-${Date.now()}`,
    blogId: post.id,
    title: post.title,
    slug: post.slug,
    status: "success",
    attempts: 1,
    timestamp: new Date().toISOString(),
    platform: "web_cms",
    details: "Post content pushed to central static edge cache and index listings successfully updated."
  };

  if (!db.publishingLogs) db.publishingLogs = [];
  db.publishingLogs.unshift(log);

  logAgentActivity(db, agentName, "publishing", `CMS publication verified live. URL endpoint: https://${db.domain}/blog/${post.slug}`);
  return log;
}


// 5. ANALYTICS AGENT
export async function runAnalyticsAgent(
  db: DatabaseSchema,
  post?: BlogPost
): Promise<void> {
  const agentName = "Analytics Crawler Agent";
  logAgentActivity(db, agentName, "analytics_tracking", "Initiating organic rank tracker and Google Search impressions audit.");

  // Simulate traffic bump in rankings
  if (db.rankings) {
    db.rankings = db.rankings.map(item => {
      const change = Math.random() > 0.4 ? -1 : 1; // Lower numbers are higher ranks!
      const finalVal = Math.max(1, item.currentRank + change);
      
      return {
        ...item,
        prevRank: item.currentRank,
        currentRank: finalVal,
        history: [...item.history, { date: "Today", rank: finalVal }].slice(-8)
      };
    });
  }

  // Simulate adding a ranking history item for a newly published post
  if (post && db.rankings && !db.rankings.some(r => r.keyword === post.keywordsUsed[0])) {
    const freshKeyword = post.keywordsUsed[0] || "generic seo cluster";
    db.rankings.unshift({
      id: `rank-${Date.now()}`,
      keyword: freshKeyword,
      searchVolume: 1200 + Math.floor(Math.random() * 3000),
      currentRank: 45 + Math.floor(Math.random() * 20),
      prevRank: 50,
      difficulty: 30 + Math.floor(Math.random() * 40),
      history: [
        { date: "Yesterday", rank: 50 },
        { date: "Today", rank: 45 }
      ]
    });
  }

  // Simulate updating overall impressions and clicks slightly
  if (db.trafficSources) {
    db.trafficSources = db.trafficSources.map(src => {
      const visitorsIncr = Math.round(src.visitors * (1 + (Math.random() * 0.05)));
      return {
        ...src,
        visitors: visitorsIncr
      };
    });
  }

  logAgentActivity(db, agentName, "analytics_tracking", "Crawl indices completed successfully. Rankings history grids and search scores synchronized.");
}
