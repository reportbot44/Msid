export interface UserSession {
  isLoggedIn: boolean;
  email: string | null;
  tier: 'Free' | 'Pro' | 'Enterprise';
  domain?: string;
}

export type KeywordIntent = 'informational' | 'transactional' | 'commercial' | 'navigational';

export interface KeywordItem {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number; // 0 to 100
  intent: KeywordIntent;
  cpc: number; // USD
  competition: 'high' | 'medium' | 'low';
  trend: number[]; // 12 months trend multiplier
  cluster: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywordsUsed: string[];
  status: 'draft' | 'published' | 'scheduled';
  scheduledFor?: string;
  wordCount: number;
  readTime: number;
  seoScore: number;
  authorType: 'AI Agent' | 'Manual';
  agentId?: string;
  createdAt: string;
}

export interface SEOAgent {
  id: string;
  name: string;
  purpose: string;
  targetKeywords: string[];
  voiceTone: 'professional' | 'casual' | 'geeky' | 'creative' | 'persuasive';
  frequency: 'daily' | 'weekly' | 'hourly_demo';
  status: 'active' | 'paused';
  lastRun?: string;
  nextRun: string;
  topicHub: string;
  generatedCount: number;
}

export interface TopicCluster {
  id: string;
  name: string;
  volume: number;
  mainIntent: KeywordIntent;
  keywordsCount: number;
  keywords: string[];
  pillarTopic: string;
  description: string;
}

export interface ContentGapItem {
  id: string;
  competitorUrl: string;
  targetUrl: string;
  keyword: string;
  competitorRank: number;
  yourRank: number | 'unindexed';
  gapVolume: number;
  difficulty: number;
  recommendation: string;
}

export interface SEOAuditIssue {
  id: string;
  title: string;
  category: 'critical' | 'warning' | 'info';
  description: string;
  status: 'fixed' | 'pending';
}

export interface AnalyticsData {
  impressions: number;
  clicks: number;
  avgPosition: number;
  avgCTR: number;
  impressionsTrend: number[];
  clicksTrend: number[];
  dates: string[];
}

export interface NotificationItem {
  id: string;
  type: 'content_generation' | 'ranking_change' | 'opportunity' | 'system_alert';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface KeywordRankingHistory {
  id: string;
  keyword: string;
  history: { date: string; rank: number }[];
  searchVolume: number;
  currentRank: number;
  prevRank: number;
  difficulty: number;
}

export interface CompetitorStrategy {
  id: string;
  domain: string;
  sharedKeywords: number;
  authorityScore: number;
  topKeywords: { keyword: string; trafficShare: number; rank: number }[];
  strategyType: 'Content-Focused' | 'Technical' | 'Backlink Heavy' | 'Balanced';
  backlinksCount: number;
}

export interface TrafficSourceData {
  source: string;
  visitors: number;
  percentage: number;
  trend: number[];
  bounceRate: number;
}

export interface SEOPerformanceReport {
  id: string;
  title: string;
  domain: string;
  createdAt: string;
  summary: string;
  seoScore: number;
  organicTraffic: number;
  topInsights: string[];
}

export interface DatabaseSchema {
  keywords: KeywordItem[];
  posts: BlogPost[];
  agents: SEOAgent[];
  clusters: TopicCluster[];
  gaps: ContentGapItem[];
  issues: SEOAuditIssue[];
  domain: string;
  openaiKey: string;
  geminiModel: string;
  notifications: NotificationItem[];
  rankings: KeywordRankingHistory[];
  competitorStrategies: CompetitorStrategy[];
  trafficSources: TrafficSourceData[];
  seoReports: SEOPerformanceReport[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  tier: 'Free' | 'Pro' | 'Enterprise';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface ScheduledJob {
  id: string;
  agentId: string;
  taskType: 'keyword_research' | 'content_writing' | 'seo_optimization' | 'internal_linking' | 'image_generation' | 'publishing' | 'analytics_tracking';
  scheduledAt: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  completedAt?: string;
}

export interface GeneratedImage {
  id: string;
  blogId: string;
  prompt: string;
  imageUrl: string;
  status: 'created' | 'failed';
  createdAt: string;
}

export interface PublishingLog {
  id: string;
  blogId: string;
  title: string;
  slug: string;
  status: 'success' | 'attempt_failed' | 'permanently_failed';
  attempts: number;
  timestamp: string;
  platform: 'web_cms' | 'wordpress' | 'shopify';
  details?: string;
}

export interface AgentAutomationLog {
  id: string;
  timestamp: string;
  agentName: string;
  actionType: string;
  message: string;
  level: 'info' | 'warning' | 'error';
}

export interface ScrapeResult {
  url: string;
  title: string;
  metaTags: { name: string; content: string }[];
  headings: { type: 'h1' | 'h2' | 'h3'; text: string }[];
  keywords: string[];
  contentExcerpt: string;
  imageUrls: string[];
  internalLinks: string[];
  schemaMarkup: any[];
  faqs: { question: string; answer: string }[];
  status: 'success' | 'failed';
  errorMessage?: string;
  scrapedAt: string;
}

export interface CrawlJob {
  id: string;
  targetUrl: string;
  maxPages: number;
  pagesCrawled: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: ScrapeResult[];
  createdAt: string;
}

export interface CompetitorSEOReport {
  id: string;
  competitorDomain: string;
  pageCountSeeded: number;
  overallScore: number;
  scrapedKeywordsCount: number;
  topCompetitorKeywords: { keyword: string; density: number; frequency: number }[];
  strategyAssessment: string;
  backlinkSignalsScore: number;
  createdAt: string;
}

export interface SEOAuditReport {
  id: string;
  targetUrl: string;
  seoScore: number;
  totalIssuesCount: number;
  issues: {
    title: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
    recommendation: string;
    detectedValue?: string;
  }[];
  loadTimeMs: number;
  pageSizeKb: number;
  mobileFriendly: boolean;
  sslEnabled: boolean;
  metaVerified: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  keywords: KeywordItem[];
  posts: BlogPost[];
  agents: SEOAgent[];
  clusters: TopicCluster[];
  gaps: ContentGapItem[];
  issues: SEOAuditIssue[];
  domain: string;
  openaiKey: string;
  geminiModel: string;
  notifications: NotificationItem[];
  rankings: KeywordRankingHistory[];
  competitorStrategies: CompetitorStrategy[];
  trafficSources: TrafficSourceData[];
  seoReports: SEOPerformanceReport[];
  users: User[];
  projects: Project[];
  scheduledJobs: ScheduledJob[];
  generatedImages: GeneratedImage[];
  publishingLogs: PublishingLog[];
  automationLogs: AgentAutomationLog[];
  crawls?: CrawlJob[];
  competitorReports?: CompetitorSEOReport[];
  siteAudits?: SEOAuditReport[];
}
