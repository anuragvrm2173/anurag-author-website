import { useState } from "react";

import "./BookCard.css";
import BookReader from "../../reader/BookReader";
import ReaderModal from "../../reader/ReaderModal";
import { sampleMap } from "../../../data/samples";

function BookCard({ title, description, badge, editions, sampleId }) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const editionEntries = Object.entries(editions || {});
  const sample = sampleId ? sampleMap[sampleId] : null;

  return (
    <>
      <article className="book-card" aria-label={`${title} book card`}>
      <div className="book-card__spine" aria-hidden="true" />
      <div className="book-card__badge">{badge}</div>

      <div className="book-card__content">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__description">{description}</p>

        <div className="book-card__editions" aria-label="Available editions">
          <span className="book-card__editions-label">Available in</span>
          <div className="book-card__edition-list">
            {editionEntries.map(([key, edition]) => (
              <span key={key} className="book-card__edition">
                {edition.label}
              </span>
            ))}
          </div>
        </div>
      </div>

        <div className="book-card__footer">
          <button
            type="button"
            className="book-card__button"
            onClick={() => setIsReaderOpen(Boolean(sample))}
          >
            {sample ? "Preview Sample" : "View Book"}
          </button>
        </div>
      </article>

      <ReaderModal open={isReaderOpen} onClose={() => setIsReaderOpen(false)}>
        <BookReader sample={sample} onClose={() => setIsReaderOpen(false)} />
      </ReaderModal>
    </>
  );
}

export default BookCard;
