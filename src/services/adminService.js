import books from "../data/books";
import { blogPosts } from "../data/blog";
import { reviews as localReviews } from "../data/reviews";
import siteConfig from "../data/siteConfig";
import socialLinks from "../data/socialLinks";
import { adminAllowedEmail, hasSupabase, supabase } from "./supabaseClient";

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(values) {
  return Array.isArray(values) ? values.join("\n") : "";
}

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function createLegacyHtml(post = {}) {
  if (post.bodyHtml) {
    return post.bodyHtml;
  }

  if (post.contentSections?.length) {
    return post.contentSections
      .map((section) => `
        <section>
          <h2>${section.heading || ""}</h2>
          ${(section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </section>
      `)
      .join("");
  }

  return (post.content || []).map((paragraph) => `<p>${paragraph}</p>`).join("");
}

export function generateSlug(value) {
  return slugify(value);
}

function toBookForm(book = {}) {
  return {
    id: book.id || "",
    slug: book.slug || "",
    title: book.title || "",
    subtitle: book.subtitle || "",
    shortDescription: book.shortDescription || "",
    longDescription: book.longDescription || "",
    description: book.description || "",
    genres: joinLines(book.genres),
    themes: joinLines(book.themes),
    status: (book.status || "Draft").toLowerCase().replace(/\s+/g, "_"),
    displayOrder: book.displayOrder ?? 0,
    publicationDate: book.publicationDate || "",
    publishedAt: book.publishedAt || "",
    pages: book.pages || "",
    language: book.language || "",
    isbn: book.isbn || "",
    publisher: book.publisher || "",
    readingTime: book.readingTime || "",
    synopsis: joinLines(book.synopsis),
    discoveries: joinLines(book.discoveries),
    whoThisBookIsFor: joinLines(book.whoThisBookIsFor),
    favoriteQuotes: joinLines(book.favoriteQuotes),
    relatedBooks: joinLines(book.relatedBooks),
    relatedBlogIds: joinLines(book.relatedBlogIds),
    formatsJson: JSON.stringify(book.formats || {}, null, 2),
    purchaseLinksJson: JSON.stringify(book.purchaseLinks || {}, null, 2),
    seoJson: JSON.stringify(book.seo || {}, null, 2),
    editionsJson: JSON.stringify(book.editions || {}, null, 2),
  };
}

function fromBookForm(form) {
  const id = form.id || slugify(form.title);
  return {
    id,
    slug: form.slug || slugify(form.title),
    title: form.title,
    subtitle: form.subtitle,
    short_description: form.shortDescription,
    long_description: form.longDescription,
    description: form.description,
    genres: splitLines(form.genres),
    themes: splitLines(form.themes),
    status: form.status || "draft",
    display_order: Number(form.displayOrder || 0),
    publication_date: form.publicationDate || null,
    published_at: form.publishedAt || (form.status === "published" ? new Date().toISOString() : null),
    pages: form.pages ? Number(form.pages) : null,
    language: form.language || null,
    isbn: form.isbn || null,
    publisher: form.publisher || null,
    reading_time: form.readingTime || null,
    synopsis: splitLines(form.synopsis),
    discoveries: splitLines(form.discoveries),
    who_this_book_is_for: splitLines(form.whoThisBookIsFor),
    favorite_quotes: splitLines(form.favoriteQuotes),
    related_books: splitLines(form.relatedBooks),
    related_blog_ids: splitLines(form.relatedBlogIds),
    formats: parseJson(form.formatsJson, {}),
    purchase_links: parseJson(form.purchaseLinksJson, {}),
    seo: parseJson(form.seoJson, {}),
    editions: parseJson(form.editionsJson, {}),
    updated_at: new Date().toISOString(),
  };
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
    createdAt: row.created_at || null,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at || null,
  };
}

function normalizeBlogRow(row) {
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
    revisionHistory: row.revision_history || [],
    createdAt: row.created_at || null,
    lastEdited: row.last_edited || row.updated_at || null,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at || null,
  };
}

function normalizeReviewRow(row) {
  return {
    id: row.id,
    bookId: row.book_id,
    reviewerName: row.reviewer_name,
    reviewerEmail: row.reviewer_email,
    reviewerRole: row.reviewer_role,
    quote: row.quote,
    rating: row.rating,
    source: row.source,
    featured: Boolean(row.featured),
    status: row.status,
    createdAt: row.created_at,
    deletedAt: row.deleted_at || null,
  };
}

export function getDefaultBookForm() {
  return toBookForm();
}

export function getDefaultBlogForm() {
  return toBlogForm({ publishedAt: new Date().toISOString().slice(0, 10), status: "draft" });
}

function toBlogForm(post = {}) {
  return {
    id: post.id || "",
    slug: post.slug || post.id || "",
    title: post.title || "",
    category: post.category || "",
    excerpt: post.excerpt || "",
    status: post.status || "draft",
    displayOrder: post.displayOrder ?? 0,
    readingTime: post.readingTime || "",
    publishedAt: post.publishedAt || "",
    featured: Boolean(post.featured),
    relatedBookIds: joinLines(post.relatedBookIds),
    visualJson: JSON.stringify(post.visual || {}, null, 2),
    bodyHtml: createLegacyHtml(post),
    contentSectionsJson: JSON.stringify(post.contentSections || [], null, 2),
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
  };
}

function fromBlogForm(form, revisionHistory = []) {
  const id = form.id || slugify(form.title);
  const cleanBodyHtml = String(form.bodyHtml || "").trim();
  const plainBody = stripHtml(cleanBodyHtml);
  return {
    id,
    slug: form.slug || slugify(form.title),
    title: form.title,
    category: form.category,
    excerpt: form.excerpt,
    status: form.status || "draft",
    display_order: Number(form.displayOrder || 0),
    reading_time: form.readingTime || null,
    published_at: form.publishedAt || (form.status === "published" ? new Date().toISOString().slice(0, 10) : null),
    featured: Boolean(form.featured),
    related_book_ids: splitLines(form.relatedBookIds),
    visual: parseJson(form.visualJson, {}),
    body_html: cleanBodyHtml,
    content: plainBody ? [plainBody] : [],
    content_sections: parseJson(form.contentSectionsJson, []),
    seo_title: form.seoTitle || null,
    seo_description: form.seoDescription || null,
    revision_history: revisionHistory,
    last_edited: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function signInAdmin(email, password) {
  if (!hasSupabase()) {
    throw new Error("Supabase is not configured for admin login.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
}

export async function signOutAdmin() {
  if (!hasSupabase()) {
    return;
  }

  await supabase.auth.signOut();
}

export async function getCurrentAdminSession() {
  if (!hasSupabase()) {
    return { session: null, user: null, authorized: false, reason: "missing-supabase" };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }

  const session = data.session;
  const user = session?.user || null;
  if (!user) {
    return { session: null, user: null, authorized: false, reason: "signed-out" };
  }

  const email = String(user.email || "").toLowerCase();
  const fallbackAuthorized = email === adminAllowedEmail;
  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError && adminError.code !== "PGRST116") {
    throw adminError;
  }

  const authorized = Boolean(adminRecord || fallbackAuthorized);
  return {
    session,
    user,
    authorized,
    role: adminRecord?.role || (authorized ? "admin" : null),
    reason: authorized ? null : "unauthorized",
  };
}

export function subscribeToAdminAuth(callback) {
  if (!hasSupabase()) {
    return () => {};
  }

  const { data } = supabase.auth.onAuthStateChange(() => {
    callback();
  });

  return () => data.subscription.unsubscribe();
}

export async function fetchAdminDashboardStats() {
  if (!hasSupabase()) {
    const draftBooks = books.filter((book) => ["Coming Soon", "Draft"].includes(book.status)).length;
    const publishedBooks = books.filter((book) => book.status === "Published").length;
    const latestBlogTitle = blogPosts[0]?.title || null;
    return {
      books: books.length,
      blogPosts: blogPosts.length,
      draftBooks,
      publishedBooks,
      archivedBooks: 0,
      draftPosts: 0,
      publishedPosts: blogPosts.length,
      archivedPosts: 0,
      pendingReviews: localReviews.filter((review) => ["submitted", "pending"].includes(review.status)).length,
      publishedReviews: localReviews.filter((review) => ["approved", "published"].includes(review.status)).length,
      newsletterSubscribers: 0,
      messages: 0,
      unreadMessages: 0,
      latestBlogTitle,
      recentActivity: [
        { id: "local-books", label: `${books.length} local books available`, timestamp: new Date().toISOString() },
        { id: "local-blog", label: `${blogPosts.length} local blog posts available`, timestamp: new Date().toISOString() },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }

  const [booksResult, draftBooksResult, publishedBooksResult, archivedBooksResult, blogResult, draftPostsResult, publishedPostsResult, archivedPostsResult, latestBlogResult, reviewsResult, newsletterResult, messagesResult, unreadMessagesResult, settingsResult] = await Promise.all([
    supabase.from("books").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("books").select("id", { count: "exact", head: true }).is("deleted_at", null).in("status", ["draft", "coming_soon"]),
    supabase.from("books").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("status", "published"),
    supabase.from("books").select("id", { count: "exact", head: true }).not("deleted_at", "is", null),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("status", "draft"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("status", "published"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).not("deleted_at", "is", null),
    supabase.from("blog_posts").select("title, updated_at").is("deleted_at", null).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("reviews").select("status"),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "active").is("deleted_at", null),
    supabase.from("messages").select("id", { count: "exact", head: true }).neq("status", "archived").is("deleted_at", null),
    supabase.from("messages").select("id", { count: "exact", head: true }).is("deleted_at", null).neq("status", "read").neq("status", "archived"),
    supabase.from("site_settings").select("updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  if (booksResult.error) throw booksResult.error;
  if (draftBooksResult.error) throw draftBooksResult.error;
  if (publishedBooksResult.error) throw publishedBooksResult.error;
  if (archivedBooksResult.error) throw archivedBooksResult.error;
  if (blogResult.error) throw blogResult.error;
  if (draftPostsResult.error) throw draftPostsResult.error;
  if (publishedPostsResult.error) throw publishedPostsResult.error;
  if (archivedPostsResult.error) throw archivedPostsResult.error;
  if (reviewsResult.error) throw reviewsResult.error;
  if (newsletterResult.error) throw newsletterResult.error;
  if (messagesResult.error) throw messagesResult.error;
  if (unreadMessagesResult.error) throw unreadMessagesResult.error;

  const reviewRows = reviewsResult.data || [];

  return {
    books: booksResult.count || 0,
    draftBooks: draftBooksResult.count || 0,
    publishedBooks: publishedBooksResult.count || 0,
    archivedBooks: archivedBooksResult.count || 0,
    blogPosts: blogResult.count || 0,
    draftPosts: draftPostsResult.count || 0,
    publishedPosts: publishedPostsResult.count || 0,
    archivedPosts: archivedPostsResult.count || 0,
    pendingReviews: reviewRows.filter((review) => ["submitted", "pending"].includes(review.status)).length,
    publishedReviews: reviewRows.filter((review) => review.status === "published").length,
    newsletterSubscribers: newsletterResult.count || 0,
    messages: messagesResult.count || 0,
    unreadMessages: unreadMessagesResult.count || 0,
    latestBlogTitle: latestBlogResult.data?.title || null,
    recentActivity: [
      latestBlogResult.data?.title ? { id: "latest-blog", label: `Latest blog edited: ${latestBlogResult.data.title}`, timestamp: latestBlogResult.data.updated_at } : null,
      settingsResult.data?.updated_at ? { id: "settings-update", label: "Settings updated", timestamp: settingsResult.data.updated_at } : null,
    ].filter(Boolean),
    lastUpdated: settingsResult.data?.updated_at || null,
  };
}

export async function fetchAdminBooks(options = {}) {
  const { includeArchived = false } = options;

  if (!hasSupabase()) {
    return books.map((book, index) => ({ ...book, displayOrder: book.displayOrder ?? index }));
  }

  let query = supabase.from("books").select("*");

  if (!includeArchived) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query.order("display_order", { ascending: true }).order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeBookRow);
}

export async function upsertAdminBook(form) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to save books.");
  }

  const payload = fromBookForm(form);
  const { error } = await supabase.from("books").upsert(payload);
  if (error) throw error;
}

export async function deleteAdminBook(bookId) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to delete books.");
  }

  const { error } = await supabase.from("books").update({ deleted_at: new Date().toISOString(), status: "archived", updated_at: new Date().toISOString() }).eq("id", bookId);
  if (error) throw error;
}

export async function restoreAdminBook(bookId) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to restore books.");
  }

  const { error } = await supabase.from("books").update({ deleted_at: null, status: "draft", updated_at: new Date().toISOString() }).eq("id", bookId);
  if (error) throw error;
}

export async function fetchAdminBlogPosts(options = {}) {
  const { includeArchived = false } = options;

  if (!hasSupabase()) {
    return blogPosts.map((post, index) => ({ ...post, slug: post.slug || post.id, displayOrder: index, bodyHtml: createLegacyHtml(post), status: post.status || "published" }));
  }

  let query = supabase.from("blog_posts").select("*");

  if (!includeArchived) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query.order("display_order", { ascending: true }).order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeBlogRow);
}

export async function upsertAdminBlogPost(form) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to save blog posts.");
  }

  let revisionHistory = [];
  if (form.id) {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("title, excerpt, body_html, updated_at, revision_history")
      .eq("id", form.id)
      .maybeSingle();

    if (existing) {
      revisionHistory = [
        ...(existing.revision_history || []),
        {
          edited_at: existing.updated_at || new Date().toISOString(),
          title: existing.title,
          excerpt: existing.excerpt,
          body_html: existing.body_html,
        },
      ].slice(-20);
    }
  }

  const payload = fromBlogForm(form, revisionHistory);
  const { error } = await supabase.from("blog_posts").upsert(payload);
  if (error) throw error;
}

export async function deleteAdminBlogPost(postId) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to delete blog posts.");
  }

  const { error } = await supabase.from("blog_posts").update({ deleted_at: new Date().toISOString(), status: "archived", updated_at: new Date().toISOString() }).eq("id", postId);
  if (error) throw error;
}

export async function restoreAdminBlogPost(postId) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to restore blog posts.");
  }

  const { error } = await supabase.from("blog_posts").update({ deleted_at: null, status: "draft", updated_at: new Date().toISOString() }).eq("id", postId);
  if (error) throw error;
}

export async function fetchAdminReviews() {
  if (!hasSupabase()) {
    return localReviews;
  }

  const { data, error } = await supabase.from("reviews").select("*").is("deleted_at", null).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeReviewRow);
}

export async function updateAdminReview(reviewId, updates) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to update reviews.");
  }

  const payload = { ...updates };
  if (payload.status && payload.status !== "pending") {
    payload.moderated_at = new Date().toISOString();
  }

  const { error } = await supabase.from("reviews").update(payload).eq("id", reviewId);
  if (error) throw error;
}

export async function deleteAdminReview(reviewId) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to delete reviews.");
  }

  const { error } = await supabase.from("reviews").update({ deleted_at: new Date().toISOString(), status: "rejected", moderated_at: new Date().toISOString() }).eq("id", reviewId);
  if (error) throw error;
}

export async function fetchAdminMessages() {
  if (!hasSupabase()) {
    return JSON.parse(window.localStorage.getItem("admin_messages") || "[]");
  }

  const { data, error } = await supabase.from("messages").select("*").is("deleted_at", null).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateAdminMessage(messageId, updates) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to update messages.");
  }

  const { error } = await supabase.from("messages").update(updates).eq("id", messageId);
  if (error) throw error;
}

export async function fetchAdminNewsletterSubscribers() {
  if (!hasSupabase()) {
    return JSON.parse(window.localStorage.getItem("newsletter_signups") || "[]").map((entry, index) => ({
      id: `${index}`,
      email: entry.email,
      source: entry.source,
      provider: entry.provider || "local",
      subscribed_at: entry.signupDate,
      status: "active",
    }));
  }

  const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deleteAdminNewsletterSubscriber(subscriberId) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to manage subscribers.");
  }

  const { error } = await supabase.from("newsletter_subscribers").update({ status: "deleted" }).eq("id", subscriberId);
  if (error) throw error;
}

export async function fetchAdminSettings() {
  const fallback = {
    site: siteConfig,
    socialLinks,
  };

  if (!hasSupabase()) {
    return fallback;
  }

  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;

  const globalRow = (data || []).find((row) => row.id === "global");
  if (globalRow?.value && typeof globalRow.value === "object") {
    return {
      site: globalRow.value.site || fallback.site,
      socialLinks: globalRow.value.socialLinks || fallback.socialLinks,
    };
  }

  return (data || []).reduce((acc, row) => {
    acc[row.id] = row.value;
    return acc;
  }, fallback);
}

export async function upsertAdminSetting(id, value) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to save settings.");
  }

  const { data: existing } = await supabase.from("site_settings").select("value").eq("id", "global").maybeSingle();
  const mergedValue = {
    site: id === "site" ? value : existing?.value?.site || siteConfig,
    socialLinks: id === "socialLinks" ? value : existing?.value?.socialLinks || socialLinks,
  };

  const { error } = await supabase.from("site_settings").upsert({ id: "global", value: mergedValue, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function listAdminMediaFiles() {
  if (!hasSupabase()) {
    return {
      files: [],
      bucketMissing: true,
    };
  }

  const { data, error } = await supabase.storage.from("media").list("", { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } });
  if (error) {
    if (error.message?.includes("Bucket not found")) {
      return {
        files: [],
        bucketMissing: true,
      };
    }

    throw error;
  }

  return {
    files: (data || []).map((file) => ({
      ...file,
      publicUrl: supabase.storage.from("media").getPublicUrl(file.name).data.publicUrl,
    })),
    bucketMissing: false,
  };
}

export async function uploadAdminMediaFile(file, folder = "uploads") {
  if (!hasSupabase()) {
    throw new Error("Supabase is required to upload media.");
  }

  const filePath = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("media").upload(filePath, file, { upsert: false });
  if (error) throw error;

  return {
    filePath,
    publicUrl: supabase.storage.from("media").getPublicUrl(filePath).data.publicUrl,
  };
}