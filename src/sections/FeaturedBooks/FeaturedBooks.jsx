import "./FeaturedBooks.css";

import { Link } from "react-router-dom";

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
          ctaLabel: "Learn More",
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
          ctaLabel: "Learn More",
          ctaTo: `/library/${lessonsBook.id}`,
        }
      : null,
  ].filter(Boolean);

  const shelfColorByKey = {
    "last-goodbye-english": "featured-books__tile-icon--red",
    "last-goodbye-hindi": "featured-books__tile-icon--green",
    "untold-upcoming": "featured-books__tile-icon--blue",
    "lessons-upcoming": "featured-books__tile-icon--amber",
  };

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
              <div className="featured-books__tile-language-row">
                <span className={`featured-books__tile-icon ${shelfColorByKey[tile.key] || ""}`} aria-hidden="true" />
                <p className="featured-books__tile-language">{tile.language}</p>
              </div>

              <div className="featured-books__tile-head">
                <h3 className="featured-books__tile-title">{tile.title}</h3>
                <span
                  className={`featured-books__tile-status featured-books__tile-status--${tile.status.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {tile.status}
                </span>
              </div>

              <Link to={tile.ctaTo} className="featured-books__tile-link">
                {tile.ctaLabel}
              </Link>
            </article>
          ))}
          <span className="featured-books__shelf-plank" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}

export default FeaturedBooks;
