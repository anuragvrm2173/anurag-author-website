import BookCoverArt from "./BookCoverArt";
import { FaCalendarDay, FaLanguage, FaRegStar, FaRegFileLines } from "react-icons/fa6";

function BookHero({
  book,
  activeEdition,
  children,
  onCoverPreviewOpen,
  isHindi = false,
  labels = {},
  displaySubtitle,
  displayDescription,
}) {
  const expectedLabel = activeEdition.publicationDate
    ? new Intl.DateTimeFormat(isHindi ? "hi-IN" : "en-IN", {
      month: "long",
      year: "numeric",
    }).format(new Date(activeEdition.publicationDate))
    : null;
  const availabilityLabel = book.status === "Published"
    ? (isHindi ? "उपलब्ध अब" : "Available Now")
    : expectedLabel
      ? (isHindi ? `अपेक्षित ${expectedLabel}` : `Expected ${expectedLabel}`)
      : (isHindi ? "शीघ्र" : "Coming Soon");
  const t = {
    pages: labels.pages || (isHindi ? "पृष्ठ" : "Pages"),
    isbn: labels.isbn || "ISBN",
    tba: labels.tba || (isHindi ? "शीघ्र" : "TBA"),
  };
  const isPublished = book.status === "Published";
  const publicationText = activeEdition.publicationDate
    ? new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(activeEdition.publicationDate))
    : t.tba;

  return (
    <section className="book-hero">
      <div className="book-hero__cover">
        <button
          type="button"
          className="book-hero__cover-trigger"
          onClick={onCoverPreviewOpen}
          aria-label={`Open ${book.title} ${activeEdition.label} cover preview`}
        >
          <BookCoverArt
            title={book.title}
            subtitle={activeEdition.cover?.subtitle || activeEdition.formatLabel}
            author={activeEdition.cover?.author || "Anurag Verma"}
            badge={activeEdition.cover?.eyebrow || book.status}
            cover={activeEdition.cover}
            variant="full"
            alt={`${book.title} ${activeEdition.label} cover`}
            className="book-hero__cover-art"
            imageClassName="book-hero__cover-image"
            loading="eager"
          />
        </button>
      </div>

      <div className="book-hero__content">
        <p className="book-hero__status">{availabilityLabel}</p>
        <h1 className="book-hero__title">{book.title}</h1>
        <p className="book-hero__subtitle">{displaySubtitle || book.subtitle}</p>
        <p className="book-hero__description">{displayDescription || book.shortDescription || book.description}</p>

        <div className="book-hero__meta">
          <span>
            {isPublished && activeEdition.publicationDate
              ? new Date(activeEdition.publicationDate).toLocaleDateString("en-IN")
              : t.tba}
          </span>
          {isPublished && (activeEdition.pages || book.pages) ? <span>{activeEdition.pages || book.pages} {t.pages}</span> : null}
          {isPublished && (activeEdition.publisher || book.publisher) ? <span>{activeEdition.publisher || book.publisher}</span> : null}
          <span>{activeEdition.formatLabel}</span>
          <span>{activeEdition.label}</span>
          {isPublished && (activeEdition.isbn || book.isbn) ? (
            <span>{t.isbn} {activeEdition.isbn || book.isbn}</span>
          ) : null}
        </div>

        <div className="book-hero__stats" aria-label="Book quick stats">
          {isPublished && (activeEdition.pages || book.pages) ? (
            <span><FaRegFileLines aria-hidden="true" /> {activeEdition.pages || book.pages} Pages</span>
          ) : null}
          <span><FaRegStar aria-hidden="true" /> ★★★★★</span>
          <span><FaLanguage aria-hidden="true" /> {activeEdition.label}</span>
          <span><FaCalendarDay aria-hidden="true" /> Published {publicationText}</span>
        </div>

        {children}
      </div>
    </section>
  );
}

export default BookHero;