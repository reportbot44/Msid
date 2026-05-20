import { DatabaseSchema, BlogPost, PublishingLog } from "../src/types";

// Dynamic blog routes CMS and RSS/Sitemap file generators.
// This implements a full virtual auto-website publisher.

export interface StaticCMSPayload {
  sitemapXml: string;
  robotsTxt: string;
  rssFeedXml: string;
  dynamicRoutes: string[];
}

export function generateStaticCMSFiles(db: DatabaseSchema): StaticCMSPayload {
  const publishedBlogs = db.posts.filter(p => p.status === "published");
  const hostname = `https://${db.domain || "my-saas-platform.com"}`;

  // Sitemap generator
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemap += `  <url>\n    <loc>${hostname}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  sitemap += `  <url>\n    <loc>${hostname}/analytics</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  sitemap += `  <url>\n    <loc>${hostname}/keywords</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  
  publishedBlogs.forEach(blog => {
    sitemap += `  <url>\n    <loc>${hostname}/blog/${blog.slug}</loc>\n    <lastmod>${blog.createdAt.split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  });
  sitemap += `</urlset>`;

  // Robots.txt generator
  let robots = `# Robots.txt for self-operating Autonomous AI SEO Platform\nUser-agent: *\nAllow: /\nSitemap: ${hostname}/sitemap.xml\nDisallow: /api/\nDisallow: /admin/`;

  // RSS Feed XML generator
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
  rss += `  <title>Autonomous AI SEO SaaS Portal</title>\n`;
  rss += `  <link>${hostname}</link>\n`;
  rss += `  <description>Self-operating AI-driven search ranking optimization engine.</description>\n`;
  rss += `  <language>en-us</language>\n`;
  rss += `  <atom:link href="${hostname}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  publishedBlogs.forEach(blog => {
    rss += `  <item>\n`;
    rss += `    <title><![CDATA[${blog.title}]]></title>\n`;
    rss += `    <link>${hostname}/blog/${blog.slug}</link>\n`;
    rss += `    <guid>${hostname}/blog/${blog.slug}</guid>\n`;
    rss += `    <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>\n`;
    rss += `    <description><![CDATA[${blog.excerpt}]]></description>\n`;
    rss += `  </item>\n`;
  });
  rss += `</channel>\n</rss>`;

  const dynamicRoutes = [
    "/",
    "/blog",
    ...publishedBlogs.map(b => `/blog/${b.slug}`)
  ];

  return {
    sitemapXml: sitemap,
    robotsTxt: robots,
    rssFeedXml: rss,
    dynamicRoutes
  };
}

// Simulated ping to Google/Bing crawlers index
export async function pingSearchEngines(domain: string, sitemapUrl: string): Promise<boolean> {
  console.log(`[PublisherWorker] Pinging Webmasters Crawler Engines. Domain: ${domain}, Sitemap: ${sitemapUrl}`);
  // In a real environment, you would call:
  // await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
  // Return mock successful ping indicators
  return true;
}

// Processes the pending / approved queue
export async function processQueueWorkers(
  db: DatabaseSchema,
  saveDb: (data: DatabaseSchema) => void
): Promise<PublishingLog[]> {
  const processedLogs: PublishingLog[] = [];
  const scheduledPosts = db.posts.filter(p => p.status === "scheduled" && p.scheduledFor && new Date(p.scheduledFor) <= new Date());
  
  if (scheduledPosts.length === 0) {
    return [];
  }

  console.log(`[PublisherWorker] Processing ${scheduledPosts.length} scheduled posts...`);

  scheduledPosts.forEach(post => {
    try {
      post.status = "published";
      post.createdAt = new Date().toISOString();

      const log: PublishingLog = {
        id: `publog-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        blogId: post.id,
        title: post.title,
        slug: post.slug,
        status: "success",
        attempts: 1,
        timestamp: new Date().toISOString(),
        platform: "web_cms",
        details: "Auto Published via Scheduler queue check."
      };

      if (!db.publishingLogs) db.publishingLogs = [];
      db.publishingLogs.unshift(log);
      processedLogs.push(log);

    } catch (err: any) {
      const errorLog: PublishingLog = {
        id: `publog-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        blogId: post.id,
        title: post.title,
        slug: post.slug,
        status: "attempt_failed",
        attempts: 1,
        timestamp: new Date().toISOString(),
        platform: "web_cms",
        details: err.message || "Execution exception error during static generation."
      };
      if (!db.publishingLogs) db.publishingLogs = [];
      db.publishingLogs.unshift(errorLog);
      processedLogs.push(errorLog);
    }
  });

  saveDb(db);
  return processedLogs;
}
