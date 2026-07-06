import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
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
          <button>Explore My Books</button>

          <button>About Me</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;