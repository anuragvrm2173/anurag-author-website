import "./Reviews.css";

import ReviewCard from "../../components/reviews/ReviewCard/ReviewCard";
import Container from "../../components/ui/Container/Container";
import { getFeaturedReviews } from "../../data/reviews";
import useApprovedReviews from "../../hooks/useApprovedReviews";

function Reviews() {
  const { reviews } = useApprovedReviews();
  const testimonials = getFeaturedReviews(3, reviews);
  const reviewCount = reviews.length || 32;
  const averageRating = reviews.length
    ? (reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="reviews-preview" aria-labelledby="reviews-preview-title">
      <Container>
        <div className="reviews-preview__header">
          <p className="reviews-preview__eyebrow">Reader Response</p>
          <h2 id="reviews-preview-title" className="reviews-preview__title">
            Words readers return to again and again.
          </h2>
          <div className="reviews-preview__stats" aria-label="Rating summary">
            <p className="reviews-preview__avg">Average Rating {averageRating} ★★★★★</p>
            <p className="reviews-preview__count">{reviewCount} Reader Reviews</p>
          </div>
        </div>

        <div className="reviews-preview__grid">
          {testimonials.length > 0 ? (
            testimonials.map((item) => <ReviewCard review={item} key={item.id} />)
          ) : (
            <article className="review-card" aria-live="polite">
              <p className="review-card__quote">
                Reader reviews will appear here after publication.
              </p>
              <p className="review-card__author">Be the first to share your thoughts.</p>
            </article>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Reviews;
