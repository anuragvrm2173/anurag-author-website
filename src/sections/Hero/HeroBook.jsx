import authorImage from "../../assets/images/author/author.jpg";
import books from "../../data/books";

function HeroBook() {
  const featuredBook = books[0];
  const publishedEditions = Object.values(featuredBook.editions || {}).filter((edition) => edition.available);

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

        <div className="hero__spotlight-author" aria-label="Author summary">
          <img src={authorImage} alt="Anurag Verma" className="hero__spotlight-author-image" loading="lazy" width="320" height="320" />
          <div>
            <p className="hero__spotlight-author-name">Anurag Verma</p>
            <p className="hero__spotlight-author-role">Indian Author</p>
          </div>
        </div>

        <div className="hero__spotlight-editions" aria-label="Published editions">
          {publishedEditions.map((edition) => (
            <article key={edition.languageCode} className="hero__spotlight-edition">
              <img
                src={edition.cover?.frontCover || edition.cover?.fullCover}
                alt={`${featuredBook.title} ${edition.label} cover`}
                className="hero__spotlight-edition-cover"
                loading="lazy"
                width="800"
                height="1200"
              />
              <div className="hero__spotlight-edition-meta">
                <p className="hero__spotlight-edition-label">{edition.formatLabel}</p>
                <p>{edition.publisher}</p>
                <p>{new Date(edition.publicationDate).toLocaleDateString("en-IN")}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="hero__spotlight-note">
          <span className="hero__spotlight-note-mark" aria-hidden="true">
            /
          </span>
          <p>
            Explore English and Hindi editions from the library for complete details, formats, and updates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeroBook;
