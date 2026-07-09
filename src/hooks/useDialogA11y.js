import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}

export default function useDialogA11y({
  open,
  dialogRef,
  onClose,
  initialFocusRef,
  restoreFocusRef,
  lockBodyScroll = true,
}) {
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const dialogElement = dialogRef.current;
    if (!dialogElement) {
      return undefined;
    }

    previousActiveElementRef.current = document.activeElement;
    const explicitRestoreTarget = restoreFocusRef?.current;
    const previousOverflow = document.body.style.overflow;
    if (lockBodyScroll) {
      document.body.style.overflow = "hidden";
    }

    const focusableElements = getFocusableElements(dialogElement);
    const initialFocusElement = initialFocusRef?.current || focusableElements[0] || dialogElement;
    initialFocusElement?.focus?.();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = getFocusableElements(dialogRef.current);
      if (elements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus?.();
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
      if (lockBodyScroll) {
        document.body.style.overflow = previousOverflow;
      }
      const fallback = previousActiveElementRef.current;
      const restoreTarget = explicitRestoreTarget || fallback;
      restoreTarget?.focus?.();
    };
  }, [dialogRef, initialFocusRef, lockBodyScroll, onClose, open, restoreFocusRef]);
}