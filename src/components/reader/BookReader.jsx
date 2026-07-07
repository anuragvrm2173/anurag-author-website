import { useEffect, useMemo, useState } from "react";

function BookReader({ sample, onClose }) {
  const [pageIndex, setPageIndex] = useState(0);

  const pages = useMemo(() => sample?.pages || [], [sample]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setPageIndex((current) => Math.min(current + 1, pages.length - 1));
      }

      if (event.key === "ArrowLeft") {
        setPageIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, pages.length]);

  if (!sample) {
    return null;
  }

  const currentPage = pages[pageIndex];

  return (
    <div className="reader-overlay" role="dialog" aria-modal="true" aria-label="Book preview reader">
      <div className="reader-shell">
        <div className="reader-toolbar">
          <button type="button" className="reader-close" onClick={onClose}>
            Close
          </button>
          <div className="reader-progress">
            Page {pageIndex + 1} of {pages.length}
          </div>
        </div>

        <article className="reader-page">
          <p className="reader-page__label">Sample Preview</p>
          <h2 className="reader-page__title">{currentPage.title}</h2>
          {currentPage.content.map((paragraph, index) => (
            <p key={`${currentPage.number}-${index}`} className="reader-page__content">
              {paragraph}
            </p>
          ))}
        </article>

        <div className="reader-navigation">
          <button
            type="button"
            className="reader-nav-button"
            onClick={() => setPageIndex((current) => Math.max(current - 1, 0))}
            disabled={pageIndex === 0}
          >
            Previous
          </button>

          <button
            type="button"
            className="reader-nav-button"
            onClick={() => setPageIndex((current) => Math.min(current + 1, pages.length - 1))}
            disabled={pageIndex === pages.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookReader;
