import "./Hero.css";

import { Link } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container/Container";

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Container>
        <div className="hero__content">
          <div className="hero__text">
            <p className="hero__eyebrow">Author • Memoir Writer • Storyteller</p>

            <h1 id="hero-title" className="hero__title">
              Stories that stay with you long after the final page.
            </h1>

            <p className="hero__description">
              Welcome to the official website of Anurag Verma, where every book is an honest
              conversation about love, loss, healing, and hope.
            </p>

            <div className="hero__buttons">
              <Link to="/library" className="hero__link">
                <Button>Explore Books</Button>
              </Link>

              <Link to="/about" className="hero__link">
                <Button variant="outline">About the Author</Button>
              </Link>
            </div>
          </div>

          <div className="hero__image" aria-hidden="true">
            <div className="hero__portrait">Author Portrait</div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;