function BookHero({
  book,
  activeEdition,
  children,
  isHindi = false,
  labels = {},
  displaySubtitle,
  displayDescription,
}) {
  const publishedLabel = isHindi ? "प्रकाशित" : "Published";
  const t = {
    pages: labels.pages || (isHindi ? "पृष्ठ" : "Pages"),
    isbn: labels.isbn || "ISBN",
    tba: labels.tba || (isHindi ? "शीघ्र" : "TBA"),
  };

  return (
    <section className="book-hero">
      <div
        className="book-hero__cover"
        aria-hidden="true"
        style={activeEdition.cover?.gradient ? { background: activeEdition.cover.gradient } : undefined}
      >
        <p className="book-hero__cover-eyebrow">{activeEdition.cover?.eyebrow || book.status}</p>
        <h1 className="book-hero__cover-title">{book.title}</h1>
        <p className="book-hero__cover-subtitle">
          {activeEdition.cover?.subtitle || activeEdition.formatLabel}
        </p>
      </div>

      <div className="book-hero__content">
        <p className="book-hero__status">{book.status === "Published" ? publishedLabel : book.status}</p>
        <h1 className="book-hero__title">{book.title}</h1>
        <p className="book-hero__subtitle">{displaySubtitle || book.subtitle}</p>
        <p className="book-hero__description">{displayDescription || book.shortDescription || book.description}</p>

        <div className="book-hero__meta">
          <span>
            {activeEdition.publicationDate
              ? new Date(activeEdition.publicationDate).toLocaleDateString("en-IN")
              : t.tba}
          </span>
          <span>{activeEdition.pages || book.pages} {t.pages}</span>
          <span>{activeEdition.publisher || book.publisher}</span>
          <span>{activeEdition.formatLabel}</span>
          <span>{activeEdition.label}</span>
          {book.status === "Published" && (activeEdition.isbn || book.isbn) ? (
            <span>{t.isbn} {activeEdition.isbn || book.isbn}</span>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}

export default BookHero;