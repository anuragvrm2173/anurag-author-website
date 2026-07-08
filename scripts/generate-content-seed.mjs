import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlValue(value) {
  if (value === null || value === undefined || value === "") {
    return "null";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "null";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (Array.isArray(value) || typeof value === "object") {
    return `${sqlString(JSON.stringify(value))}::jsonb`;
  }

  return sqlString(value);
}

function normalizeStatus(value) {
  return String(value || "draft").trim().toLowerCase().replace(/\s+/g, "_");
}

function extractExpression(source, marker) {
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }

  const openingCharMatch = source.slice(start).match(/[\[{]/);
  const openingChar = openingCharMatch?.[0];
  if (!openingChar) {
    throw new Error(`Expression start not found for marker: ${marker}`);
  }

  const expressionStart = source.indexOf(openingChar, start);
  const closingChar = openingChar === "[" ? "]" : "}";

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = expressionStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === openingChar) {
      depth += 1;
      continue;
    }

    if (char === closingChar) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(expressionStart, index + 1);
      }
    }
  }

  throw new Error(`Unable to extract expression for marker: ${marker}`);
}

function evaluateArrayExpression(expression, context = {}) {
  return vm.runInNewContext(`(${expression})`, context);
}

async function readBooks() {
  const source = await fs.readFile(path.join(rootDir, "src/data/books.js"), "utf8");
  const importNames = [...source.matchAll(/^import\s+(\w+)\s+from\s+["'][^"']+["'];$/gm)].map((match) => match[1]);
  const context = Object.fromEntries(importNames.map((name) => [name, null]));
  const expression = extractExpression(source, "const books = ");
  return evaluateArrayExpression(expression, context);
}

async function readBlogPosts() {
  const source = await fs.readFile(path.join(rootDir, "src/data/blog.js"), "utf8");
  const expression = extractExpression(source, "export const blogPosts = ");
  return evaluateArrayExpression(expression, {});
}

async function readSiteConfig() {
  const source = await fs.readFile(path.join(rootDir, "src/data/siteConfig.js"), "utf8");
  const expression = extractExpression(source, "const siteConfig = ");
  return evaluateArrayExpression(expression, {
    configuredSiteUrl: "https://anuragverma-author.vercel.app",
  });
}

async function readSocialLinks() {
  const source = await fs.readFile(path.join(rootDir, "src/data/socialLinks.js"), "utf8");
  const expression = extractExpression(source, "const socialLinks = ");
  return evaluateArrayExpression(expression, {
    envOrFallback: (_key, fallback) => fallback,
  });
}

function mapBook(book) {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle || null,
    short_description: book.shortDescription || null,
    long_description: book.longDescription || null,
    description: book.description || null,
    genres: book.genres || [],
    themes: book.themes || [],
    status: normalizeStatus(book.status),
    publication_date: book.publicationDate || null,
    pages: book.pages || null,
    language: book.language || null,
    isbn: book.isbn || null,
    publisher: book.publisher || null,
    formats: book.formats || {},
    purchase_links: book.purchaseLinks || {},
    sample_id: book.sampleId || null,
    related_books: book.relatedBooks || [],
    related_blog_ids: book.relatedBlogIds || [],
    seo: book.seo || {},
    synopsis: book.synopsis || [],
    discoveries: book.discoveries || [],
    who_this_book_is_for: book.whoThisBookIsFor || [],
    reading_time: book.readingTime || null,
    favorite_quotes: book.favoriteQuotes || [],
    editions: book.editions || {},
    updated_at: new Date().toISOString(),
  };
}

function mapBlogPost(post) {
  return {
    id: post.id,
    slug: post.slug || post.id,
    title: post.title,
    excerpt: post.excerpt || null,
    reading_time: post.readingTime || null,
    published_at: post.publishedAt || null,
    category: post.category || null,
    featured: Boolean(post.featured),
    related_book_ids: post.relatedBookIds || [],
    visual: post.visual || {},
    content: post.content || [],
    content_sections: post.contentSections || [],
    seo_title: post.seoTitle || null,
    seo_description: post.seoDescription || null,
    updated_at: new Date().toISOString(),
  };
}

function buildUpsertStatements(table, rows, columns) {
  return rows.map((row) => {
    const updateColumns = columns.filter((column) => column !== "id");
    return `insert into public.${table} (${columns.join(", ")})\nvalues (${columns.map((column) => sqlValue(row[column])).join(", ")})\non conflict (id) do update set\n  ${updateColumns.map((column) => `${column} = excluded.${column}`).join(",\n  ")};`;
  }).join("\n\n");
}

function buildSiteSettingsStatements(siteConfig, socialLinks) {
  const rows = [
    {
      id: "site",
      value: siteConfig,
      updated_at: new Date().toISOString(),
    },
    {
      id: "socialLinks",
      value: socialLinks,
      updated_at: new Date().toISOString(),
    },
  ];

  return buildUpsertStatements("site_settings", rows, ["id", "value", "updated_at"]);
}

async function main() {
  const books = (await readBooks()).map(mapBook);
  const blogPosts = (await readBlogPosts()).map(mapBlogPost);
  const siteConfig = await readSiteConfig();
  const socialLinks = await readSocialLinks();

  const bookColumns = [
    "id", "slug", "title", "subtitle", "short_description", "long_description", "description", "genres", "themes", "status",
    "publication_date", "pages", "language", "isbn", "publisher", "formats", "purchase_links", "sample_id", "related_books",
    "related_blog_ids", "seo", "synopsis", "discoveries", "who_this_book_is_for", "reading_time", "favorite_quotes", "editions", "updated_at",
  ];
  const blogColumns = [
    "id", "slug", "title", "excerpt", "reading_time", "published_at", "category", "featured", "related_book_ids", "visual",
    "content", "content_sections", "seo_title", "seo_description", "updated_at",
  ];

  const sql = `-- Generated by scripts/generate-content-seed.mjs\n-- Run this after supabase/schema.sql\n\nbegin;\n\n${buildUpsertStatements("books", books, bookColumns)}\n\n${buildUpsertStatements("blog_posts", blogPosts, blogColumns)}\n\n${buildSiteSettingsStatements(siteConfig, socialLinks)}\n\ncommit;\n`;

  const outputPath = path.join(rootDir, "supabase/seed-content.sql");
  await fs.writeFile(outputPath, sql, "utf8");
  console.log(`Generated ${path.relative(rootDir, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});