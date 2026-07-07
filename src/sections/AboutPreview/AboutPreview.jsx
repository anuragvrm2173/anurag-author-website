import "./AboutPreview.css";

import { Link } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container/Container";

function AboutPreview() {
  return (
    <section className="about-preview" aria-labelledby="about-preview-title">
      <Container>
        <div className="about-preview__content">
          <div className="about-preview__image" aria-hidden="true">
            <div className="about-preview__image-inner">Author Portrait</div>
          </div>

          <div className="about-preview__text">
            <p className="about-preview__eyebrow">About the Author</p>
            <h2 id="about-preview-title" className="about-preview__title">
              A voice shaped by reflection, resilience, and literary care.
            </h2>
            <p className="about-preview__description">
              Anurag Verma writes with a rare sensitivity to memory, emotion, and the quiet
              wisdom that follows personal transformation. His work invites readers into calm,
              intelligent stories that remain with them long after they close the book.
            </p>
            <Link to="/about">
              <Button>Read More</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutPreview;
