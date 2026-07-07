function BookSynopsis({
  longDescription,
  synopsis,
  themes,
  whoThisBookIsFor = [],
  favoriteQuotes = [],
  readingTime = null,
  isHindi = false,
  labels = {},
}) {
  const aboutLabel = labels.synopsis || (isHindi ? "पुस्तक परिचय" : "About the Book");
  const themesLabel = labels.themes || (isHindi ? "विषय" : "Themes");
  const whoForLabel = labels.whoThisBookIsFor || (isHindi ? "यह पुस्तक किनके लिए है" : "Who This Book Is For");
  const readingTimeLabel = labels.readingTime || (isHindi ? "अनुमानित पढ़ने का समय" : "Approx Reading Time");
  const favoriteQuotesLabel = labels.favoriteQuotes || (isHindi ? "पसंदीदा उद्धरण" : "Favorite Quotes");

  return (
    <section className="book-synopsis">
      <div className="book-synopsis__section">
        <p className="book-synopsis__eyebrow">{aboutLabel}</p>
        {longDescription ? (
          <p className="book-synopsis__paragraph book-synopsis__paragraph--lead">{longDescription}</p>
        ) : null}
        {synopsis.map((paragraph) => (
          <p key={paragraph} className="book-synopsis__paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="book-synopsis__section">
        <p className="book-synopsis__eyebrow">{themesLabel}</p>
        <ul className="book-synopsis__list">
          {themes.map((item) => (
            <li key={item} className="book-synopsis__list-item">
              {item}
            </li>
          ))}
        </ul>

        {whoThisBookIsFor.length > 0 ? (
          <>
            <p className="book-synopsis__eyebrow book-synopsis__eyebrow--nested">{whoForLabel}</p>
            <ul className="book-synopsis__list">
              {whoThisBookIsFor.map((item) => (
                <li key={item} className="book-synopsis__list-item">
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {readingTime ? (
          <>
            <p className="book-synopsis__eyebrow book-synopsis__eyebrow--nested">{readingTimeLabel}</p>
            <p className="book-synopsis__paragraph">{readingTime}</p>
          </>
        ) : null}

        {favoriteQuotes.length > 0 ? (
          <>
            <p className="book-synopsis__eyebrow book-synopsis__eyebrow--nested">{favoriteQuotesLabel}</p>
            <ul className="book-synopsis__list">
              {favoriteQuotes.map((item) => (
                <li key={item} className="book-synopsis__list-item">
                  "{item}"
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default BookSynopsis;