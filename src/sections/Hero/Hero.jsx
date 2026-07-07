import "./Hero.css";

import Container from "../../components/ui/Container/Container";
import HeroBook from "./HeroBook";
import HeroContent from "./HeroContent";

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Container>
        <div className="hero__content">
          <HeroContent />
          <HeroBook />
        </div>
      </Container>
    </section>
  );
}

export default Hero;