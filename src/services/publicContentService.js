import fallbackBooks from "../data/books";
import { blogPosts as fallbackBlogPosts } from "../data/blog";
import { hasSupabase, supabase } from "./supabaseClient";

function sortByFallbackOrder(items, fallbackItems) {
  const orderMap = new Map(fallbackItems.map((item, index) => [item.id, index]));

  return [...items].sort((left, right) => {
    const leftDisplayOrder = Number(left.displayOrder ?? Number.MAX_SAFE_INTEGER);
    const rightDisplayOrder = Number(right.displayOrder ?? Number.MAX_SAFE_INTEGER);

    if (leftDisplayOrder !== rightDisplayOrder) {
      return leftDisplayOrder - rightDisplayOrder;
    }

    const leftIndex = orderMap.has(left.id) ? orderMap.get(left.id) : Number.MAX_SAFE_INTEGER;
    const rightIndex = orderMap.has(right.id) ? orderMap.get(right.id) : Number.MAX_SAFE_INTEGER;

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return String(left.title || "").localeCompare(String(right.title || ""));
  });
}

function normalizeBookRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    description: row.description,
    genres: row.genres || [],
    themes: row.themes || [],
    status: String(row.status || "draft").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    displayOrder: row.display_order ?? 0,
    publicationDate: row.publication_date,
    publishedAt: row.published_at,
    pages: row.pages,
    language: row.language,
    isbn: row.isbn,
    publisher: row.publisher,
    formats: row.formats || {},
    purchaseLinks: row.purchase_links || {},
    sampleId: row.sample_id,
    relatedBooks: row.related_books || [],
    relatedBlogIds: row.related_blog_ids || [],
    seo: row.seo || {},
    synopsis: row.synopsis || [],
    discoveries: row.discoveries || [],
    whoThisBookIsFor: row.who_this_book_is_for || [],
    readingTime: row.reading_time,
    favoriteQuotes: row.favorite_quotes || [],
    editions: row.editions || {},
    deletedAt: row.deleted_at || null,
  };
}

function normalizeBlogPostRow(row) {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    excerpt: row.excerpt,
    status: row.status || "draft",
    displayOrder: row.display_order ?? 0,
    readingTime: row.reading_time,
    publishedAt: row.published_at,
    category: row.category,
    featured: Boolean(row.featured),
    relatedBookIds: row.related_book_ids || [],
    visual: row.visual || {},
    bodyHtml: row.body_html || "",
    content: row.content || [],
    contentSections: row.content_sections || [],
    seoTitle: row.seo_title || "",
    seoDescription: row.seo_description || "",
    lastEdited: row.last_edited || row.updated_at || null,
    revisionHistory: row.revision_history || [],
    deletedAt: row.deleted_at || null,
  };
}

export function getFallbackBooks() {
  return fallbackBooks;
}

export function getFallbackBlogPosts() {
  return fallbackBlogPosts;
}

export async function fetchPublicBooks() {
  if (!hasSupabase()) {
    return fallbackBooks;
  }

  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .is("deleted_at", null)
      .in("status", ["published", "coming_soon"]);

    if (error) {
      throw error;
    }

    return sortByFallbackOrder((data || []).map(normalizeBookRow), fallbackBooks);
  } catch {
    return fallbackBooks;
  }
}

export async function fetchPublicBlogPosts() {
  if (!hasSupabase()) {
    return fallbackBlogPosts;
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .is("deleted_at", null)
      .eq("status", "published");

    if (error) {
      throw error;
    }

    return sortByFallbackOrder((data || []).map(normalizeBlogPostRow), fallbackBlogPosts);
  } catch {
    return fallbackBlogPosts;
  }
}

export function getBookByIdFromList(books, bookId) {
  return books.find((book) => book.id === bookId || book.slug === bookId) || null;
}

export function getRelatedBooksFromList(books, currentBookId, limit = 2) {
  const currentBook = getBookByIdFromList(books, currentBookId);

  if (currentBook?.relatedBooks?.length) {
    const related = currentBook.relatedBooks
      .map((bookId) => getBookByIdFromList(books, bookId))
      .filter(Boolean);
    return related.slice(0, limit);
  }

  return books.filter((book) => book.id !== currentBookId).slice(0, limit);
}

export function getBlogPostByIdFromList(posts, postId) {
  return posts.find((post) => post.id === postId || post.slug === postId) || null;
}

export function getBlogPostsByBookIdFromList(posts, books, bookId) {
  const book = getBookByIdFromList(books, bookId);

  if (!book?.relatedBlogIds?.length) {
    return [];
  }

  return book.relatedBlogIds
    .map((postId) => getBlogPostByIdFromList(posts, postId))
    .filter(Boolean);
}