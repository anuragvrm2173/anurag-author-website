import { reviews as localReviews } from "../data/reviews";
import { hasSupabase, supabase } from "./supabaseClient";

function normalizeReview(row) {
  return {
    id: row.id,
    bookId: row.book_id,
    reviewerName: row.reviewer_name,
    reviewerRole: row.reviewer_role || "Reader",
    quote: row.quote,
    source: row.source || null,
    rating: row.rating || 0,
    featured: Boolean(row.featured),
    status: row.status || "approved",
    createdAt: row.created_at || null,
  };
}

export async function fetchApprovedReviews() {
  if (!hasSupabase()) {
    return localReviews.filter((item) => item.status !== "pending");
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, book_id, reviewer_name, reviewer_role, quote, source, rating, featured, status, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeReview);
}

export async function submitPendingReview(payload) {
  const row = {
    book_id: payload.bookId,
    reviewer_name: payload.reviewerName,
    reviewer_email: payload.reviewerEmail,
    reviewer_role: payload.reviewerRole || "Reader",
    quote: payload.quote,
    rating: payload.rating,
    source: payload.source || "website",
    status: "pending",
  };

  if (!hasSupabase()) {
    const queued = JSON.parse(window.localStorage.getItem("pending_reviews") || "[]");
    queued.push({ ...row, created_at: new Date().toISOString() });
    window.localStorage.setItem("pending_reviews", JSON.stringify(queued));
    return { queued: true };
  }

  const { error } = await supabase.from("reviews").insert([row]);
  if (error) {
    throw error;
  }

  return { queued: false };
}
