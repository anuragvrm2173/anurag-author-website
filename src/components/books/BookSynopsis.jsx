function BookSynopsis({ longDescription, synopsis, themes, whoThisBookIsFor = [], isHindi = false }) {
  const aboutLabel = isHindi ? "पुस्तक परिचय" : "About the Book";
  const themesLabel = isHindi ? "विषय" : "Themes";
  const whoForLabel = isHindi ? "यह पुस्तक किनके लिए है" : "Who This Book Is For";

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
      </div>
    </section>
  );
}

export default BookSynopsis;