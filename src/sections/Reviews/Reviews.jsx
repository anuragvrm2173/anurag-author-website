import "./Reviews.css";

import Container from "../../components/ui/Container/Container";

function Reviews() {
  const testimonials = [
    {
      quote: "Elegant, thoughtful, and deeply human. Anurag Verma writes with rare clarity.",
      author: "— Reader Review",
    },
    {
      quote: "Every page feels considered, intimate, and quietly transformative.",
      author: "— Literary Journal",
    },
    {
      quote: "A writer who understands the power of restraint and emotional truth.",
      author: "— Book Club Member",
    },
  ];

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
            <article className="review-card" key={item.author}>
              <p className="review-card__quote">“{item.quote}”</p>
              <p className="review-card__author">{item.author}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Reviews;
