import "./Library.css";

import { Helmet, HelmetProvider } from "react-helmet-async";

import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import BookCard from "../../components/ui/BookCard/BookCard";
import Container from "../../components/ui/Container/Container";
import books from "../../data/books";
import siteConfig from "../../data/siteConfig";

function Library() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Library | Anurag Verma</title>
        <meta
          name="description"
          content="Explore the complete library of books by Anurag Verma, including published work and upcoming titles."
        />
        <meta property="og:title" content="Library | Anurag Verma" />
        <meta
          property="og:description"
          content="Discover the books of Anurag Verma and find your next reflective read."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteConfig.url}/library`} />
        <link rel="canonical" href={`${siteConfig.url}/library`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Library | Anurag Verma" />
        <meta
          name="twitter:description"
          content="Explore the complete library of books by Anurag Verma, including published work and upcoming titles."
        />
      </Helmet>

      <section className="library-page" aria-labelledby="library-title">
        <Container>
          <SectionHeader
            titleId="library-title"
            eyebrow="Library"
            title="Stories for readers who stay with feeling, memory, and meaning."
            description="Browse all current titles. Each book opens into its own page with edition details, availability, and reading preview."
            align="left"
          />

          <div className="library-page__grid" role="list" aria-label="Book collection">
            {books.map((book) => (
              <div key={book.id} role="listitem">
                <BookCard
                  bookId={book.id}
                  title={book.title}
                  description={book.shortDescription || book.description}
                  badge={book.status}
                  editions={book.editions}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </HelmetProvider>
  );
}

export default Library;
