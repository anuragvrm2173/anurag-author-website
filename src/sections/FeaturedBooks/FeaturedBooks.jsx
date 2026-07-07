import "./FeaturedBooks.css";

import { Link } from "react-router-dom";

import BookCoverArt from "../../components/books/BookCoverArt";
import Container from "../../components/ui/Container/Container";
import books from "../../data/books";

function FeaturedBooks() {
  const publishedBook = books.find((book) => book.id === "the-last-goodbye");
  const untoldBook = books.find((book) => book.id === "the-untold-stories");
  const lessonsBook = books.find((book) => book.id === "lessons-of-the-heart");

  const homepageTiles = [
    publishedBook
      ? {
          key: "last-goodbye-english",
          bookId: publishedBook.id,
          title: publishedBook.title,
          subtitle: publishedBook.subtitle,
          language: "English",
          status: "Published",
          cover: publishedBook.editions?.english?.cover,
          ctaLabel: "View Book",
          ctaTo: `/library/${publishedBook.id}?edition=english`,
        }
      : null,
    publishedBook
      ? {
          key: "last-goodbye-hindi",
          bookId: publishedBook.id,
          title: publishedBook.title,
          subtitle: publishedBook.subtitle,
          language: "हिन्दी",
          status: "Published",
          cover: publishedBook.editions?.hindi?.cover,
          ctaLabel: "View Book",
          ctaTo: `/library/${publishedBook.id}?edition=hindi`,
        }
      : null,
    untoldBook
      ? {
          key: "untold-upcoming",
          bookId: untoldBook.id,
          title: untoldBook.title,
          subtitle: untoldBook.subtitle,
          language: "English & हिन्दी",
          status: "Coming Soon",
          ctaLabel: "Coming Soon",
          ctaTo: `/library/${untoldBook.id}`,
        }
      : null,
    lessonsBook
      ? {
          key: "lessons-upcoming",
          bookId: lessonsBook.id,
          title: lessonsBook.title,
          subtitle: lessonsBook.subtitle,
          language: "English & हिन्दी",
          status: "Coming Soon",
          ctaLabel: "Coming Soon",
          ctaTo: `/library/${lessonsBook.id}`,
        }
      : null,
  ].filter(Boolean);

  return (
    <section className="featured-books" aria-labelledby="featured-books-title">
      <Container>
        <div className="featured-books__header">
          <p className="featured-books__eyebrow">Books</p>
          <h2 id="featured-books-title" className="featured-books__title">
            Explore the Collection
          </h2>
        </div>

        <div className="featured-books__shelf" role="list" aria-label="Homepage book collection">
          {homepageTiles.map((tile) => (
            <article key={tile.key} role="listitem" className="featured-books__tile">
              <p className="featured-books__tile-language">{tile.language}</p>

              {tile.cover?.frontCover ? (
                <BookCoverArt
                  title={tile.title}
                  subtitle={tile.subtitle}
                  author={tile.cover?.author || "Anurag Verma"}
                  badge={tile.status}
                  cover={tile.cover}
                  variant="front"
                  alt={`${tile.title} ${tile.language} cover`}
                  className="featured-books__tile-cover"
                  imageClassName="featured-books__tile-cover-image"
                  loading="lazy"
                />
              ) : (
                <div className="featured-books__tile-placeholder" aria-hidden="true">
                  {tile.title}
                </div>
              )}

              <div className="featured-books__tile-head">
                <h3 className="featured-books__tile-title">{tile.title}</h3>
                {tile.status === "Coming Soon" ? (
                  <span className="featured-books__tile-status featured-books__tile-status--coming-soon">Coming Soon</span>
                ) : null}
              </div>

              {tile.status === "Published" ? (
                <Link to={tile.ctaTo} className="featured-books__tile-link">
                  View Book
                </Link>
              ) : (
                <Link to={tile.ctaTo} className="featured-books__tile-link featured-books__tile-link--muted">
                  {tile.ctaLabel}
                </Link>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedBooks;
