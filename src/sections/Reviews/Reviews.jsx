import "./Reviews.css";

import { Link } from "react-router-dom";

import ReviewCard from "../../components/reviews/ReviewCard/ReviewCard";
import Container from "../../components/ui/Container/Container";
import { getFeaturedReviews } from "../../data/reviews";
import useApprovedReviews from "../../hooks/useApprovedReviews";

function Reviews() {
  const { reviews } = useApprovedReviews();
  const testimonials = getFeaturedReviews(3, reviews);
  const reviewCount = reviews.length;
  const averageRating = reviews.length
    ? (reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="reviews-preview" aria-labelledby="reviews-preview-title">
      <Container>
        <div className="reviews-preview__header">
          <p className="reviews-preview__eyebrow">Reader Response</p>
          <h2 id="reviews-preview-title" className="reviews-preview__title">
            Words readers return to again and again.
          </h2>
          {reviewCount > 0 ? (
            <div className="reviews-preview__stats" aria-label="Rating summary">
              {averageRating ? <p className="reviews-preview__avg">Average Rating {averageRating} ★★★★★</p> : null}
              <p className="reviews-preview__count">{reviewCount} Reader Reviews</p>
            </div>
          ) : null}
        </div>

        <div className="reviews-preview__grid">
          {testimonials.length > 0 ? (
            testimonials.map((item) => <ReviewCard review={item} key={item.id} />)
          ) : (
            <article className="review-card" aria-live="polite">
              <p className="review-card__quote">
                No reader reviews yet.
              </p>
              <p className="review-card__author">Be the first to share your thoughts.</p>
            </article>
          )}
        </div>

        <div className="reviews-preview__actions">
          <Link to="/reviews#reviews-submit-title" className="reviews-preview__cta">
            Give Review
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default Reviews;
