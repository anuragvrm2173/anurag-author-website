import books from "../../data/books";

function HeroBook() {
  const featuredBook = books[0];

  return (
    <div className="hero__image">
      <div className="hero__spotlight">
        <div className="hero__spotlight-header">
          <p className="hero__spotlight-label">Featured Book</p>
          <span className="hero__spotlight-badge">{featuredBook.status}</span>
        </div>

        <h2 className="hero__spotlight-title">{featuredBook.title}</h2>
        <p className="hero__spotlight-copy">
          Begin with a story shaped by grief, memory, and the quiet work of learning how to carry love forward.
        </p>

        <div className="hero__spotlight-note">
          <span className="hero__spotlight-note-mark" aria-hidden="true">
            /
          </span>
          <p>
            Explore the library first. Author photography belongs with the deeper personal story on the About page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeroBook;
