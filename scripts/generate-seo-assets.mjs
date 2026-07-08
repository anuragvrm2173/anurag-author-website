import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

const siteUrl = (process.env.VITE_SITE_URL || "https://anuragverma-author.vercel.app/").trim().replace(/\/+$/, "");

async function extractMatches(filePath, regex) {
  const source = await readFile(filePath, "utf8");
  return [...source.matchAll(regex)].map((match) => match[1]);
}

const bookSlugs = await extractMatches(path.join(rootDir, "src/data/books.js"), /slug:\s*"([^"]+)"/g);
const blogIds = await extractMatches(path.join(rootDir, "src/data/blog.js"), /id:\s*"([^"]+)"/g);

const staticPaths = [
  "/",
  "/about",
  "/library",
  "/reviews",
  "/blog",
  "/contact",
  "/search",
  "/privacy",
  "/terms",
];

const bookPaths = bookSlugs.map((slug) => `/library/${slug}`);
const blogPaths = blogIds.map((id) => `/blog/${id}`);
const allPaths = [...staticPaths, ...bookPaths, ...blogPaths];

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPaths
  .map((pagePath) => `  <url>\n    <loc>${siteUrl}${pagePath}</loc>\n  </url>`)
  .join("\n")}\n</urlset>\n`;

await writeFile(path.join(publicDir, "robots.txt"), robots, "utf8");
await writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");

console.log(`Generated robots.txt and sitemap.xml for ${siteUrl}`);