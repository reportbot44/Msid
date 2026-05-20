import { DatabaseSchema, AnalyticsData } from './types';

export const initialDatabase: DatabaseSchema = {
  domain: "msinteriordecorator.in",
  openaiKey: "",
  geminiModel: "gemini-3.5-flash",
  keywords: [
    {
      id: "kw-1",
      keyword: "modular kitchen design ideas",
      volume: 18500,
      difficulty: 48,
      intent: "informational",
      cpc: 2.10,
      competition: "high",
      trend: [75, 80, 85, 90, 95, 100, 110, 120, 125, 130, 135, 140],
      cluster: "Modular Kitchens"
    },
    {
      id: "kw-2",
      keyword: "best home interior decorators in Bangalore",
      volume: 8200,
      difficulty: 35,
      intent: "transactional",
      cpc: 4.50,
      competition: "medium",
      trend: [80, 85, 90, 88, 92, 95, 100, 105, 110, 115, 120, 122],
      cluster: "Local Agency Services"
    },
    {
      id: "kw-3",
      keyword: "modern small living room decor",
      volume: 14200,
      difficulty: 26,
      intent: "informational",
      cpc: 1.15,
      competition: "low",
      trend: [90, 92, 95, 100, 102, 108, 112, 115, 118, 120, 124, 130],
      cluster: "Living Room Styling"
    },
    {
      id: "kw-4",
      keyword: "bedroom wardrobe design photo",
      volume: 11000,
      difficulty: 31,
      intent: "commercial",
      cpc: 1.80,
      competition: "medium",
      trend: [70, 72, 75, 78, 80, 85, 90, 95, 98, 100, 105, 110],
      cluster: "Bedroom Furniture"
    },
    {
      id: "kw-5",
      keyword: "modern false ceiling designs",
      volume: 9500,
      difficulty: 22,
      intent: "informational",
      cpc: 0.90,
      competition: "low",
      trend: [50, 55, 58, 62, 70, 75, 78, 82, 85, 90, 95, 100],
      cluster: "Ceiling Layouts"
    },
    {
      id: "kw-6",
      keyword: "u-shaped modular kitchen layout trends",
      volume: 4200,
      difficulty: 29,
      intent: "informational",
      cpc: 1.60,
      competition: "low",
      trend: [30, 35, 38, 42, 45, 50, 55, 60, 65, 70, 75, 80],
      cluster: "Modular Kitchens"
    },
    {
      id: "kw-7",
      keyword: "affordable living room decorators near me",
      volume: 3800,
      difficulty: 32,
      intent: "transactional",
      cpc: 3.80,
      competition: "medium",
      trend: [40, 42, 45, 48, 50, 55, 60, 65, 70, 75, 82, 90],
      cluster: "Local Agency Services"
    }
  ],
  posts: [
    {
      id: "post-1",
      title: "10 Elegant Modern Living Room Design Ideas for Indian Homes",
      slug: "modern-living-room-ideas-indian-homes",
      excerpt: "Explore space-saving, aesthetically stunning layouts, warm wooden materials, and contemporary lighting plans that transform small and large Indian living spaces.",
      content: `# 10 Elegant Modern Living Room Design Ideas for Indian Homes

Planning the layout, color palette, and decorative items of a living room is central to establishing the overall mood. Modern Indian homes frequently combine functional minimalist elements with rich cultural touchpoints.

## 1. Minimalist Jute & Wood Combinations
Utilizing natural, eco-friendly materials such as biophilic jute rugs, linen couches, and premium solid teak wood furniture. This helps make the space feel light and airy.

## 2. Low-Profile Seating Layouts
To make compact apartments feel larger, opt for sleek, low-profile sofas or modern diwan setups. Raising furniture off the floor with exposed slim legs allow natural light to travel across the floor, maximizing the illusion of space.

## 3. Play with Texture and Accent Walls
Add visual rhythm using wooden rafters, subtle textured wallpapers, or warm neutral brick finishes rather than overwhelming colors.

To optimize your search engine positions, ensure to integrate **modern small living room decor** elements perfectly into your headings.

### Core Selection Tips:
1. Prefer multi-functional storage tables.
2. Maximize natural daylight placement.
3. Incorporate warm, comforting LED spotlight structures.`,
      metaTitle: "10 Elegant Indian Living Room Designs | MS Interior Decorator",
      metaDescription: "Transform your home with elegant living room layouts. Discover smart storage, high contrast themes, and modern small living room decor tips.",
      keywordsUsed: ["modern small living room decor"],
      status: "published",
      wordCount: 1220,
      readTime: 5,
      seoScore: 96,
      authorType: "AI Agent",
      createdAt: "2026-05-18T14:32:00Z"
    },
    {
      id: "post-2",
      title: "How to Choose the Perfect Modular Kitchen Design for Small Spaces",
      slug: "small-modular-kitchen-spaces-guide",
      excerpt: "The ultimate spatial architectural playbook for optimizing narrow kitchen units with multi-tiered drawers, sleek tall pantries, and U-shaped configurations.",
      content: `# How to Choose the Perfect Modular Kitchen Design for Small Spaces

A modular kitchen isn't just a style statement—it’s a masterclass in spatial efficiency. For compact apartments, choosing the right material, cabinetry sizes, and workflow layout is critical to prevent cooking clutter.

## The Gold Standard Kitchen Work Triangle
Ensure seamless accessibility between your sink, cooking stove, and refrigeration unit. Minimizing steps here leads to ergonomic kitchen routines.

- **U-Shaped Layouts:** Excellent for continuous slab designs and corner cabinet optimization.
- **Straight Single-Wall Layouts:** Ideal for narrow studio workflows.
- **L-Shaped Configurations:** The absolute favorites for open-concept dining combos.

Optimize cabinet utility using hydraulic lift-up shutters, multi-tier carousel trays for hard-to-reach corner spaces, and soft-closing drawer channels. Including **modular kitchen design ideas** guides will establish high-intent customer queries easily.`,
      metaTitle: "Modular Kitchen Guide for Small Indian Homes | Interior Planning",
      metaDescription: "Struggling with cooking spaces? Discover expert tips on modular kitchen design ideas, ergonomic layouts, and smart modern storage pantries.",
      keywordsUsed: ["modular kitchen design ideas"],
      status: "scheduled",
      scheduledFor: "2026-05-22T09:00:00Z",
      wordCount: 1350,
      readTime: 6,
      seoScore: 92,
      authorType: "AI Agent",
      createdAt: "2026-05-19T08:15:00Z"
    }
  ],
  agents: [
    {
      id: "agent-1",
      name: "Residential Trends Auto-Writer",
      purpose: "Generates high-intent localized blog layouts targeting Indian residential interior design, bedroom storage, and living room keywords.",
      targetKeywords: ["modern small living room decor", "bedroom wardrobe design photo"],
      voiceTone: "creative",
      frequency: "daily",
      status: "active",
      lastRun: "2026-05-19T14:30:00Z",
      nextRun: "2026-05-20T14:30:00Z",
      topicHub: "Home Decors & Styling",
      generatedCount: 18
    },
    {
      id: "agent-2",
      name: "Modular Layout Trend Monitor",
      purpose: "Analyzes competitor kitchen catalogs and drafts technical SEO resources targeting modern kitchen finishes and fittings.",
      targetKeywords: ["modular kitchen design ideas", "u-shaped modular kitchen layout trends"],
      voiceTone: "professional",
      frequency: "weekly",
      status: "paused",
      lastRun: "2026-05-15T09:00:00Z",
      nextRun: "2026-05-22T09:00:00Z",
      topicHub: "Modular Kitchen Mastery",
      generatedCount: 9
    }
  ],
  clusters: [
    {
      id: "clus-1",
      name: "Modular Kitchen Engineering",
      volume: 22700,
      mainIntent: "commercial",
      keywordsCount: 2,
      keywords: ["modular kitchen design ideas", "u-shaped modular kitchen layout trends"],
      pillarTopic: "Ergonomic & Space-Saving Modern Cooking Layouts",
      description: "Covering structural kitchen materials, acrylic vs laminate finishes, chimney heights, and multi-tier wire basket organization ideas for high-end homes."
    },
    {
      id: "clus-2",
      name: "Residential Interior Aesthetics",
      volume: 37000,
      mainIntent: "informational",
      keywordsCount: 3,
      keywords: ["modern small living room decor", "bedroom wardrobe design photo", "modern false ceiling designs"],
      pillarTopic: "Contemporary Indian Apartment Makeover Guides",
      description: "Focusing on low-budget modifications, false ceiling styling, bedroom woodwork, wardrobe storage layout photos, and cozy space styling tips."
    }
  ],
  gaps: [
    {
      id: "gap-1",
      competitorUrl: "livspace.com",
      targetUrl: "msinteriordecorator.in",
      keyword: "u-shaped modular kitchen layout trends",
      competitorRank: 3,
      yourRank: "unindexed",
      gapVolume: 4200,
      difficulty: 29,
      recommendation: "Write an exhaustive structural index page covering U-shaped layouts, dynamic tall-unit pantry systems, and premium profile handles."
    },
    {
      id: "gap-2",
      competitorUrl: "homelane.com",
      targetUrl: "msinteriordecorator.in",
      keyword: "affordable living room decorators near me",
      competitorRank: 5,
      yourRank: 42,
      gapVolume: 3800,
      difficulty: 32,
      recommendation: "Develop a city-specific Local Landings program. Build neighborhood interior decoration galleries with clear transparent Indian pricing structures."
    }
  ],
  issues: [
    {
      id: "issue-1",
      title: "Missing LocalBusiness & Service Schema structured markup on Homepage",
      category: "critical",
      description: "Google crawlers cannot correlate target local services. Missing LocalBusiness schema, office address location, and phone tags.",
      status: "pending"
    },
    {
      id: "issue-2",
      title: "Missing ALT tags on 42 Living Room Portfolio images",
      category: "warning",
      description: "Important image showcases (living room, high quality kitchens) have default or empty alt attributes. Missing image SEO relevance weights.",
      status: "pending"
    },
    {
      id: "issue-3",
      title: "Optimized XML sitemap including indexable kitchen designs tags",
      category: "info",
      description: "Added dedicated modular and wardrobe catalog pages to the sitemap file manually. Google indexed all 5 new categories.",
      status: "fixed"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      type: "content_generation",
      title: "Residential Trends Auto-Writer Success",
      message: "Agent 'Residential Trends Auto-Writer' generated and published '10 Elegant Modern Living Room Design Ideas' targeting Indian homes, scoring 96/100.",
      isRead: false,
      createdAt: "2026-05-19T14:32:00Z"
    },
    {
      id: "notif-2",
      type: "ranking_change",
      title: "Google Ranking High-Jump!",
      message: "Your primary keyword 'modern false ceiling designs' leaped from position #31 to #4 (+27 positions) thanks to semantic schema inclusions.",
      isRead: false,
      createdAt: "2026-05-18T10:15:00Z"
    },
    {
      id: "notif-3",
      type: "opportunity",
      title: "High Value Kitchen Keyword Gap Scoped",
      message: "Competitor 'livspace.com' ranks #3 for 'u-shaped modular kitchen layout trends' (Volume: 4,200). We are currently unindexed on this key query.",
      isRead: true,
      createdAt: "2026-05-17T08:00:00Z"
    },
    {
      id: "notif-4",
      type: "system_alert",
      title: "Technical Site Audit Completed",
      message: "Deep crawl on msinteriordecorator.in detected 1 critical issue (Missing LocalBusiness & Service schemas) and 42 portfolio image schema warnings.",
      isRead: true,
      createdAt: "2026-05-16T11:45:00Z"
    }
  ],
  rankings: [
    {
      id: "rank-1",
      keyword: "modern false ceiling designs",
      searchVolume: 9500,
      currentRank: 4,
      prevRank: 31,
      difficulty: 22,
      history: [
        { date: "May 13", rank: 31 },
        { date: "May 14", rank: 31 },
        { date: "May 15", rank: 28 },
        { date: "May 16", rank: 18 },
        { date: "May 17", rank: 12 },
        { date: "May 18", rank: 8 },
        { date: "May 19", rank: 4 },
        { date: "May 20", rank: 4 }
      ]
    },
    {
      id: "rank-2",
      keyword: "bedroom wardrobe design photo",
      searchVolume: 11000,
      currentRank: 6,
      prevRank: 10,
      difficulty: 31,
      history: [
        { date: "May 13", rank: 10 },
        { date: "May 14", rank: 10 },
        { date: "May 15", rank: 9 },
        { date: "May 16", rank: 8 },
        { date: "May 17", rank: 8 },
        { date: "May 18", rank: 7 },
        { date: "May 19", rank: 6 },
        { date: "May 20", rank: 6 }
      ]
    },
    {
      id: "rank-3",
      keyword: "modular kitchen design ideas",
      searchVolume: 18500,
      currentRank: 14,
      prevRank: 28,
      difficulty: 48,
      history: [
        { date: "May 13", rank: 28 },
        { date: "May 14", rank: 26 },
        { date: "May 15", rank: 24 },
        { date: "May 16", rank: 24 },
        { date: "May 17", rank: 19 },
        { date: "May 18", rank: 17 },
        { date: "May 19", rank: 15 },
        { date: "May 20", rank: 14 }
      ]
    },
    {
      id: "rank-4",
      keyword: "best home interior decorators in Bangalore",
      searchVolume: 8200,
      currentRank: 9,
      prevRank: 15,
      difficulty: 35,
      history: [
        { date: "May 13", rank: 15 },
        { date: "May 14", rank: 14 },
        { date: "May 15", rank: 14 },
        { date: "May 16", rank: 12 },
        { date: "May 17", rank: 11 },
        { date: "May 18", rank: 10 },
        { date: "May 19", rank: 9 },
        { date: "May 20", rank: 9 }
      ]
    }
  ],
  competitorStrategies: [
    {
      id: "comp-1",
      domain: "livspace.com",
      sharedKeywords: 245,
      authorityScore: 84,
      strategyType: "Aggressive",
      backlinksCount: 165000,
      topKeywords: [
        { keyword: "modular kitchen kitchen cost pricing India", trafficShare: 0.22, rank: 1 },
        { keyword: "wardrobe modular catalogue book PDF", trafficShare: 0.15, rank: 2 },
        { keyword: "modern home decors with designs plans", trafficShare: 0.10, rank: 3 }
      ]
    },
    {
      id: "comp-2",
      domain: "homelane.com",
      sharedKeywords: 198,
      authorityScore: 78,
      strategyType: "Balanced",
      backlinksCount: 124000,
      topKeywords: [
        { keyword: "45 days interior delivery guarantee scheme", trafficShare: 0.28, rank: 1 },
        { keyword: "best low budget modular drawer fittings", trafficShare: 0.14, rank: 3 },
        { keyword: "l-shaped kitchen catalog layout images", trafficShare: 0.11, rank: 2 }
      ]
    },
    {
      id: "comp-3",
      domain: "woodenstreet.com",
      sharedKeywords: 82,
      authorityScore: 76,
      strategyType: "Commerce-Focused",
      backlinksCount: 92000,
      topKeywords: [
        { keyword: "solid sheesham wood double beds online", trafficShare: 0.35, rank: 1 },
        { keyword: "buy space saving dining tables stools", trafficShare: 0.18, rank: 2 }
      ]
    }
  ],
  trafficSources: [
    { source: "Google Organic (Kitchen/Decor Search)", visitors: 38400, percentage: 52, trend: [2900, 2950, 3100, 3150, 3280, 3350, 3500], bounceRate: 38.5 },
    { source: "Direct Visits (Portfolio / Catalog Views)", visitors: 20720, percentage: 28, trend: [1400, 1420, 1450, 1480, 1490, 1510, 1550], bounceRate: 29.4 },
    { source: "Social Channels (Pinterest / Instagram / YouTube)", visitors: 11100, percentage: 15, trend: [600, 680, 720, 780, 850, 920, 1050], bounceRate: 46.2 },
    { source: "Referrals (Decor Forum Blogs / Local Directories)", visitors: 3680, percentage: 5, trend: [180, 190, 210, 220, 240, 260, 280], bounceRate: 41.8 }
  ],
  seoReports: [
    {
      id: "rep-1",
      title: "Quarterly Organic Growth & Competitor Audit",
      domain: "msinteriordecorator.in",
      createdAt: "2026-05-19T10:00:00Z",
      seoScore: 92,
      organicTraffic: 73900,
      summary: "This report reviews the performance optimization sprint from May 2026. Local search footprint in Bangalore/Mumbai regions is up content clusters generated excellent rank leaps (+14.2% organic visitors), and modular kitchens pages became primary index drivers.",
      topInsights: [
        "Inclusion of Local SEO geographical keywords ('affordable decorator Bangalore') drove a 48% boost in relevant local inquiries.",
        "Livspace continues to lead in long-tail wardrobe catalogues; we should match them by generating 5 high-resolution bedroom wardrobe layout articles.",
        "Fixed critical local business schema codes which increased search engine correlation scores by 34%."
      ]
    },
    {
      id: "rep-2",
      title: "On-Page Semantic Strategy Review",
      domain: "msinteriordecorator.in",
      createdAt: "2026-04-15T09:30:00Z",
      seoScore: 84,
      organicTraffic: 62400,
      summary: "A technical crawl of the primary domain evaluated header structures, image compression payloads, and catalog index files.",
      topInsights: [
        "Empty descriptions/alt values found on interior design showcase graphics, hiding excellent visual assets from Google Image Search.",
        "U-shaped layout articles are scoring high on readability and entity match indexes, indicating clear contextual authority on modular designs."
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
      name: "MS Interior Decor Engine",
      domain: "msinteriordecorator.in",
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
      prompt: "Scandinavian style modern living room with cozy wooden fittings plant decorations photography raw natural warm light",
      imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      status: "created",
      createdAt: "2026-05-19T14:30:00Z"
    }
  ],
  publishingLogs: [
    {
      id: "publog-1",
      blogId: "post-1",
      title: "10 Elegant Modern Living Room Design Ideas for Indian Homes",
      slug: "modern-living-room-ideas-indian-homes",
      status: "success",
      attempts: 1,
      timestamp: "2026-05-19T14:32:00Z",
      platform: "web_cms",
      details: "Successfully updated and generated static article page with perfect LocalBusiness microdata payload."
    }
  ],
  automationLogs: [
    {
      id: "autolog-1",
      timestamp: "2026-05-20T04:30:00Z",
      agentName: "Residential Trends Auto-Writer",
      actionType: "keyword_research",
      message: "Scraped competitor catalogs. Found high-value content gaps in modern false ceiling configurations and bedroom wardrobe schemas.",
      level: "info"
    },
    {
      id: "autolog-2",
      timestamp: "2026-05-20T04:45:00Z",
      agentName: "Modular Layout Trend Monitor",
      actionType: "content_writing",
      message: "Drafted long-form SEO outline for 'Acrylic vs Laminate modular kitchen setups' ready for agency review.",
      level: "info"
    }
  ]
};

export const analyticsMock: AnalyticsData = {
  impressions: 242500,
  clicks: 18940,
  avgPosition: 8.6,
  avgCTR: 7.81,
  dates: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18", "May 19"],
  impressionsTrend: [221000, 224000, 228000, 230000, 235000, 238000, 240000, 242500],
  clicksTrend: [16200, 16800, 17100, 17500, 17800, 18100, 18500, 18940]
};
