import { Link } from "react-router-dom";

import "./BookCard.css";

function BookCard({ title, description, badge, editions, bookId }) {
  const editionEntries = Object.entries(editions || {});

  return (
    <article className="book-card" aria-label={`${title} book card`}>
      <div className="book-card__spine" aria-hidden="true" />
      <div className="book-card__badge">{badge}</div>

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
