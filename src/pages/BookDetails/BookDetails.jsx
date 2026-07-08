import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaFacebookF, FaLink, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

import BlogGrid from "../../components/blog/BlogGrid/BlogGrid";
import BookHero from "../../components/books/BookHero";
import BookSynopsis from "../../components/books/BookSynopsis";
import EditionSelector from "../../components/books/EditionSelector";
import PurchasePanel from "../../components/books/PurchasePanel";
import RelatedBooks from "../../components/books/RelatedBooks";
import ReviewForm from "../../components/forms/ReviewForm/ReviewForm";
import BookReader from "../../components/reader/BookReader";
import ReaderModal from "../../components/reader/ReaderModal";
import Container from "../../components/ui/Container/Container";
import useSiteSettings from "../../hooks/useSiteSettings";
import { sampleMap } from "../../data/samples";
import { getReviewsByBookId } from "../../data/reviews";
import usePublicContent from "../../hooks/usePublicContent";
import { getBlogPostsByBookIdFromList, getBookByIdFromList, getFallbackBooks, getRelatedBooksFromList } from "../../services/publicContentService";
import useApprovedReviews from "../../hooks/useApprovedReviews";

import "./BookDetails.css";

const RETAILER_PRIORITY = ["pothi", "amazon", "notionPress", "flipkart", "kindle"];

function getPrimaryBuyLink(edition) {
  const retailers = Object.entries(edition?.retailers || {})
    .map(([key, value]) => ({
      key,
      available: value?.available !== false,
      url: value?.url || value?.href || null,
    }))
    .filter((item) => item.available && item.url)
    .sort((left, right) => {
      const leftIndex = RETAILER_PRIORITY.indexOf(left.key);
      const rightIndex = RETAILER_PRIORITY.indexOf(right.key);
      const leftRank = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
      const rightRank = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
      return leftRank - rightRank;
    });

  if (retailers[0]?.url) {
    return retailers[0].url;
  }

  return edition?.purchaseLinks?.paperback
    || edition?.purchaseLinks?.kindle
    || edition?.purchaseLinks?.amazon
    || null;
}

function BookDetails() {
  const { bookId } = useParams();
  const location = useLocation();
  const [selectedEditionKey, setSelectedEditionKey] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isCoverZoomed, setIsCoverZoomed] = useState(false);
  const closeButtonRef = useRef(null);
  const { reviews, refresh } = useApprovedReviews();
  const { books, blogPosts, loading } = usePublicContent({ includeBooks: true, includeBlogPosts: true });
  const { siteConfig } = useSiteSettings();

  const book = getBookByIdFromList(books, bookId);
  const fallbackBooks = getFallbackBooks();
  const relatedBooks = book ? getRelatedBooksFromList(books, book.id) : fallbackBooks.slice(0, 2);
  const relatedBlogPosts = book ? getBlogPostsByBookIdFromList(blogPosts, books, book.id) : [];
  const editionEntries = useMemo(() => Object.entries(book?.editions || {}), [book]);
  const requestedEditionKey = useMemo(() => {
    const requested = new URLSearchParams(location.search).get("edition");
    if (!requested) {
      return null;
    }

    const normalized = requested.trim().toLowerCase();
    const match = editionEntries.find(([key, edition]) => {
      const byKey = key.toLowerCase() === normalized;
      const byLanguageCode = edition?.languageCode?.toLowerCase() === normalized;
      return byKey || byLanguageCode;
    });

    return match?.[0] || null;
  }, [location.search, editionEntries]);

  const defaultEditionKey = useMemo(
    () => requestedEditionKey || editionEntries.find(([, edition]) => edition.available)?.[0] || editionEntries[0]?.[0] || null,
    [requestedEditionKey, editionEntries]
  );

  useEffect(() => {
    if (!isCoverOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCoverOpen(false);
        setIsCoverZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCoverOpen]);

  if (!book && loading) {
    return (
      <HelmetProvider>
        <Helmet>
          <title>Loading Book | Anurag Verma</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <section className="book-details book-details--not-found">
          <Container>
            <div className="book-details__missing">
              <h1>Loading book…</h1>
            </div>
          </Container>
        </section>
      </HelmetProvider>
    );
  }

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

  const effectiveEditionKey = (selectedEditionKey && book.editions[selectedEditionKey])
    ? selectedEditionKey
    : defaultEditionKey;
  const activeEdition = book.editions[effectiveEditionKey] || editionEntries[0]?.[1];
  const isHindi = activeEdition?.languageCode === "hi";
  const isPublished = book.status === "Published";
  const activeSample = activeEdition?.sampleId ? sampleMap[activeEdition.sampleId] : null;
  const bookReviews = getReviewsByBookId(book.id, reviews);
  const metaTitle = book.seo?.title || `${book.title} | Anurag Verma`;
  const metaDescription = book.seo?.description || book.shortDescription || book.description;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: metaDescription,
    author: {
      "@type": "Person",
      name: "Anurag Verma",
    },
    inLanguage: activeEdition?.languageCode,
    bookFormat: activeEdition?.formatLabel,
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Library",
        item: `${siteConfig.url}/library`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: book.title,
        item: `${siteConfig.url}/library/${book.id}`,
      },
    ],
  };

  if (isPublished) {
    if (activeEdition?.isbn || book.isbn) {
      structuredData.isbn = activeEdition?.isbn || book.isbn;
    }
    if (activeEdition?.publicationDate || book.publicationDate) {
      structuredData.datePublished = activeEdition?.publicationDate || book.publicationDate;
    }
    if (activeEdition?.pages || book.pages) {
      structuredData.numberOfPages = activeEdition?.pages || book.pages;
    }
    if (activeEdition?.publisher || book.publisher) {
      structuredData.publisher = {
        "@type": "Organization",
        name: activeEdition?.publisher || book.publisher,
      };
    }
  }

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
      : "Reader reviews will appear here after publication.",
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
  const displayWhoFor = book.whoThisBookIsFor || [];
  const displayReadingTime = activeEdition?.readingTime || book.readingTime || "6-7 hours";
  const displayFavoriteQuotes = activeEdition?.favoriteQuotes || book.favoriteQuotes || [];
  const displayGenres = isHindi ? book.genres.map((item) => genreMapHi[item] || item) : book.genres;
  const displayThemes = isHindi ? book.themes.map((item) => themeMapHi[item] || item) : book.themes;
  const bookEmphasis = {
    "the-last-goodbye": {
      synopsisLabel: isHindi ? "कथा-सार" : "Synopsis",
      themesLabel: isHindi ? "मुख्य थीम" : "Themes",
      quotesLabel: isHindi ? "पसंदीदा उद्धरण" : "Favorite Quotes",
      whoForLabel: isHindi ? "यह पुस्तक किनके लिए है" : "Who This Book Is For",
      readingLabel: isHindi ? "पढ़ने का समय" : "Reading Time",
    },
    "the-untold-stories": {
      synopsisLabel: isHindi ? "किताब के पीछे" : "Behind the Book",
      themesLabel: isHindi ? "अनकही कहानियाँ" : "Untold Stories",
      quotesLabel: isHindi ? "चिंतन" : "Reflections",
      whoForLabel: isHindi ? "यह पुस्तक किनके लिए है" : "Who This Book Is For",
      readingLabel: isHindi ? "पढ़ने का समय" : "Reading Time",
    },
    "lessons-of-the-heart": {
      synopsisLabel: isHindi ? "जीवन के सबक" : "Life Lessons",
      themesLabel: isHindi ? "मुख्य सीख" : "Key Takeaways",
      quotesLabel: isHindi ? "पसंदीदा चिंतन" : "Favorite Reflections",
      whoForLabel: isHindi ? "यह पुस्तक किनके लिए है" : "Who This Book Is For",
      readingLabel: isHindi ? "पढ़ने का समय" : "Reading Time",
    },
  };
  const emphasis = bookEmphasis[book.id] || {
    synopsisLabel: isHindi ? "कथा-सार" : "Synopsis",
    themesLabel: isHindi ? "मुख्य थीम" : "Themes",
    quotesLabel: isHindi ? "पसंदीदा उद्धरण" : "Favorite Quotes",
    whoForLabel: isHindi ? "यह पुस्तक किनके लिए है" : "Who This Book Is For",
    readingLabel: isHindi ? "पढ़ने का समय" : "Reading Time",
  };
  const reorderedSynopsis = (() => {
    if (book.id === "the-untold-stories") {
      return [displaySynopsis[1], displaySynopsis[0]].filter(Boolean);
    }
    if (book.id === "lessons-of-the-heart") {
      return [...displaySynopsis].reverse();
    }
    return displaySynopsis;
  })();
  const reorderedThemes = (() => {
    if (book.id === "the-untold-stories") {
      return [...displayThemes].filter((theme) =>
        ["Behind the Story", "Reflection", "Memory", "Relationships", "Healing", "कहानी के पीछे", "चिंतन", "स्मृति", "रिश्ते", "उपचार"].includes(theme)
      );
    }
    if (book.id === "lessons-of-the-heart") {
      return [...displayThemes].filter((theme) =>
        ["Life Lessons", "Wisdom", "Purpose", "Forgiveness", "Healing", "जीवन के सबक", "बुद्धिमत्ता", "उद्देश्य", "क्षमा", "उपचार"].includes(theme)
      );
    }
    return displayThemes;
  })();
  const reorderedQuotes = (() => {
    if (book.id === "the-untold-stories") {
      return [...displayFavoriteQuotes].reverse();
    }
    return displayFavoriteQuotes;
  })();
  const toBeAnnouncedLabel = isHindi ? "घोषित किया जाना है" : "To Be Announced";
  const pageUrl = `${siteConfig.url}/library/${book.id}${effectiveEditionKey ? `?edition=${effectiveEditionKey}` : ""}`;
  const shareText = `${book.title} by Anurag Verma`;

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
        <meta property="og:image" content={activeEdition?.cover?.fullCover || activeEdition?.cover?.frontCover || `${siteConfig.url}/og/book.svg`} />
        <link rel="canonical" href={`${siteConfig.url}/library/${book.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={activeEdition?.cover?.fullCover || activeEdition?.cover?.frontCover || `${siteConfig.url}/og/book.svg`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbStructuredData)}</script>
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
            onCoverPreviewOpen={() => setIsCoverOpen(true)}
            isHindi={isHindi}
            labels={labels}
            displaySubtitle={displaySubtitle}
            displayDescription={displayDescription}
          >
            <EditionSelector
              editions={editionEntries}
              selectedEditionKey={effectiveEditionKey}
              onChange={setSelectedEditionKey}
              isHindi={isHindi}
            />

            <PurchasePanel
              bookStatus={book.status}
              book={book}
              activeEdition={activeEdition}
              onPreviewOpen={() => setIsReaderOpen(true)}
              isHindi={isHindi}
            />

            <div className="book-details__share" aria-label="Share this book">
              <p className="book-details__share-label">Share this Book</p>
              <a
                className="book-details__share-link"
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on WhatsApp"
              >
                <span aria-hidden="true">○</span>
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
              <a
                className="book-details__share-link"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on X"
              >
                <span aria-hidden="true">○</span>
                <FaXTwitter />
                <span>X</span>
              </a>
              <a
                className="book-details__share-link"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on Facebook"
              >
                <span aria-hidden="true">○</span>
                <FaFacebookF />
                <span>Facebook</span>
              </a>
              <button
                type="button"
                className="book-details__share-link"
                aria-label="Copy link"
                onClick={async () => {
                  if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(pageUrl);
                  }
                }}
              >
                <span aria-hidden="true">○</span>
                <FaLink />
                <span>Copy Link</span>
              </button>
            </div>
          </BookHero>

          <BookSynopsis
            longDescription={displayLongDescription}
            synopsis={reorderedSynopsis}
            themes={reorderedThemes.length > 0 ? reorderedThemes : displayThemes}
            whoThisBookIsFor={displayWhoFor}
            readingTime={displayReadingTime}
            favoriteQuotes={reorderedQuotes}
            isHindi={isHindi}
            labels={{
              synopsis: emphasis.synopsisLabel,
              themes: emphasis.themesLabel,
              whoThisBookIsFor: emphasis.whoForLabel,
              readingTime: emphasis.readingLabel,
              favoriteQuotes: emphasis.quotesLabel,
            }}
          />

          <section className="book-synopsis" aria-label="Book metadata">
            <div className="book-synopsis__section">
              <p className="book-synopsis__eyebrow">{labels.bookDetails}</p>
              <ul className="book-synopsis__list">
                {isPublished ? (
                  <>
                    <li className="book-synopsis__list-item">{labels.genres}: {displayGenres.join(", ")}</li>
                    <li className="book-synopsis__list-item">
                      {labels.publicationDate}: {new Date(activeEdition.publicationDate || book.publicationDate).toLocaleDateString("en-IN")}
                    </li>
                    <li className="book-synopsis__list-item">{labels.pages}: {activeEdition.pages || book.pages}</li>
                    <li className="book-synopsis__list-item">{labels.publisher}: {activeEdition.publisher || book.publisher}</li>
                    {(activeEdition.isbn || book.isbn) ? (
                      <li className="book-synopsis__list-item">{labels.isbn}: {activeEdition.isbn || book.isbn}</li>
                    ) : null}
                  </>
                ) : (
                  <>
                    <li className="book-synopsis__list-item">Publication: {toBeAnnouncedLabel}</li>
                  </>
                )}
              </ul>
            </div>

            {isPublished ? (
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
            ) : null}
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

              <Link to="/contact" className="book-reviews__cta">
                {isHindi ? "अपनी समीक्षा साझा करें" : "Share Your Review"}
              </Link>

              <ReviewForm books={books} defaultBookId={book.id} source="book-page" onSubmitted={refresh} />
            </section>
          ) : (
            <section className="book-reviews" aria-labelledby="book-reviews-title">
              <p className="book-reviews__eyebrow">{labels.readerReviews}</p>
              <h2 id="book-reviews-title" className="book-reviews__title">
                {labels.reviewsEmpty}
              </h2>
              <p className="book-reviews__empty-copy">Be the first to share your thoughts.</p>

              <Link to="/contact" className="book-reviews__cta">
                {isHindi ? "पहली समीक्षा लिखें" : "Write the First Review"}
              </Link>

              <ReviewForm books={books} defaultBookId={book.id} source="book-page" onSubmitted={refresh} />
            </section>
          )}

          {relatedBlogPosts.length > 0 ? (
        <section className="book-related-blogs" aria-labelledby="book-related-blogs-title">
          <div className="book-related-blogs__header">
            <p className="book-related-blogs__eyebrow">From the Blog</p>
            <h2 id="book-related-blogs-title" className="book-related-blogs__title">
              Stories connected to {book.title}
            </h2>
          </div>
          <BlogGrid posts={relatedBlogPosts} compact={relatedBlogPosts.length === 1} />
        </section>
      ) : null}

          <RelatedBooks books={relatedBooks} />

          <p className="book-details__copyright-note">
            Copyright © 2026 Anurag Verma.
            <br />
            All Rights Reserved.
          </p>
        </Container>
      </section>

      {isCoverOpen ? (
        <div
          className="book-cover-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Book cover preview"
          onClick={() => {
            setIsCoverOpen(false);
            setIsCoverZoomed(false);
          }}
        >
          <div className="book-cover-modal__inner" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="book-cover-modal__close"
              ref={closeButtonRef}
              onClick={() => {
                setIsCoverOpen(false);
                setIsCoverZoomed(false);
              }}
              aria-label="Close cover preview"
            >
              Close
            </button>
            <img
              src={activeEdition?.cover?.fullCover || activeEdition?.cover?.frontCover || ""}
              alt={`${book.title} ${activeEdition.label} cover preview`}
              className={`book-cover-modal__image ${isCoverZoomed ? "book-cover-modal__image--zoomed" : ""}`.trim()}
              width="1600"
              height="1153"
              onClick={() => setIsCoverZoomed((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label={isCoverZoomed ? "Zoom out cover image" : "Zoom in cover image"}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsCoverZoomed((prev) => !prev);
                }
              }}
            />
          </div>
        </div>
      ) : null}

      <ReaderModal open={isReaderOpen} onClose={() => setIsReaderOpen(false)}>
        <BookReader
          key={activeEdition?.sampleId || `${book.id}-${effectiveEditionKey || "default"}`}
          sample={activeSample}
          onClose={() => setIsReaderOpen(false)}
          buyLink={getPrimaryBuyLink(activeEdition)}
        />
      </ReaderModal>
    </HelmetProvider>
  );
}

export default BookDetails;