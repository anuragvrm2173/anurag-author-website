import "./Hero.css";

import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container/Container";

function Hero() {
  return (
    <section className="hero">
      <Container>

        <div className="hero__content">

          <div className="hero__text">

            <p className="hero__eyebrow">
              Author • Memoir Writer • Storyteller
            </p>

            <h1 className="hero__title">
              Stories that stay with you long after the final page.
            </h1>

            <p className="hero__description">
              Welcome to the official website of Anurag Verma,
              where every book is an honest conversation about
              love, loss, healing, and hope.
            </p>

            <div className="hero__buttons">
              <Button>
                Explore Books
              </Button>

              <Button variant="outline">
                About Me
              </Button>
            </div>

          </div>

          <div className="hero__image">

            <div className="hero__placeholder">
              Author Photo
            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}

export default Hero;