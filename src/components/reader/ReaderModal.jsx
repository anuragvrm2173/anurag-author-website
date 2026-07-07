import { useEffect } from "react";

function ReaderModal({ open, children, onClose }) {
  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="reader-modal-backdrop" onClick={onClose}>
      <div className="reader-modal" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default ReaderModal;
