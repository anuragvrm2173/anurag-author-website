import "./Admin.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { deleteAdminReview, fetchAdminReviews, updateAdminReview } from "../../services/adminService";

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

function AdminReviews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const activeStatus = searchParams.get("status") || "all";

  useEffect(() => {
    fetchAdminReviews().then(setReviews).catch((nextError) => setError(nextError.message));
  }, []);

  const filteredReviews = useMemo(() => {
    if (activeStatus === "all") {
      return reviews;
    }

    if (activeStatus === "pending") {
      return reviews.filter((review) => ["submitted", "pending"].includes(review.status));
    }

    return reviews.filter((review) => review.status === activeStatus);
  }, [activeStatus, reviews]);

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
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}
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