import "./AboutPreview.css";

import { Link } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container/Container";

function AboutPreview() {
  return (
    <section className="about-preview" aria-labelledby="about-preview-title">
      <Container>
        <div className="about-preview__content">
          <div className="about-preview__text">
            <p className="about-preview__eyebrow">About the Author</p>
            <h2 id="about-preview-title" className="about-preview__title">
              The Story Behind the Words
            </h2>
            <p className="about-preview__description">
              Anurag Verma is an Indian author who writes about love, loss, healing, and
              personal growth through deeply human stories. His books are built from lived
              experience and emotional honesty, offering readers reflection, hope, and meaning
              that stays with them long after the final page.
            </p>
            <Link to="/about">
              <Button>Read The Story</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutPreview;
