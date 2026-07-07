import "./FeaturedBooks.css";

import { Link } from "react-router-dom";

import BookCoverArt from "../../components/books/BookCoverArt";
import UpcomingBookCover from "../../components/books/UpcomingBookCover";
import Container from "../../components/ui/Container/Container";
import books from "../../data/books";

function FeaturedBooks() {
  return (
    <section className="featured-books" aria-labelledby="featured-books-title">
      <Container>
        <div className="featured-books__header">
          <p className="featured-books__eyebrow">Books</p>
          <h2 id="featured-books-title" className="featured-books__title">
            Explore the Collection
          </h2>
        </div>

        <div className="featured-books__cards" role="list" aria-label="Homepage book collection">
          {books.map((book) => (
            <article key={book.id} role="listitem" className="featured-books__card">
              <div className="featured-books__card-head">
                <h3 className="featured-books__card-title">{book.title}</h3>
                <p className="featured-books__card-subtitle">{book.subtitle}</p>
              </div>

              {book.status === "Published" ? (
                <div className="featured-books__editions" aria-label={`${book.title} editions`}>
                  {Object.entries(book.editions || {})
                    .filter(([, edition]) => edition?.available)
                    .map(([editionKey, edition]) => (
                      <article key={edition.languageCode} className="featured-books__edition-block">
                        <BookCoverArt
                          title={book.title}
                          subtitle={edition.cover?.subtitle || edition.formatLabel}
                          author={edition.cover?.author || "Anurag Verma"}
                          badge={edition.cover?.eyebrow || "Published"}
                          cover={edition.cover}
                          variant="front"
                          alt={`${book.title} ${edition.label} cover`}
                          className="featured-books__edition-cover"
                          imageClassName="featured-books__edition-cover-image"
                          loading="lazy"
                        />

                        <div className="featured-books__edition-meta">
                          <p className="featured-books__edition-language">{edition.label}</p>
                          <span className="featured-books__edition-status">Published</span>
                          <Link to={`/library/${book.id}?edition=${editionKey}`} className="featured-books__edition-link">
                            View Details
                          </Link>
                        </div>
                      </article>
                    ))}
                </div>
              ) : (
                <div className="featured-books__upcoming" aria-label={`${book.title} status`}>
                  <UpcomingBookCover
                    title={book.title}
                    subtitle={book.subtitle}
                    author="Anurag Verma"
                    badge="Coming Soon"
                    className="featured-books__upcoming-cover"
                  />

                  <div className="featured-books__upcoming-meta">
                    <span className="featured-books__upcoming-badge">Coming Soon</span>
                    <Link to="/contact" className="featured-books__notify-link">
                      Notify Me
                    </Link>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedBooks;
