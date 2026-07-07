import { Link } from "react-router-dom";
import BookCoverArt from "./BookCoverArt";

function RelatedBooks({ books }) {
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="related-books" aria-labelledby="related-books-title">
      <div className="related-books__header">
        <p className="related-books__eyebrow">More Books</p>
        <h2 id="related-books-title" className="related-books__title">
          Continue through the library.
        </h2>
      </div>

      <div className="related-books__grid">
        {books.map((book) => (
          <article key={book.id} className="related-books__card">
            <BookCoverArt
              title={book.title}
              subtitle={book.editions?.english?.cover?.subtitle || book.subtitle}
              author={book.editions?.english?.cover?.author || "Anurag Verma"}
              badge={book.status}
              cover={book.editions?.english?.cover}
              variant="front"
              alt={`${book.title} cover`}
              className="related-books__cover"
              imageClassName="related-books__cover-image"
              loading="lazy"
            />
            <p className="related-books__status">{book.status}</p>
            <h3 className="related-books__card-title">{book.title}</h3>
            <p className="related-books__card-copy">{book.shortDescription || book.description}</p>
            <Link to={`/library/${book.id}`} className="related-books__link">
              View Book
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RelatedBooks;