import books from "../../data/books";

function HeroBook() {
  const publishedBooks = books.filter((book) => book.status === "Published").length;
  const totalEditions = books.reduce(
    (count, book) => count + Object.values(book.editions || {}).filter((edition) => edition.available).length,
    0
  );

  return (
    <div className="hero__image">
      <div className="hero__spotlight">
        <p className="hero__spotlight-label">Library Spotlight</p>
        <h2 className="hero__spotlight-title">The Last Goodbye I Never Got</h2>
        <p className="hero__spotlight-copy">
          Begin with a story shaped by grief, memory, and the quiet work of learning how to carry love forward.
        </p>

        <div className="hero__spotlight-stats" aria-label="Library highlights">
          <div className="hero__spotlight-stat">
            <span className="hero__spotlight-value">{books.length}</span>
            <span className="hero__spotlight-key">Books in the library</span>
          </div>

          <div className="hero__spotlight-stat">
            <span className="hero__spotlight-value">{publishedBooks}</span>
            <span className="hero__spotlight-key">Published title</span>
          </div>

          <div className="hero__spotlight-stat">
            <span className="hero__spotlight-value">{totalEditions}</span>
            <span className="hero__spotlight-key">Available editions</span>
          </div>
        </div>

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
