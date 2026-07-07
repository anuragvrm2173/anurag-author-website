function BookSynopsis({ synopsis, discoveries }) {
  return (
    <section className="book-synopsis">
      <div className="book-synopsis__section">
        <p className="book-synopsis__eyebrow">About the Book</p>
        {synopsis.map((paragraph) => (
          <p key={paragraph} className="book-synopsis__paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="book-synopsis__section">
        <p className="book-synopsis__eyebrow">What Readers Will Discover</p>
        <ul className="book-synopsis__list">
          {discoveries.map((item) => (
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