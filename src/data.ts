import { DatabaseSchema, AnalyticsData } from './types';

export const initialDatabase: DatabaseSchema = {
  domain: "my-saas-platform.com",
  openaiKey: "",
  geminiModel: "gemini-3.5-flash",
  keywords: [
    {
      id: "kw-1",
      keyword: "ai content optimization tool",
      volume: 4800,
      difficulty: 42,
      intent: "commercial",
      cpc: 3.45,
      competition: "medium",
      trend: [60, 65, 72, 80, 95, 100, 110, 115, 120, 118, 125, 130],
      cluster: "AI content Generation"
    },
    {
      id: "kw-2",
      keyword: "what is semantic seo",
      volume: 8500,
      difficulty: 28,
      intent: "informational",
      cpc: 1.20,
      competition: "low",
      trend: [80, 82, 85, 90, 88, 92, 95, 100, 102, 105, 112, 120],
      cluster: "SEO Learning Hub"
    },
    {
      id: "kw-3",
      keyword: "best programmatic seo dashboard",
      volume: 1200,
      difficulty: 64,
      intent: "transactional",
      cpc: 8.50,
      competition: "high",
      trend: [20, 35, 40, 50, 55, 62, 70, 75, 82, 88, 95, 100],
      cluster: "Programmatic SEO"
    },
    {
      id: "kw-4",
      keyword: "competitor content gap analyzer",
      volume: 2400,
      difficulty: 38,
      intent: "commercial",
      cpc: 4.10,
      competition: "medium",
      trend: [70, 72, 75, 78, 80, 82, 85, 90, 92, 95, 98, 100],
      cluster: "Competitor Intelligence"
    },
    {
      id: "kw-5",
      keyword: "automated blog scheduler",
      volume: 3200,
      difficulty: 51,
      intent: "transactional",
      cpc: 5.80,
      competition: "high",
      trend: [50, 55, 58, 62, 70, 75, 78, 82, 85, 90, 95, 100],
      cluster: "SEO Automation"
    }
  ],
  posts: [
    {
      id: "post-1",
      title: "The Ultimate Guide to Semantic SEO Optimization in 2026",
      slug: "ultimate-guide-semantic-seo-2026",
      excerpt: "Learn how modern search engines understand context, entity relationships, and conversational search intent to outrank traditional keyword matching.",
      content: `# The Ultimate Guide to Semantic SEO Optimization in 2026

Modern search engines are no longer just simple keyword matchers. They are advanced contextual semantic understanding engines.

## What is Semantic SEO?

Semantic SEO is the process of optimizing web pages around whole topics rather than single density-specific keywords. By targeting entity relationships, topical depth, and structured schema markup, you help search engines grasp the comprehensive context of your domain.

### Why Entities Matter More Than Keywords

1. **Context Over Frequency:** Search engines map words to a real-world Knowledge Graph.
2. **Intent Matching:** Designing for the distinct phases of user learning.
3. **Structured Content Gaps:** Meeting competitor topics comprehensively.

### Core Implementation Framework

Ensure that you introduce **structured table schemas**, entity relationships, and schema graphs directly in your layouts. This signals authority and satisfies modern generative engines.`,
      metaTitle: "Ultimate Guide to Semantic SEO in 2026 | SEO Copilot",
      metaDescription: "Master contextual search, Knowledge Graphs, and topical entity matching to skyrocket your modern SEO campaign.",
      keywordsUsed: ["what is semantic seo", "ai content optimization tool"],
      status: "published",
      wordCount: 1540,
      readTime: 6,
      seoScore: 94,
      authorType: "AI Agent",
      createdAt: "2026-05-18T14:32:00Z"
    },
    {
      id: "post-2",
      title: "Why Dynamic Programmatic SEO is the Tech Pivot of the Decade",
      slug: "programmatic-seo-tech-pivot",
      excerpt: "How automated, database-driven landing pages are turning startup SEO into a quantitative mathematical game.",
      content: `# why Dynamic Programmatic SEO is the Tech Pivot of the Decade

In a world where speed determines survival, manual single-page blog generation cannot keep pace with dynamic long-tail intent. Enter **Programmatic SEO**.

## The Automation Playbook

Startups are generating thousands of hyper-focused, structurally perfect pages programmatically using real data sources.

- **Fast Indexation:** Google values robust, data-dense pages.
- **Micro-Targeting:** Bending the long-tail keywords to your advantage.
- **Dynamic Content Insertion:** Updating metrics programmatically to maintain high content fresh scores.`,
      metaTitle: "Programmatic SEO: The Quantitative Playbook | Tech Insight",
      metaDescription: "How startups are automating top-of-funnel directories and database-driven landing pages to capture long-tail growth.",
      keywordsUsed: ["best programmatic seo dashboard"],
      status: "scheduled",
      scheduledFor: "2026-05-22T09:00:00Z",
      wordCount: 1120,
      readTime: 4,
      seoScore: 88,
      authorType: "AI Agent",
      createdAt: "2026-05-19T08:15:00Z"
    }
  ],
  agents: [
    {
      id: "agent-1",
      name: "Core Tech Blog Agent",
      purpose: "Automated high-quality technical blog generation targeting developer and SaaS SEO keyword listings.",
      targetKeywords: ["ai content optimization tool", "what is semantic seo"],
      voiceTone: "professional",
      frequency: "daily",
      status: "active",
      lastRun: "2026-05-19T14:30:00Z",
      nextRun: "2026-05-20T14:30:00Z",
      topicHub: "Core AI Marketing",
      generatedCount: 15
    },
    {
      id: "agent-2",
      name: "Long-Tail Intent Harvester",
      purpose: "Discovers low-difficulty transactional and commercial customer queries and designs optimized landing pages.",
      targetKeywords: ["competitor content gap analyzer", "automated blog scheduler"],
      voiceTone: "creative",
      frequency: "weekly",
      status: "paused",
      lastRun: "2026-05-15T09:00:00Z",
      nextRun: "2026-05-22T09:00:00Z",
      topicHub: "Competitor Conquest",
      generatedCount: 6
    }
  ],
  clusters: [
    {
      id: "clus-1",
      name: "AI Content Automation Hub",
      volume: 12500,
      mainIntent: "commercial",
      keywordsCount: 4,
      keywords: ["ai content optimization tool", "automated blog scheduler", "ai article generation editor", "saas content scheduler"],
      pillarTopic: "Programmatic AI SEO strategies for scale",
      description: "Optimizing top-of-funnel creation using natural language processing engines to meet informational intent rapidly."
    },
    {
      id: "clus-2",
      name: "Competitor SEO Intelligence",
      volume: 6800,
      mainIntent: "commercial",
      keywordsCount: 3,
      keywords: ["competitor content gap analyzer", "seo content gaps analysis tool", "how to map competitor keyterms"],
      pillarTopic: "Uncovering and dominating search engine gaps",
      description: "Analytical strategies using search data to target queries where competitors are weak or unindexed."
    }
  ],
  gaps: [
    {
      id: "gap-1",
      competitorUrl: "hubtrack.io",
      targetUrl: "my-saas-platform.com",
      keyword: "saas automated backlinking dashboard",
      competitorRank: 3,
      yourRank: "unindexed",
      gapVolume: 1800,
      difficulty: 45,
      recommendation: "Generate a targeted comparative breakdown page comparing HubSpot solutions with our programmatic indexers."
    },
    {
      id: "gap-2",
      competitorUrl: "seo-giant-com",
      targetUrl: "my-saas-platform.com",
      keyword: "keyword cluster mapping generator",
      competitorRank: 5,
      yourRank: 48,
      gapVolume: 3400,
      difficulty: 32,
      recommendation: "Create a rich Topic Cluster landing hub with dynamic visualization components to outclass competitor static charts."
    }
  ],
  issues: [
    {
      id: "issue-1",
      title: "Missing Structured Schema Graf.json on Core Landing Pages",
      category: "critical",
      description: "Search engines are struggling to tie product entities correctly. Missing JSON-LD WebSite and SoftwareApplication schemas.",
      status: "pending"
    },
    {
      id: "issue-2",
      title: "Crawl-Rate Limit Warning (Sitemap Index Size)",
      category: "warning",
      description: "Sitemap contains duplicate redirection URLs which will deplete budget indexes on deep content crawls.",
      status: "pending"
    },
    {
      id: "issue-3",
      title: "Optimize Image ALT Text on Product Features",
      category: "info",
      description: "Feature showcase images have default empty descriptions. Update to semantic screen-reader friendly strings.",
      status: "fixed"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      type: "content_generation",
      title: "AI Generation Successful",
      message: "Autonomous agent 'Core Tech Blog Agent' has generated and published 'The Ultimate Guide to Semantic SEO' with a score of 94/100.",
      isRead: false,
      createdAt: "2026-05-19T14:32:00Z"
    },
    {
      id: "notif-2",
      type: "ranking_change",
      title: "Google Ranking Jump!",
      message: "Your keyword 'best programmatic seo dashboard' moved from rank #34 to #12 (+22 spots) following meta optimization.",
      isRead: false,
      createdAt: "2026-05-18T10:15:00Z"
    },
    {
      id: "notif-3",
      type: "opportunity",
      title: "High Value Keyword Gap Discovered",
      message: "Competitor 'hubtrack.io' ranks #3 for 'saas automated backlinking dashboard' with monthly volume 1,800. We are currently unindexed.",
      isRead: true,
      createdAt: "2026-05-17T08:00:00Z"
    },
    {
      id: "notif-4",
      type: "system_alert",
      title: "Technical SEO Audit Done",
      message: "Crawl complete. We detected 1 critical schema issue (Missing JSON-LD structured schema on landing pages) and 1 warning.",
      isRead: true,
      createdAt: "2026-05-16T11:45:00Z"
    }
  ],
  rankings: [
    {
      id: "rank-1",
      keyword: "ai content optimization tool",
      searchVolume: 4800,
      currentRank: 8,
      prevRank: 14,
      difficulty: 42,
      history: [
        { date: "May 13", rank: 16 },
        { date: "May 14", rank: 14 },
        { date: "May 15", rank: 14 },
        { date: "May 16", rank: 12 },
        { date: "May 17", rank: 11 },
        { date: "May 18", rank: 9 },
        { date: "May 19", rank: 8 },
        { date: "May 20", rank: 8 }
      ]
    },
    {
      id: "rank-2",
      keyword: "what is semantic seo",
      searchVolume: 8500,
      currentRank: 4,
      prevRank: 5,
      difficulty: 28,
      history: [
        { date: "May 13", rank: 7 },
        { date: "May 14", rank: 7 },
        { date: "May 15", rank: 6 },
        { date: "May 16", rank: 5 },
        { date: "May 17", rank: 5 },
        { date: "May 18", rank: 5 },
        { date: "May 19", rank: 4 },
        { date: "May 20", rank: 4 }
      ]
    },
    {
      id: "rank-3",
      keyword: "best programmatic seo dashboard",
      searchVolume: 1200,
      currentRank: 12,
      prevRank: 34,
      difficulty: 64,
      history: [
        { date: "May 13", rank: 36 },
        { date: "May 14", rank: 35 },
        { date: "May 15", rank: 34 },
        { date: "May 16", rank: 34 },
        { date: "May 17", rank: 28 },
        { date: "May 18", rank: 21 },
        { date: "May 19", rank: 14 },
        { date: "May 20", rank: 12 }
      ]
    },
    {
      id: "rank-4",
      keyword: "competitor content gap analyzer",
      searchVolume: 2400,
      currentRank: 15,
      prevRank: 16,
      difficulty: 38,
      history: [
        { date: "May 13", rank: 19 },
        { date: "May 14", rank: 18 },
        { date: "May 15", rank: 18 },
        { date: "May 16", rank: 17 },
        { date: "May 17", rank: 17 },
        { date: "May 18", rank: 16 },
        { date: "May 19", rank: 15 },
        { date: "May 20", rank: 15 }
      ]
    }
  ],
  competitorStrategies: [
    {
      id: "comp-1",
      domain: "hubtrack.io",
      sharedKeywords: 42,
      authorityScore: 78,
      strategyType: "Balanced",
      backlinksCount: 14300,
      topKeywords: [
        { keyword: "automated backlink tool saas", trafficShare: 0.18, rank: 2 },
        { keyword: "b2b programmatic marketing system", trafficShare: 0.12, rank: 4 },
        { keyword: "integrated outbound flow tracker", trafficShare: 0.08, rank: 3 }
      ]
    },
    {
      id: "comp-2",
      domain: "seo-giant.com",
      sharedKeywords: 110,
      authorityScore: 89,
      strategyType: "Content-Focused",
      backlinksCount: 95400,
      topKeywords: [
        { keyword: "seo training guides ultimate", trafficShare: 0.25, rank: 1 },
        { keyword: "on-page optimization checks", trafficShare: 0.14, rank: 2 },
        { keyword: "semantic outline schema creator", trafficShare: 0.09, rank: 3 }
      ]
    },
    {
      id: "comp-3",
      domain: "write-fast-ai.com",
      sharedKeywords: 25,
      authorityScore: 62,
      strategyType: "Content-Focused",
      backlinksCount: 2100,
      topKeywords: [
        { keyword: "unlimited ai blogger software", trafficShare: 0.32, rank: 1 },
        { keyword: "bulk article rewrite tool api", trafficShare: 0.15, rank: 2 }
      ]
    }
  ],
  trafficSources: [
    { source: "Google Organic Search", visitors: 42350, percentage: 55, trend: [3100, 3120, 3200, 3190, 3350, 3420, 3500], bounceRate: 41.2 },
    { source: "Direct Traffic", visitors: 19250, percentage: 25, trend: [1100, 1150, 1180, 1200, 1190, 1210, 1250], bounceRate: 34.8 },
    { source: "Referral (Medium / Dev.to)", visitors: 10780, percentage: 14, trend: [500, 520, 560, 550, 590, 610, 680], bounceRate: 48.5 },
    { source: "Social Channels (LinkedIn, X)", visitors: 4620, percentage: 6, trend: [200, 210, 240, 230, 260, 280, 310], bounceRate: 58.2 }
  ],
  seoReports: [
    {
      id: "rep-1",
      title: "Quarterly Organic Growth & Competitor Audit",
      domain: "my-saas-platform.com",
      createdAt: "2026-05-19T10:00:00Z",
      seoScore: 88,
      organicTraffic: 42350,
      summary: "This report reviews the performance optimization sprint from May 2026. Search share has risen by 14.2% following content cluster mappings, while average Google Search positions improved by -1.3 slots.",
      topInsights: [
        "Semantic SEO cluster setup in AI content generation drives 42% of our search impression traffic, indicating high topical credibility.",
        "Competitor gap highlights hubtrack.io maintains dominance on core backlink terms; recommend building 3 deep comparison silos.",
        "Mobile schema audit solved: we corrected schema graphs, which improved Google crawling speed index by 25%."
      ]
    },
    {
      id: "rep-2",
      title: "On-Page Semantic Strategy Review",
      domain: "my-saas-platform.com",
      createdAt: "2026-04-15T09:30:00Z",
      seoScore: 82,
      organicTraffic: 37100,
      summary: "A snapshot of core landing pages, evaluating headings structure and entity schema. Highly focused on programmatic key distribution channels.",
      topInsights: [
        "Schema payloads are missing on deeper sub-pages, causing low rich snippet impressions.",
        "Intent matching shows our informational keyword groups carry higher organic click-through rates than the commercial clusters."
      ]
    }
  ],
  users: [
    {
      id: "usr-1",
      email: "akexseni08@gmail.com",
      role: "admin",
      tier: "Enterprise",
      createdAt: "2026-05-18T10:00:00Z"
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "SaaS Platform Engine",
      domain: "my-saas-platform.com",
      status: "active",
      createdAt: "2026-05-18T10:05:00Z"
    }
  ],
  scheduledJobs: [
    {
      id: "job-1",
      agentId: "agent-1",
      taskType: "keyword_research",
      scheduledAt: "2026-05-20T12:00:00Z",
      status: "pending",
      attempts: 0,
      maxAttempts: 3
    },
    {
      id: "job-2",
      agentId: "agent-2",
      taskType: "content_writing",
      scheduledAt: "2026-05-20T14:30:00Z",
      status: "completed",
      attempts: 1,
      maxAttempts: 3,
      completedAt: "2026-05-19T14:30:00Z"
    }
  ],
  generatedImages: [
    {
      id: "img-1",
      blogId: "post-1",
      prompt: "Isometric enterprise software dashboard showing growing green search analytics trends 3D render",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      status: "created",
      createdAt: "2026-05-19T14:30:00Z"
    }
  ],
  publishingLogs: [
    {
      id: "publog-1",
      blogId: "post-1",
      title: "The Ultimate Guide to Semantic SEO",
      slug: "ultimate-guide-semantic-seo",
      status: "success",
      attempts: 1,
      timestamp: "2026-05-19T14:32:00Z",
      platform: "web_cms",
      details: "Successfully pushed indexable HTML schema elements to robots.xml endpoint."
    }
  ],
  automationLogs: [
    {
      id: "autolog-1",
      timestamp: "2026-05-20T04:30:00Z",
      agentName: "Keyword Discovery Bot",
      actionType: "keyword_research",
      message: "Scraped trending competitor keywords. Discovered 5 gaps focusing on programmatic content tools.",
      level: "info"
    },
    {
      id: "autolog-2",
      timestamp: "2026-05-20T04:45:00Z",
      agentName: "Copywriter Pro Agent",
      actionType: "content_writing",
      message: "Drafted long-form SEO outline for 'SaaS Automated Backlinking Dashboards' ready for SEO review.",
      level: "info"
    }
  ]
};

export const analyticsMock: AnalyticsData = {
  impressions: 142800,
  clicks: 9840,
  avgPosition: 12.4,
  avgCTR: 6.89,
  dates: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18", "May 19"],
  impressionsTrend: [131000, 133500, 135100, 138000, 137400, 140100, 141200, 142800],
  clicksTrend: [8900, 9120, 9250, 9400, 9380, 9600, 9720, 9840]
};
