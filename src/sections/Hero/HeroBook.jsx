import { Link } from "react-router-dom";

import books from "../../data/books";

function HeroBook() {
  const featuredBook = books[0];
  const englishEdition = featuredBook.editions?.english;
  const hindiEdition = featuredBook.editions?.hindi;

  return (
    <div className="hero__image">
      <div className="hero__spotlight">
        <div className="hero__spotlight-header">
          <p className="hero__spotlight-label">Latest Release</p>
          <span className="hero__spotlight-badge">Published</span>
        </div>

        <div className="hero__spotlight-editions" aria-label="Published editions">
          {[englishEdition, hindiEdition].filter(Boolean).map((edition) => (
            <img
              key={edition.languageCode}
              src={edition.cover?.frontCover || edition.cover?.fullCover}
              alt={`${featuredBook.title} ${edition.label} cover`}
              className="hero__spotlight-edition-cover"
              loading="eager"
              fetchpriority="high"
              width="800"
              height="1200"
            />
          ))}
        </div>

        <h2 className="hero__spotlight-title">{featuredBook.title}</h2>
        <p className="hero__spotlight-copy">A Story of Love, Loss,<br />and the Echoes We Carry.</p>

        <Link to={`/library/${featuredBook.id}?edition=english`} className="hero__spotlight-cta">
          Explore the Book →
        </Link>
      </div>
    </div>
  );
}

export default HeroBook;
