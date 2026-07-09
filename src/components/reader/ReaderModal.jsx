import { useRef } from "react";
import useDialogA11y from "../../hooks/useDialogA11y";

function ReaderModal({ open, children, onClose }) {
  const modalRef = useRef(null);

  useDialogA11y({
    open,
    dialogRef: modalRef,
    onClose,
    lockBodyScroll: true,
  });

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
        aria-labelledby="reader-modal-title"
        aria-describedby="reader-modal-description"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="reader-modal-title" className="visually-hidden">Reader preview dialog</h2>
        <p id="reader-modal-description" className="visually-hidden">Preview the sample and use keyboard controls to navigate pages.</p>
        {children}
      </div>
    </div>
  );
}

export default ReaderModal;
