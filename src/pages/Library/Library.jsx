import "./Library.css";

import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
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

          <div className="library-page__collection" role="list" aria-label="Book collection">
            {books.map((book) => (
              <article key={book.id} role="listitem" className="library-page__item">
                <div className="library-page__item-head">
                  <h3 className="library-page__item-title">{book.title}</h3>
                  <p className="library-page__item-subtitle">{book.subtitle}</p>
                </div>

                {book.status === "Published" ? (
                  <div className="library-page__editions" aria-label={`${book.title} editions`}>
                    {Object.values(book.editions || {})
                      .filter((edition) => edition?.available)
                      .map((edition) => (
                        <div key={edition.languageCode} className="library-page__edition-row">
                          <span className="library-page__edition-name">{edition.label}</span>
                          <span className="library-page__edition-status">Published</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="library-page__editions" aria-label={`${book.title} status`}>
                    <div className="library-page__edition-row">
                      <span className="library-page__edition-name">Upcoming Edition</span>
                      <span className="library-page__edition-status">Coming Soon</span>
                    </div>
                  </div>
                )}

                <Link to={`/library/${book.id}`} className="library-page__item-link">
                  View Book
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </HelmetProvider>
  );
}

export default Library;
