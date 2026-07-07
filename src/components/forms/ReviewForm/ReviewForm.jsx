import { useMemo, useState } from "react";

import Button from "../../ui/Button/Button";
import { submitPendingReview } from "../../../services/reviewsService";
import "./ReviewForm.css";

function ReviewForm({ books, defaultBookId, source = "reviews-page", onSubmitted }) {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    reviewerName: "",
    reviewerEmail: "",
    bookId: defaultBookId || books[0]?.id || "",
    rating: 5,
    quote: "",
  });

  const sortedBooks = useMemo(() => books.map((book) => ({ id: book.id, title: book.title })), [books]);

  const handleChange = (key) => (event) => {
    const value = key === "rating" ? Number(event.target.value) : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");

    try {
      await submitPendingReview({ ...form, source });
      setStatus("success");
      setForm((current) => ({ ...current, quote: "" }));
      if (onSubmitted) {
        onSubmitted();
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">Share a Review</h3>

      <div className="review-form__grid">
        <label>
          Name
          <input type="text" value={form.reviewerName} onChange={handleChange("reviewerName")} required />
        </label>

        <label>
          Email
          <input type="email" value={form.reviewerEmail} onChange={handleChange("reviewerEmail")} required />
        </label>
      </div>

      <div className="review-form__grid">
        <label>
          Book
          <select value={form.bookId} onChange={handleChange("bookId")} required>
            {sortedBooks.map((book) => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
        </label>

        <label>
          Rating
          <select value={form.rating} onChange={handleChange("rating")} required>
            <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
            <option value={4}>⭐⭐⭐⭐ (4)</option>
            <option value={3}>⭐⭐⭐ (3)</option>
            <option value={2}>⭐⭐ (2)</option>
            <option value={1}>⭐ (1)</option>
          </select>
        </label>
      </div>

      <label>
        Review
        <textarea value={form.quote} onChange={handleChange("quote")} rows={5} required />
      </label>

      <Button type="submit">{status === "loading" ? "Submitting..." : "Submit Review"}</Button>

      {status === "success" ? (
        <p className="review-form__status review-form__status--success" role="status">
          Thanks. Your review is pending admin approval.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="review-form__status review-form__status--error" role="alert">
          Could not submit your review. Please try again.
        </p>
      ) : null}
    </form>
  );
}

export default ReviewForm;
