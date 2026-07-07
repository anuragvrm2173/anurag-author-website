function BookHero({ book, activeEdition, children }) {
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
        <p className="book-hero__status">{book.status}</p>
        <h1 className="book-hero__title">{book.title}</h1>
        <p className="book-hero__subtitle">{book.subtitle}</p>
        <p className="book-hero__description">{book.shortDescription || book.description}</p>

        <div className="book-hero__meta">
          <span>{book.publicationDate ? new Date(book.publicationDate).toLocaleDateString("en-IN") : "TBA"}</span>
          <span>{activeEdition.pages || book.pages} pages</span>
          <span>{activeEdition.publisher || book.publisher}</span>
          <span>{activeEdition.formatLabel}</span>
          <span>{activeEdition.label}</span>
          {activeEdition.isbn || book.isbn ? <span>ISBN {activeEdition.isbn || book.isbn}</span> : null}
        </div>

        {children}
      </div>
    </section>
  );
}

export default BookHero;