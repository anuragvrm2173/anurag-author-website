import "./Admin.css";

import { useEffect, useState } from "react";

import { deleteAdminReview, fetchAdminReviews, updateAdminReview } from "../../services/adminService";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminReviews().then(setReviews).catch((nextError) => setError(nextError.message));
  }, []);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Reviews</p>
          <h1 className="admin-page__title">Moderate reader feedback</h1>
          <p className="admin-page__description">Approve, reject, feature, edit, or remove incoming reviews.</p>
        </div>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}

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
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>
                  <strong>{review.reviewerName}</strong>
                  <div>{review.reviewerEmail || review.reviewerRole}</div>
                </td>
                <td>{review.bookId}</td>
                <td>{review.quote}</td>
                <td><span className={`admin-status-pill admin-status-pill--${review.status}`}>{review.status}</span></td>
                <td>
                  <div className="admin-table__actions">
                    {review.status !== "approved" ? (
                      <button type="button" className="admin-inline-button" onClick={async () => {
                        await updateAdminReview(review.id, { status: "approved" });
                        setReviews((current) => current.map((item) => item.id === review.id ? { ...item, status: "approved" } : item));
                      }}>Approve</button>
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
    </section>
  );
}

export default AdminReviews;