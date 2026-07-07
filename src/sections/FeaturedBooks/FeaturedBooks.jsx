import "./FeaturedBooks.css";

import BookCard from "../../components/ui/BookCard/BookCard";
import Container from "../../components/ui/Container/Container";
import books from "../../data/books";

function FeaturedBooks() {
  const publishedBook = books.find((book) => book.status === "Published");
  const unpublishedBooks = books.filter((book) => book.status !== "Published").slice(0, 2);

  const featuredTiles = [
    publishedBook
      ? {
          key: `${publishedBook.id}-english`,
          bookId: publishedBook.id,
          title: publishedBook.title,
          subtitle: `${publishedBook.subtitle} (English Edition)`,
          description: publishedBook.shortDescription || publishedBook.description,
          badge: "Published",
          editions: { english: publishedBook.editions?.english },
        }
      : null,
    publishedBook
      ? {
          key: `${publishedBook.id}-hindi`,
          bookId: publishedBook.id,
          title: publishedBook.title,
          subtitle: `${publishedBook.subtitle} (Hindi Edition)`,
          description: publishedBook.shortDescription || publishedBook.description,
          badge: "Published",
          editions: { hindi: publishedBook.editions?.hindi },
        }
      : null,
    ...unpublishedBooks.map((book) => ({
      key: `${book.id}-upcoming`,
      bookId: book.id,
      title: book.title,
      subtitle: book.subtitle,
      description: book.shortDescription || book.description,
      badge: book.status,
      editions: { english: book.editions?.english },
    })),
  ].filter((tile) => tile?.editions && Object.values(tile.editions).some(Boolean));

  return (
    <section className="featured-books" aria-labelledby="featured-books-title">
      <Container>
        <div className="featured-books__header">
          <p className="featured-books__eyebrow">Books</p>
          <h2 id="featured-books-title" className="featured-books__title">
            Explore the Collection
          </h2>
        </div>

        <div className="featured-books__grid">
          {featuredTiles.map((tile) => (
            <BookCard
              key={tile.key}
              bookId={tile.bookId}
              title={tile.title}
              subtitle={tile.subtitle}
              description={tile.description}
              badge={tile.badge}
              editions={tile.editions}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedBooks;
