import "./Hero.css";
import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container/Container";

function Hero() {
  return (
    <section className="hero">
      <Container>
        <p className="hero__eyebrow">
          Author • Storyteller • Memoir Writer
        </p>

        <h1 className="hero__title">
          Stories that stay long after the last page.
        </h1>

        <p className="hero__description">
          Welcome to the official website of Anurag Verma, author of
          <em> The Last Goodbye I Never Got</em> and upcoming works exploring
          love, loss, healing, and the moments that shape us.
        </p>

        <div className="hero__actions">
          <Button>
            Explore My Books
          </Button>

          <Button variant="outline">
            About Me
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default Hero;