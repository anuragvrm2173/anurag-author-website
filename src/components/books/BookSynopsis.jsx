function BookSynopsis({ longDescription, synopsis, themes }) {
  return (
    <section className="book-synopsis">
      <div className="book-synopsis__section">
        <p className="book-synopsis__eyebrow">About the Book</p>
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
        <p className="book-synopsis__eyebrow">Themes</p>
        <ul className="book-synopsis__list">
          {themes.map((item) => (
            <li key={item} className="book-synopsis__list-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BookSynopsis;