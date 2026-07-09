import "./Admin.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { deleteAdminReview, fetchAdminReviews, updateAdminReview, insertAdminReview } from "../../services/adminService";

const REVIEW_FLOW = {
  submitted: "Move to Pending",
  pending: "Approve",
  approved: "Publish",
};

function getNextReviewStatus(status) {
  if (status === "submitted") return "pending";
  if (status === "pending") return "approved";
  if (status === "approved") return "published";
  return null;
}

function ReviewQuickForm({ onAdded, onError }) {
  const [form, setForm] = useState({
    reviewerName: "",
    reviewerEmail: "",
    reviewerRole: "Reader",
    bookId: "",
    quote: "",
    rating: 5,
    source: "Direct Entry",
    sourceUrl: "",
    status: "approved",
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    import("../../data/books").then((m) => setBooks(m.default || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reviewerName || !form.bookId || !form.quote) {
      onError("Reviewer name, book, and quote are required");
      return;
    }

    setSaving(true);
    try {
      await insertAdminReview({
        book_id: form.bookId,
        reviewer_name: form.reviewerName,
        reviewer_email: form.reviewerEmail || "unknown@example.com",
        reviewer_role: form.reviewerRole,
        quote: form.quote,
        rating: form.rating,
        source: form.source,
        source_url: form.sourceUrl || null,
        status: form.status,
        featured: form.featured,
      });
      setForm({
        reviewerName: "",
        reviewerEmail: "",
        reviewerRole: "Reader",
        bookId: "",
        quote: "",
        rating: 5,
        source: "Direct Entry",
        sourceUrl: "",
        status: "approved",
        featured: false,
      });
      onAdded();
      onError("");
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card" style={{ marginBottom: "2rem", display: "grid", gap: "1rem" }}>
      <p className="admin-card__label">Quick Add Review</p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Reviewer Name *</label>
            <input value={form.reviewerName} onChange={(e) => setForm({ ...form, reviewerName: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
          </div>
          <div>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Email</label>
            <input type="email" value={form.reviewerEmail} onChange={(e) => setForm({ ...form, reviewerEmail: e.target.value })} placeholder="reviewer@example.com" style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Role</label>
            <input value={form.reviewerRole} onChange={(e) => setForm({ ...form, reviewerRole: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
          </div>
          <div>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Book *</label>
            <select value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }}>
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Review Quote *</label>
          <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem", minHeight: "100px", fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Source</label>
            <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
          </div>
          <div>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Source URL</label>
            <input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://..." style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} id="rev-featured" />
            <label htmlFor="rev-featured" style={{ fontWeight: "600", margin: 0 }}>Featured</label>
          </div>
        </div>
        <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", borderRadius: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontWeight: "600" }}>
          {saving ? "Adding..." : "Add Review"}
        </button>
      </form>
    </div>
  );
}

function AdminReviews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const activeStatus = searchParams.get("status") || "all";
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchAdminReviews().then(setReviews).catch((nextError) => setError(nextError.message));
    import("../../data/books").then((m) => setBooks(m.default || []));
  }, []);

  const filteredReviews = useMemo(() => {
    let filtered = reviews;
    if (activeStatus === "all") {
      filtered = reviews;
    } else if (activeStatus === "pending") {
      filtered = reviews.filter((review) => ["submitted", "pending"].includes(review.status));
    } else {
      filtered = reviews.filter((review) => review.status === activeStatus);
    }

    const sorted = [...filtered];
    if (sortBy === "highest-rated") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      });
    } else {
      sorted.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    }
    return sorted;
  }, [activeStatus, reviews, sortBy]);

  const editingReview = editingReviewId ? reviews.find((r) => r.id === editingReviewId) : null;

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Reviews</p>
          <h1 className="admin-page__title">Moderate reader feedback</h1>
          <p className="admin-page__description">Approve, reject, feature, edit, or remove incoming reviews.</p>
        </div>
        <div className="admin-filter-group" role="tablist" aria-label="Review status filters">
          {[
            ["all", "All"],
            ["pending", "Pending Queue"],
            ["approved", "Approved"],
            ["published", "Published"],
            ["rejected", "Rejected"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`admin-filter-chip ${activeStatus === value ? "admin-filter-chip--active" : ""}`.trim()}
              onClick={() => {
                setSearchParams((current) => {
                  const nextParams = new URLSearchParams(current);
                  if (value === "all") {
                    nextParams.delete("status");
                  } else {
                    nextParams.set("status", value);
                  }
                  return nextParams;
                });
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="admin-sort" htmlFor="admin-reviews-sort">
          <span>Sort by</span>
          <select id="admin-reviews-sort" value={sortBy} onChange={(event) => {
            setSortBy(event.target.value);
            setSearchParams((current) => {
              const nextParams = new URLSearchParams(current);
              nextParams.set("sort", event.target.value);
              return nextParams;
            });
          }}>
            <option value="newest">Newest</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}

      {editingReview ? (
        <div className="admin-card" style={{ marginBottom: "2rem", display: "grid", gap: "1rem", background: "#f9f3e6", border: "2px solid var(--color-primary)" }}>
          <p className="admin-card__label">Edit Review</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            try {
              await updateAdminReview(editingReview.id, {
                reviewer_name: formData.get("reviewerName"),
                reviewer_email: formData.get("reviewerEmail"),
                reviewer_role: formData.get("reviewerRole"),
                book_id: formData.get("bookId"),
                quote: formData.get("quote"),
                rating: Number(formData.get("rating")),
                source: formData.get("source"),
                source_url: formData.get("sourceUrl"),
              });
              setReviews((current) => current.map((item) => item.id === editingReview.id ? {
                ...item,
                reviewer_name: formData.get("reviewerName"),
                reviewer_email: formData.get("reviewerEmail"),
                reviewer_role: formData.get("reviewerRole"),
                book_id: formData.get("bookId"),
                quote: formData.get("quote"),
                rating: Number(formData.get("rating")),
                source: formData.get("source"),
                source_url: formData.get("sourceUrl"),
              } : item));
              setEditingReviewId(null);
              setError("");
            } catch (err) {
              setError(err.message);
            }
          }} style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Reviewer Name *</label>
                <input name="reviewerName" defaultValue={editingReview.reviewer_name} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
              </div>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Email</label>
                <input type="email" name="reviewerEmail" defaultValue={editingReview.reviewer_email} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Role</label>
                <input name="reviewerRole" defaultValue={editingReview.reviewer_role} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
              </div>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Book *</label>
                <select name="bookId" defaultValue={editingReview.book_id} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }}>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Rating (1-5)</label>
                <select name="rating" defaultValue={editingReview.rating} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
              </div>
              <div />
            </div>
            <div>
              <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Review Quote *</label>
              <textarea name="quote" defaultValue={editingReview.quote} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem", minHeight: "100px", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Source</label>
                <input name="source" defaultValue={editingReview.source} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
              </div>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Source URL</label>
                <input type="url" name="sourceUrl" defaultValue={editingReview.source_url || ""} placeholder="https://..." style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" style={{ padding: "0.75rem 1.5rem", borderRadius: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontWeight: "600" }}>Save Changes</button>
              <button type="button" onClick={() => setEditingReviewId(null)} style={{ padding: "0.75rem 1.5rem", borderRadius: "0.5rem", background: "#ccc", color: "black", border: "none", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      <ReviewQuickForm onAdded={() => {
        fetchAdminReviews().then(setReviews).catch((nextError) => setError(nextError.message));
      }} onError={setError} />

      {reviews.length > 0 && filteredReviews.length === 0 ? <div className="admin-empty">No reviews match the current filter.</div> : null}

      {filteredReviews.length > 0 ? (
        <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>Book</th>
              <th>Quote</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review.id}>
                <td data-label="Reviewer">
                  <strong>{review.reviewerName}</strong>
                  <div>{review.reviewerEmail || review.reviewerRole}</div>
                </td>
                <td data-label="Book">{review.bookId}</td>
                <td data-label="Quote">{review.quote}</td>
                <td data-label="Status"><span className={`admin-status-pill admin-status-pill--${review.status}`}>{review.status}</span></td>
                <td data-label="Actions">
                  <div className="admin-table__actions">
                    <button type="button" className="admin-inline-button" onClick={() => setEditingReviewId(review.id)}>Edit</button>
                    {getNextReviewStatus(review.status) ? (
                      <button type="button" className="admin-inline-button" onClick={async () => {
                        const nextStatus = getNextReviewStatus(review.status);
                        await updateAdminReview(review.id, { status: nextStatus });
                        setReviews((current) => current.map((item) => item.id === review.id ? { ...item, status: nextStatus } : item));
                      }}>{REVIEW_FLOW[review.status]}</button>
                    ) : null}
                    {review.status !== "rejected" ? (
                      <button type="button" className="admin-inline-button" onClick={async () => {
                        await updateAdminReview(review.id, { status: "rejected" });
                        setReviews((current) => current.map((item) => item.id === review.id ? { ...item, status: "rejected" } : item));
                      }}>Reject</button>
                    ) : null}
                    <button type="button" className="admin-inline-button" onClick={async () => {
                      await updateAdminReview(review.id, { featured: !review.featured });
                      setReviews((current) => current.map((item) => item.id === review.id ? { ...item, featured: !item.featured } : item));
                    }}>{review.featured ? "Unfeature" : "Feature"}</button>
                    <button type="button" className="admin-inline-button admin-inline-button--danger" onClick={async () => {
                      if (!window.confirm("Delete this review?")) {
                        return;
                      }
                      await deleteAdminReview(review.id);
                      setReviews((current) => current.filter((item) => item.id !== review.id));
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : null}
    </section>
  );
}

export default AdminReviews;