import "./Reviews.css";

import ReviewCard from "../../components/reviews/ReviewCard/ReviewCard";
import Container from "../../components/ui/Container/Container";
import { getFeaturedReviews } from "../../data/reviews";

function Reviews() {
  const testimonials = getFeaturedReviews(3);

  return (
    <section className="reviews-preview" aria-labelledby="reviews-preview-title">
      <Container>
        <div className="reviews-preview__header">
          <p className="reviews-preview__eyebrow">Reader Response</p>
          <h2 id="reviews-preview-title" className="reviews-preview__title">
            Words readers return to again and again.
          </h2>
        </div>

        <div className="reviews-preview__grid">
          {testimonials.map((item) => (
            <ReviewCard review={item} key={item.id} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Reviews;
