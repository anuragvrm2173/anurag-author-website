import { useEffect, useMemo, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import BookHero from "../../components/books/BookHero";
import BookSynopsis from "../../components/books/BookSynopsis";
import EditionSelector from "../../components/books/EditionSelector";
import PurchasePanel from "../../components/books/PurchasePanel";
import RelatedBooks from "../../components/books/RelatedBooks";
import BookReader from "../../components/reader/BookReader";
import ReaderModal from "../../components/reader/ReaderModal";
import Container from "../../components/ui/Container/Container";
import { sampleMap } from "../../data/samples";
import { getReviewsByBookId } from "../../data/reviews";
import siteConfig from "../../data/siteConfig";
import books, { getBookById, getRelatedBooks } from "../../data/books";

import "./BookDetails.css";

function BookDetails() {
  const { bookId } = useParams();
  const [selectedEditionKey, setSelectedEditionKey] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const book = getBookById(bookId);
  const relatedBooks = book ? getRelatedBooks(book.id) : books.slice(0, 2);
  const editionEntries = useMemo(() => Object.entries(book?.editions || {}), [book]);
  const defaultEditionKey = useMemo(
    () => editionEntries.find(([, edition]) => edition.available)?.[0] || editionEntries[0]?.[0] || null,
    [editionEntries]
  );

  useEffect(() => {
    setSelectedEditionKey(defaultEditionKey);
    setIsReaderOpen(false);
  }, [defaultEditionKey, bookId]);

  if (!book) {
    return (
      <HelmetProvider>
        <Helmet>
          <title>Book Not Found | Anurag Verma</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <section className="book-details book-details--not-found">
          <Container>
            <p className="book-details__breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/library">Library</Link>
            </p>

            <div className="book-details__missing">
              <h1>Book not found</h1>
              <p>The requested book is not available in the library.</p>
              <Link to="/library" className="book-details__back-link">
                Return to Library
              </Link>
            </div>
          </Container>
        </section>
      </HelmetProvider>
    );
  }

  const activeEdition = book.editions[selectedEditionKey] || editionEntries[0]?.[1];
  const activeSample = activeEdition?.sampleId ? sampleMap[activeEdition.sampleId] : null;
  const bookReviews = getReviewsByBookId(book.id);
  const metaTitle = book.seo?.title || `${book.title} | Anurag Verma`;
  const metaDescription = book.seo?.description || book.shortDescription || book.description;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: metaDescription,
    isbn: activeEdition?.isbn || book.isbn,
    datePublished: activeEdition?.publicationDate || book.publicationDate,
    numberOfPages: activeEdition?.pages || book.pages,
    publisher: {
      "@type": "Organization",
      name: activeEdition?.publisher || book.publisher,
    },
    author: {
      "@type": "Person",
      name: "Anurag Verma",
    },
    inLanguage: activeEdition?.languageCode,
    bookFormat: activeEdition?.formatLabel,
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="book" />
        <meta property="og:site_name" content="Anurag Verma" />
        <meta property="og:url" content={`${siteConfig.url}/library/${book.id}`} />
        <link rel="canonical" href={`${siteConfig.url}/library/${book.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section className="book-details">
        <Container>
          <p className="book-details__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/library">Library</Link>
            <span>/</span>
            <span>{book.title}</span>
          </p>

          <BookHero book={book} activeEdition={activeEdition}>
            <EditionSelector
              editions={editionEntries}
              selectedEditionKey={selectedEditionKey}
              onChange={setSelectedEditionKey}
            />

            <PurchasePanel
              bookStatus={book.status}
              activeEdition={activeEdition}
              onPreviewOpen={() => setIsReaderOpen(true)}
            />
          </BookHero>

          <BookSynopsis longDescription={book.longDescription} synopsis={book.synopsis} themes={book.themes} />

          <section className="book-synopsis" aria-label="Book metadata">
            <div className="book-synopsis__section">
              <p className="book-synopsis__eyebrow">Book Details</p>
              <ul className="book-synopsis__list">
                <li className="book-synopsis__list-item">Genres: {book.genres.join(", ")}</li>
                <li className="book-synopsis__list-item">
                  Publication Date: {new Date(book.publicationDate).toLocaleDateString("en-IN")}
                </li>
                <li className="book-synopsis__list-item">Pages: {activeEdition.pages || book.pages}</li>
                <li className="book-synopsis__list-item">Publisher: {activeEdition.publisher || book.publisher}</li>
                <li className="book-synopsis__list-item">ISBN: {activeEdition.isbn || book.isbn}</li>
              </ul>
            </div>

            <div className="book-synopsis__section">
              <p className="book-synopsis__eyebrow">Formats</p>
              <ul className="book-synopsis__list">
                {Object.entries(activeEdition.formats || {}).map(([format, available]) => (
                  <li key={format} className="book-synopsis__list-item">
                    {format.toUpperCase()}: {available ? "Available" : "Coming Soon"}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {bookReviews.length > 0 ? (
            <section className="book-reviews" aria-labelledby="book-reviews-title">
              <p className="book-reviews__eyebrow">Reader Reviews</p>
              <h2 id="book-reviews-title" className="book-reviews__title">
                What readers are saying.
              </h2>

              <div className="book-reviews__grid">
                {bookReviews.map((review) => (
                  <blockquote key={review.id} className="book-reviews__card">
                    <p>{review.quote}</p>
                    <footer>{review.reviewerName}</footer>
                  </blockquote>
                ))}
              </div>
            </section>
          ) : (
            <section className="book-reviews" aria-labelledby="book-reviews-title">
              <p className="book-reviews__eyebrow">Reader Reviews</p>
              <h2 id="book-reviews-title" className="book-reviews__title">
                Reader reviews will appear here as more readers share their thoughts.
              </h2>
            </section>
          )}

          <RelatedBooks books={relatedBooks} />
        </Container>
      </section>

      <ReaderModal open={isReaderOpen} onClose={() => setIsReaderOpen(false)}>
        <BookReader
          sample={activeSample}
          onClose={() => setIsReaderOpen(false)}
          buyLink={
            activeEdition?.purchaseLinks?.paperback ||
            activeEdition?.purchaseLinks?.kindle ||
            activeEdition?.purchaseLinks?.amazon ||
            null
          }
        />
      </ReaderModal>
    </HelmetProvider>
  );
}

export default BookDetails;