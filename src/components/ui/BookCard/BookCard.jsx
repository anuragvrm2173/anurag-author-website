import "./BookCard.css";

function BookCard({ title, author, description }) {
  return (
    <article className="book-card">
      <div className="book-card__content">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>
        <p className="book-card__description">{description}</p>
      </div>
    </article>
  );
}

export default BookCard;
