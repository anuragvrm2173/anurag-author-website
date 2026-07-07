import "./FeaturedBooks.css";

import BookCard from "../../components/ui/BookCard/BookCard";
import Container from "../../components/ui/Container/Container";
import books from "../../data/books";

function FeaturedBooks() {
  return (
    <section className="featured-books" aria-labelledby="featured-books-title">
      <Container>
        <div className="featured-books__header">
          <p className="featured-books__eyebrow">Featured Books</p>
          <h2 id="featured-books-title" className="featured-books__title">
            Books that invite reflection, tenderness, and lasting thought.
          </h2>
        </div>

        <div className="featured-books__grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              bookId={book.id}
              title={book.title}
              subtitle={book.subtitle}
              description={book.shortDescription || book.description}
              badge={book.status}
              editions={book.editions}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedBooks;
