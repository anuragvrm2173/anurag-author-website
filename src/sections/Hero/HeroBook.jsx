import { Link } from "react-router-dom";

import authorImage from "../../assets/images/author/author.jpg";
import usePublicContent from "../../hooks/usePublicContent";

const EDITION_OPTIMIZED_BASE = {
  en: "/images/optimized/books/(eng)lgb",
  hi: "/images/optimized/books/(hin)lgb",
};

function buildSrcSet(base, format) {
  if (!base) {
    return "";
  }

  return [400, 800, 1200]
    .map((width) => `${base}-${width}.${format} ${width}w`)
    .join(", ");
}

function HeroBook() {
  const { books } = usePublicContent({ includeBooks: true, includeBlogPosts: false });
  const featuredBook = books[0];
  if (!featuredBook) {
    return null;
  }

  const englishEdition = featuredBook.editions?.english;
  const hindiEdition = featuredBook.editions?.hindi;
  const editionRouteByLanguage = {
    en: `/library/${featuredBook.id}?edition=english`,
    hi: `/library/${featuredBook.id}?edition=hindi`,
  };

  return (
    <div className="hero__image">
      <div className="hero__spotlight">
        <div className="hero__spotlight-header">
          <p className="hero__spotlight-label">Latest Release</p>
          <span className="hero__spotlight-badge">Published</span>
        </div>

        <div className="hero__spotlight-editions" aria-label="Published editions">
          {[englishEdition, hindiEdition].filter(Boolean).map((edition) => (
            <Link
              key={edition.languageCode}
              to={editionRouteByLanguage[edition.languageCode] || `/library/${featuredBook.id}`}
              className="hero__spotlight-edition-link"
              aria-label={`View ${featuredBook.title} ${edition.label} edition`}
            >
              <picture>
                <source
                  type="image/avif"
                  srcSet={buildSrcSet(EDITION_OPTIMIZED_BASE[edition.languageCode], "avif")}
                  sizes="(max-width: 768px) 42vw, 220px"
                />
                <source
                  type="image/webp"
                  srcSet={buildSrcSet(EDITION_OPTIMIZED_BASE[edition.languageCode], "webp")}
                  sizes="(max-width: 768px) 42vw, 220px"
                />
                <img
                  src={edition.cover?.frontCover || edition.cover?.fullCover}
                  alt={`${featuredBook.title} ${edition.label} cover`}
                  className="hero__spotlight-edition-cover"
                  loading="eager"
                  fetchPriority="high"
                  width="800"
                  height="1200"
                />
              </picture>
            </Link>
          ))}
        </div>

        <h2 className="hero__spotlight-title">{featuredBook.title}</h2>
        <p className="hero__spotlight-copy">A Story of Love, Loss,<br />and the Echoes We Carry.</p>

        <Link to="/about" className="hero__spotlight-author hero__spotlight-author-link" aria-label="View author details">
          <picture>
            <source
              type="image/avif"
              srcSet="/images/optimized/author/author-400.avif 400w, /images/optimized/author/author-800.avif 800w, /images/optimized/author/author-1200.avif 1200w"
              sizes="96px"
            />
            <source
              type="image/webp"
              srcSet="/images/optimized/author/author-400.webp 400w, /images/optimized/author/author-800.webp 800w, /images/optimized/author/author-1200.webp 1200w"
              sizes="96px"
            />
            <img
              src={authorImage}
              alt="Anurag Verma"
              className="hero__spotlight-author-image"
              loading="lazy"
              width="160"
              height="160"
            />
          </picture>
          <div>
            <p className="hero__spotlight-author-name">Anurag Verma</p>
            <p className="hero__spotlight-author-line">Indian author writing stories of love, loss, and healing.</p>
          </div>
        </Link>

        <Link to={`/library/${featuredBook.id}?edition=english`} className="hero__spotlight-cta">
          Explore the Book →
        </Link>
      </div>
    </div>
  );
}

export default HeroBook;
