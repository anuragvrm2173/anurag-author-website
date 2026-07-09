import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function ReaderModal({ open, children, onClose }) {
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousActiveElementRef.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const modalElement = modalRef.current;
    const focusableElements = modalElement
      ? Array.from(modalElement.querySelectorAll(FOCUSABLE_SELECTOR))
      : [];
    const initialFocusElement = focusableElements[0] || modalElement;

    initialFocusElement?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = modalRef.current
        ? Array.from(modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR))
        : [];

      if (elements.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousActiveElementRef.current?.focus?.();
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="reader-modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="reader-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Reader preview dialog"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default ReaderModal;
