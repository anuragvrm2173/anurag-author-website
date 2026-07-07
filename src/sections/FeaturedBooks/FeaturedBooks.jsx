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
          cover: untoldBook.editions?.english?.cover,
          ctaLabel: "Notify Me",
          ctaTo: "/contact",
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
          cover: lessonsBook.editions?.english?.cover,
          ctaLabel: "Notify Me",
          ctaTo: "/contact",
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

        <div className="featured-books__cards" role="list" aria-label="Homepage book collection">
          {homepageTiles.map((tile) => (
            <article key={tile.key} role="listitem" className="featured-books__card">
              <BookCoverArt
                title={tile.title}
                subtitle={tile.subtitle}
                author={tile.cover?.author || "Anurag Verma"}
                badge={tile.status}
                cover={tile.cover}
                variant="front"
                alt={`${tile.title} ${tile.language} cover`}
                className="featured-books__cover"
                imageClassName="featured-books__cover-image"
                loading="lazy"
              />

              <div className="featured-books__card-head">
                <h3 className="featured-books__card-title">{tile.title}</h3>
                <p className="featured-books__language">{tile.language}</p>
                <span
                  className={`featured-books__status featured-books__status--${tile.status.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {tile.status}
                </span>
              </div>

              <Link to={tile.ctaTo} className="featured-books__view-link">
                {tile.ctaLabel}
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedBooks;
