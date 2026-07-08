import { useEffect, useMemo, useState } from "react";

import { notifyBuyLinkClick } from "../../services/notificationsService";

const READER_OPEN_DELAY = 400;

function renderRichText(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderPageBlock(block, index) {
  switch (block.type) {
    case "eyebrow":
      return (
        <p key={`${block.type}-${index}`} className="reader-page__eyebrow">
          {renderRichText(block.text)}
        </p>
      );
    case "heading":
      return (
        <h3 key={`${block.type}-${index}`} className="reader-page__heading">
          {renderRichText(block.text)}
        </h3>
      );
    case "subheading":
      return (
        <p key={`${block.type}-${index}`} className="reader-page__subheading">
          {renderRichText(block.text)}
        </p>
      );
    case "divider":
      return <div key={`${block.type}-${index}`} className="reader-page__divider" aria-hidden="true" />;
    default:
      return (
        <p key={`${block.type || "paragraph"}-${index}`} className="reader-page__content">
          {renderRichText(block.text)}
        </p>
      );
  }
}

function BookReader({ sample, onClose, buyLink }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isOpening, setIsOpening] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);

  const pages = useMemo(() => sample?.pages || [], [sample]);

  useEffect(() => {
    if (!sample) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsOpening(false);
    }, READER_OPEN_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [sample]);

  useEffect(() => {
    if (!sample || isOpening) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setPageIndex((current) => Math.min(current + 1, pages.length - 1));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPageIndex((current) => Math.max(current - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpening, pages.length, sample]);

  if (!sample) {
    return null;
  }

  const isHindi = sample.language === "hi";
  const ui = {
    close: isHindi ? "बंद करें" : "Close",
    preview: isHindi ? "नमूना पूर्वावलोकन" : "Sample Preview",
    page: isHindi ? "पृष्ठ" : "Page",
    of: isHindi ? "में से" : "of",
    previous: isHindi ? "पिछला" : "Previous",
    next: isHindi ? "अगला" : "Next",
    buy: isHindi ? "आगे पढ़ने के लिए पुस्तक खरीदें" : "Continue Reading: Buy the Book",
  };

  const currentPage = pages[pageIndex];
  const isLastPage = pageIndex === pages.length - 1;
  const pageBlocks = currentPage?.blocks || currentPage?.content?.map((text) => ({ type: "paragraph", text })) || [];

  const handleTouchStart = (event) => {
    setTouchStartX(event.changedTouches[0]?.clientX || null);
  };

  const handleTouchEnd = (event) => {
    const endX = event.changedTouches[0]?.clientX;
    if (touchStartX === null || typeof endX !== "number") {
      return;
    }

    const deltaX = touchStartX - endX;
    if (deltaX > 40) {
      setPageIndex((current) => Math.min(current + 1, pages.length - 1));
    }
    if (deltaX < -40) {
      setPageIndex((current) => Math.max(current - 1, 0));
    }
    setTouchStartX(null);
  };

  return (
    <div className="reader-overlay" role="dialog" aria-modal="true" aria-label="Book preview reader">
      <div className="reader-shell">
        <div className="reader-toolbar">
          <button type="button" className="reader-close" onClick={onClose}>
            {ui.close}
          </button>
          <div className="reader-progress">
            {isOpening
              ? sample.previewLabel || ui.preview
              : `${ui.page} ${pageIndex + 1} ${ui.of} ${pages.length}`}
          </div>
        </div>

        {isOpening ? (
          <div className="reader-cover" aria-live="polite">
            <p className="reader-cover__eyebrow">{sample.cover?.eyebrow || "Preview Edition"}</p>
            <h2 className="reader-cover__title">{sample.cover?.title || sample.title}</h2>
            <p className="reader-cover__subtitle">
              {sample.cover?.subtitle || sample.previewLabel || ui.preview}
            </p>
          </div>
        ) : (
          <article
            key={currentPage.number}
            className={`reader-page reader-page--enter ${isLastPage ? "reader-page--final" : ""}`.trim()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <p className="reader-page__label">{sample.previewLabel || "Sample Preview"}</p>
            <h2 className="reader-page__title">{currentPage.title}</h2>
            <div className="reader-page__body">
              {pageBlocks.map((block, index) => renderPageBlock(block, index))}
            </div>
            {isLastPage && buyLink ? (
              <a
                href={buyLink}
                target="_blank"
                rel="noreferrer"
                className="reader-buy-cta"
                onClick={() => {
                  notifyBuyLinkClick({
                    bookTitle: sample?.title,
                    editionLabel: sample?.language || sample?.previewLabel,
                    retailer: "Primary Buy Link",
                    url: buyLink,
                    source: "reader-cta",
                  });
                }}
              >
                {ui.buy}
              </a>
            ) : null}
          </article>
        )}

        <div className="reader-navigation">
          <button
            type="button"
            className="reader-nav-button"
            onClick={() => setPageIndex((current) => Math.max(current - 1, 0))}
            disabled={isOpening || pageIndex === 0}
          >
            {ui.previous}
          </button>

          <button
            type="button"
            className="reader-nav-button"
            onClick={() => setPageIndex((current) => Math.min(current + 1, pages.length - 1))}
            disabled={isOpening || pageIndex === pages.length - 1}
          >
            {ui.next}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookReader;
