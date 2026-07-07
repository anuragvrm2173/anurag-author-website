import "./Library.css";

import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

import BookCoverArt from "../../components/books/BookCoverArt";
import UpcomingBookCover from "../../components/books/UpcomingBookCover";
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

          <div className="library-page__cards" role="list" aria-label="Book collection">
            {books.map((book) => (
              <article key={book.id} role="listitem" className="library-page__card">
                <div className="library-page__card-head">
                  <h3 className="library-page__card-title">{book.title}</h3>
                  <p className="library-page__card-subtitle">{book.subtitle}</p>
                </div>

                {book.status === "Published" ? (
                  <div className="library-page__editions" aria-label={`${book.title} editions`}>
                    {Object.entries(book.editions || {})
                      .filter(([, edition]) => edition?.available)
                      .map(([editionKey, edition]) => (
                        <article key={edition.languageCode} className="library-page__edition-block">
                          <BookCoverArt
                            title={book.title}
                            subtitle={edition.cover?.subtitle || edition.formatLabel}
                            author={edition.cover?.author || "Anurag Verma"}
                            badge={edition.cover?.eyebrow || "Published"}
                            cover={edition.cover}
                            variant="front"
                            alt={`${book.title} ${edition.label} cover`}
                            className="library-page__edition-cover"
                            imageClassName="library-page__edition-cover-image"
                            loading="lazy"
                          />

                          <div className="library-page__edition-meta">
                            <p className="library-page__edition-language">{edition.label}</p>
                            <span className="library-page__edition-status library-page__edition-status--published">Published</span>
                            <Link to={`/library/${book.id}?edition=${editionKey}`} className="library-page__edition-link">
                              View Details
                            </Link>
                          </div>
                        </article>
                      ))}
                  </div>
                ) : (
                  <div className="library-page__upcoming" aria-label={`${book.title} status`}>
                    <UpcomingBookCover
                      title={book.title}
                      subtitle={book.subtitle}
                      author="Anurag Verma"
                      badge="Coming Soon"
                      className="library-page__upcoming-cover"
                    />

                    <div className="library-page__upcoming-meta">
                      <span className="library-page__upcoming-badge library-page__upcoming-badge--coming-soon">Coming Soon</span>
                      <Link to="/contact" className="library-page__notify-link">
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
    </HelmetProvider>
  );
}

export default Library;
