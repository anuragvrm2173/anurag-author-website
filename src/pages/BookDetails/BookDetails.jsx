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
  const isHindi = activeEdition?.languageCode === "hi";
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

  const labels = {
    bookDetails: isHindi ? "पुस्तक विवरण" : "Book Details",
    genres: isHindi ? "शैली" : "Genres",
    publicationDate: isHindi ? "प्रकाशन तिथि" : "Publication Date",
    pages: isHindi ? "पृष्ठ" : "Pages",
    publisher: isHindi ? "प्रकाशक" : "Publisher",
    isbn: "ISBN",
    formats: isHindi ? "फॉर्मेट" : "Formats",
    available: isHindi ? "उपलब्ध" : "Available",
    comingSoon: isHindi ? "शीघ्र" : "Coming Soon",
    readerReviews: isHindi ? "पाठक समीक्षाएँ" : "Reader Reviews",
    reviewsTitle: isHindi ? "पाठकों की राय" : "What readers are saying.",
    reviewsEmpty: isHindi
      ? "जैसे-जैसे पाठक अपनी राय साझा करेंगे, समीक्षाएँ यहां दिखाई देंगी।"
      : "Reader reviews will appear here as more readers share their thoughts.",
  };

  const hindiContent = {
    "the-last-goodbye": {
      subtitle: "प्रेम, वियोग और यादों की कहानी",
      shortDescription: "कुछ अलविदा कहे जाते हैं, कुछ बिना कहे रह जाते हैं, और कुछ जीवन भर साथ चलते हैं।",
      longDescription:
        "यह एक आत्मकथात्मक यात्रा है जिसमें प्रेम, परिवार, दोस्ती, टूटन और जिम्मेदारियों के बीच स्वयं को पहचानने की कहानी सामने आती है।",
      synopsis: [
        "यह पुस्तक बचपन की स्मृतियों से शुरू होकर रिश्तों, बिछड़न और अधूरी बातों के दर्द तक पहुंचती है।",
        "यह केवल प्रेम कहानी नहीं, बल्कि जीवन की कठिन घड़ियों में साहस और अर्थ खोजने की कहानी है।",
      ],
    },
    "the-untold-stories": {
      subtitle: "अध्यायों के बीच छिपी कहानियाँ",
      shortDescription: "हर कहानी के पीछे कुछ ऐसे पल होते हैं जो अंतिम पांडुलिपि तक नहीं पहुंचते।",
      longDescription:
        "यह सहचर पुस्तक पहली किताब के पीछे छूटे अनुभवों, भावनाओं और स्मृतियों को नए दृष्टिकोण से सामने लाती है।",
      synopsis: [
        "यह मूल कथा को दोहराती नहीं, बल्कि उसके बीच छिपे प्रसंगों को विस्तार देती है।",
        "यह पाठकों को उन अनकहे हिस्सों तक ले जाती है जिन्होंने पूरी यात्रा को आकार दिया।",
      ],
    },
    "lessons-of-the-heart": {
      subtitle: "प्रेम, वियोग और जीवन से मिले गहरे सबक",
      shortDescription:
        "जीवन के सबसे महत्वपूर्ण सबक अक्सर सफलता से नहीं, बल्कि प्रेम, वियोग और अनुभवों से मिलते हैं।",
      longDescription:
        "यह पुस्तक स्मृतियों को जीवन-सीख में बदलते हुए उपचार, क्षमा, उद्देश्य और आशा की दिशा देती है।",
      synopsis: [
        "यह रचना बीते अनुभवों को रोजमर्रा के जीवन के लिए उपयोगी समझ में बदलती है।",
        "हर विदाई, हर भूल और हर नई शुरुआत में छिपे अर्थ को यह पुस्तक संवेदनशीलता से सामने लाती है।",
      ],
    },
  };

  const genreMapHi = {
    "Autobiographical Novel": "आत्मकथात्मक उपन्यास",
    "Literary Fiction": "साहित्यिक कथा",
    "Coming-of-Age": "यौवन-विकास कथा",
    Memoir: "संस्मरण",
    "Companion Memoir": "सहचर संस्मरण",
    "Personal Reflections": "व्यक्तिगत चिंतन",
    "Literary Nonfiction": "साहित्यिक गद्य",
    "Inspirational Nonfiction": "प्रेरक गद्य",
    "Personal Growth": "व्यक्तिगत विकास",
    Philosophy: "दर्शन",
    "Self-Reflection": "आत्मचिंतन",
  };

  const themeMapHi = {
    Love: "प्रेम",
    Loss: "वियोग",
    Family: "परिवार",
    Friendship: "मित्रता",
    Grief: "शोक",
    Hope: "आशा",
    Resilience: "धैर्य",
    "Self-discovery": "स्व-खोज",
    Reflection: "चिंतन",
    Memory: "स्मृति",
    Relationships: "रिश्ते",
    "Behind the Story": "कहानी के पीछे",
    Healing: "उपचार",
    Wisdom: "बुद्धिमत्ता",
    Purpose: "उद्देश्य",
    Forgiveness: "क्षमा",
    "Life Lessons": "जीवन के सबक",
  };

  const localized = isHindi ? hindiContent[book.id] : null;
  const displaySubtitle = localized?.subtitle || book.subtitle;
  const displayDescription = localized?.shortDescription || book.shortDescription || book.description;
  const displayLongDescription = localized?.longDescription || book.longDescription;
  const displaySynopsis = localized?.synopsis || book.synopsis;
  const displayGenres = isHindi ? book.genres.map((item) => genreMapHi[item] || item) : book.genres;
  const displayThemes = isHindi ? book.themes.map((item) => themeMapHi[item] || item) : book.themes;

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

          <BookHero
            book={book}
            activeEdition={activeEdition}
            isHindi={isHindi}
            labels={labels}
            displaySubtitle={displaySubtitle}
            displayDescription={displayDescription}
          >
            <EditionSelector
              editions={editionEntries}
              selectedEditionKey={selectedEditionKey}
              onChange={setSelectedEditionKey}
              isHindi={isHindi}
            />

            <PurchasePanel
              bookStatus={book.status}
              activeEdition={activeEdition}
              onPreviewOpen={() => setIsReaderOpen(true)}
              isHindi={isHindi}
            />
          </BookHero>

          <BookSynopsis
            longDescription={displayLongDescription}
            synopsis={displaySynopsis}
            themes={displayThemes}
            isHindi={isHindi}
          />

          <section className="book-synopsis" aria-label="Book metadata">
            <div className="book-synopsis__section">
              <p className="book-synopsis__eyebrow">{labels.bookDetails}</p>
              <ul className="book-synopsis__list">
                <li className="book-synopsis__list-item">{labels.genres}: {displayGenres.join(", ")}</li>
                <li className="book-synopsis__list-item">
                  {labels.publicationDate}: {new Date(activeEdition.publicationDate || book.publicationDate).toLocaleDateString("en-IN")}
                </li>
                <li className="book-synopsis__list-item">{labels.pages}: {activeEdition.pages || book.pages}</li>
                <li className="book-synopsis__list-item">{labels.publisher}: {activeEdition.publisher || book.publisher}</li>
                {book.status === "Published" && (activeEdition.isbn || book.isbn) ? (
                  <li className="book-synopsis__list-item">{labels.isbn}: {activeEdition.isbn || book.isbn}</li>
                ) : null}
              </ul>
            </div>

            <div className="book-synopsis__section">
              <p className="book-synopsis__eyebrow">{labels.formats}</p>
              <ul className="book-synopsis__list">
                {Object.entries(activeEdition.formats || {}).map(([format, available]) => (
                  <li key={format} className="book-synopsis__list-item">
                    {format.toUpperCase()}: {available ? labels.available : labels.comingSoon}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {bookReviews.length > 0 ? (
            <section className="book-reviews" aria-labelledby="book-reviews-title">
              <p className="book-reviews__eyebrow">{labels.readerReviews}</p>
              <h2 id="book-reviews-title" className="book-reviews__title">
                {labels.reviewsTitle}
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
              <p className="book-reviews__eyebrow">{labels.readerReviews}</p>
              <h2 id="book-reviews-title" className="book-reviews__title">
                {labels.reviewsEmpty}
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