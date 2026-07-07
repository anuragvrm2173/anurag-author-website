import { Link } from "react-router-dom";
import BookCoverArt from "../../books/BookCoverArt";

import "./BookCard.css";

function BookCard({ title, subtitle, description, badge, editions, bookId }) {
  const editionEntries = Object.entries(editions || {});
  const preferredEdition = editionEntries.find(([, edition]) => edition.languageCode === "en")?.[1] || editionEntries[0]?.[1];

  return (
    <article className="book-card" aria-label={`${title} book card`}>
      <div className="book-card__spine" aria-hidden="true" />
      <div className="book-card__badge">{badge}</div>

      <BookCoverArt
        title={title}
        subtitle={preferredEdition?.cover?.subtitle || subtitle}
        author={preferredEdition?.cover?.author || "Anurag Verma"}
        badge={preferredEdition?.cover?.eyebrow || badge}
        coverImage={preferredEdition?.cover?.image || null}
        alt={`${title} cover`}
        className="book-card__cover"
        imageClassName="book-card__cover-image"
        loading="lazy"
      />

      <div className="book-card__content">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__description">{description}</p>

        <div className="book-card__editions" aria-label="Available editions">
          <span className="book-card__editions-label">Available in</span>
          <div className="book-card__edition-list">
            {editionEntries.map(([key, edition]) => (
              <span key={key} className="book-card__edition">
                {edition.label}
              </span>
            ))}
          </div>
        </div>
      </div>

        <div className="book-card__footer">
          <Link to={`/library/${bookId}`} className="book-card__button">
            View Book
          </Link>
        </div>
    </article>
  );
}

export default BookCard;
