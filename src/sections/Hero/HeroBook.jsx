import { Link } from "react-router-dom";

import authorImage from "../../assets/images/author/author.jpg";
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

        <div className="hero__spotlight-author" aria-label="Author summary">
          <img
            src={authorImage}
            alt="Anurag Verma"
            className="hero__spotlight-author-image"
            loading="lazy"
            width="160"
            height="160"
          />
          <div>
            <p className="hero__spotlight-author-name">Anurag Verma</p>
            <p className="hero__spotlight-author-line">Indian author writing stories of love, loss, and healing.</p>
          </div>
        </div>

        <Link to={`/library/${featuredBook.id}?edition=english`} className="hero__spotlight-cta">
          Explore the Book →
        </Link>
      </div>
    </div>
  );
}

export default HeroBook;
