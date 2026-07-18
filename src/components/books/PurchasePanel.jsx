import { useRef, useState } from "react";

import CaptchaChallenge from "../common/CaptchaChallenge/CaptchaChallenge";
import { isCaptchaEnabled } from "../../services/captchaService";
import { submitBuyNowLead } from "../../services/contactService";
import { notifyBuyLinkClick } from "../../services/notificationsService";
import useDialogA11y from "../../hooks/useDialogA11y";
import { sanitizeExternalUrl } from "../../utils/urlSafety";

const STORE_LOGOS = {
  amazon: "/store-logos/amazon.svg",
  notionpress: "/store-logos/notion-press.svg",
  pothi: "/store-logos/pothi.svg",
  flipkart: "/store-logos/flipkart.svg",
};

const FORMAT_KEYS = new Set(["paperback", "kindle", "ebook", "hardcover", "audiobook"]);
const FORMAT_PRIORITY = ["paperback", "hardcover", "kindle", "ebook", "audiobook"];
const RETAILER_PRIORITY = ["pothi", "amazon", "notionpress", "flipkart", "kindle"];

function normalizeRetailerKey(value = "") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  if (normalized === "notionpress") {
    return "notionpress";
  }

  return normalized;
}

function toTitleCase(value = "") {
  if (!value) {
    return "";
  }

  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getPrimaryFormat(formats = {}) {
  const availableEntries = Object.entries(formats).filter(([, isAvailable]) => Boolean(isAvailable));
  if (availableEntries.length === 0) {
    return null;
  }

  const byPriority = FORMAT_PRIORITY.find((key) => formats[key]);
  if (byPriority) {
    return byPriority;
  }

  return availableEntries[0][0];
}

function normalizeRetailers(activeEdition) {
  const fromStructured = Object.entries(activeEdition.retailers || {}).map(([key, value]) => {
    const retailerKey = normalizeRetailerKey(key);

    if (typeof value === "string") {
      const safeUrl = sanitizeExternalUrl(value);
      return {
        key: retailerKey,
        name: toTitleCase(key),
        available: Boolean(safeUrl),
        url: safeUrl,
        actionLabel: `Buy from ${toTitleCase(key)}`,
        statusLabel: null,
      };
    }

    const safeUrl = sanitizeExternalUrl(value?.url || value?.href || null);
    const displayName = value?.name || toTitleCase(key);

    return {
      key: retailerKey,
      name: displayName,
      available: value?.available !== false && Boolean(safeUrl),
      url: safeUrl,
      actionLabel: value?.actionLabel || value?.label || `Buy from ${displayName}`,
      statusLabel: value?.statusLabel || value?.label || "Coming Soon",
    };
  });

  const fromLinks = Object.entries(activeEdition.purchaseLinks || {})
    .filter(([key, value]) => !FORMAT_KEYS.has(String(key || "").toLowerCase()) && Boolean(value))
    .map(([key, value]) => {
      const safeUrl = sanitizeExternalUrl(value);
      const retailerKey = normalizeRetailerKey(key);

      return {
        key: retailerKey,
        name: toTitleCase(key),
        available: Boolean(safeUrl),
        url: safeUrl,
        actionLabel: `Buy from ${toTitleCase(key)}`,
        statusLabel: null,
      };
    });

  // Merge both sources so one incomplete structure doesn't hide valid links.
  const structuredByKey = new Map(fromStructured.filter((item) => item.key).map((item) => [item.key, item]));

  fromLinks.forEach((item) => {
    if (!item.key) {
      return;
    }

    const existing = structuredByKey.get(item.key);
    if (!existing) {
      structuredByKey.set(item.key, item);
      return;
    }

    if ((!existing.url || existing.available === false) && item.url) {
      structuredByKey.set(item.key, {
        ...existing,
        available: true,
        url: item.url,
        statusLabel: null,
      });
    }
  });

  const merged = Array.from(structuredByKey.values());
  const hasDirectPurchaseLinks = fromLinks.some((item) => item.url);

  // If admin has explicitly configured purchase links, use only those keys.
  if (hasDirectPurchaseLinks) {
    const allowedKeys = new Set(fromLinks.map((item) => item.key).filter(Boolean));
    return merged.filter((item) => allowedKeys.has(item.key));
  }

  return merged;
}

function formatCurrencyPrice(pricing) {
  if (!pricing || typeof pricing.amount !== "number") {
    return null;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: pricing.currency || "INR",
    maximumFractionDigits: 0,
  }).format(pricing.amount);
}

function RetailerMark({ retailerKey }) {
  const logo = STORE_LOGOS[retailerKey];
  if (logo) {
    return <img src={logo} alt="" aria-hidden="true" className="purchase-panel__retailer-logo" loading="lazy" width="120" height="32" />;
  }

  return (
    <span className="purchase-panel__retailer-mark" aria-hidden="true">
      {toTitleCase(retailerKey)}
    </span>
  );
}

function PurchasePanel({ bookStatus, book, activeEdition, onPreviewOpen, isHindi = false }) {
  const leadModalRef = useRef(null);
  const leadNameInputRef = useRef(null);
  const leadTriggerRef = useRef(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [readerName, setReaderName] = useState("");
  const [readerEmail, setReaderEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaResetCounter, setCaptchaResetCounter] = useState(0);
  const [leadError, setLeadError] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const isPublished = bookStatus === "Published";
  const retailers = normalizeRetailers(activeEdition);
  const displayRetailers = retailers
    .filter((item) => item.available && item.url)
    .sort((left, right) => {
      const leftIndex = RETAILER_PRIORITY.indexOf(left.key);
      const rightIndex = RETAILER_PRIORITY.indexOf(right.key);
      const leftRank = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
      const rightRank = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return String(left.name || "").localeCompare(String(right.name || ""));
    });
  const hasBuyLinks = displayRetailers.length > 0;
  const showAvailableMode = isPublished || hasBuyLinks;
  const hasSample = Boolean(activeEdition.sampleId);
  const primaryFormatKey = getPrimaryFormat(activeEdition.formats || {});
  const displayFormat = primaryFormatKey ? toTitleCase(primaryFormatKey) : (activeEdition.formatLabel || (isHindi ? "संस्करण" : "Edition"));
  const directPricing = activeEdition.pricing && typeof activeEdition.pricing.amount === "number" ? activeEdition.pricing : null;
  const formatPricing = primaryFormatKey ? activeEdition.pricing?.[primaryFormatKey] : null;
  const displayPricing = formatPricing || directPricing || (activeEdition.priceInr
    ? { currency: "INR", amount: activeEdition.priceInr }
    : null);
  const displayPrice = formatCurrencyPrice(displayPricing);
  const availabilityLabel = showAvailableMode
    ? (isHindi ? "उपलब्ध अब" : "Available Now")
    : (isHindi ? "शीघ्र" : "Coming Soon");

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = book?.title || "Book";

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
        return;
      } catch {
        return;
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  const getRetailerDescriptor = (retailer) => {
    if (retailer.key === "amazon") {
      return "★★★★★";
    }
    if (retailer.key === "notionpress") {
      return "Official Store";
    }
    return retailer.actionLabel || (isHindi ? "उपलब्ध" : "Available");
  };

  const resetLeadModal = () => {
    setLeadModalOpen(false);
    setSelectedRetailer(null);
    setReaderName("");
    setReaderEmail("");
    setCaptchaToken("");
    setCaptchaError("");
    setCaptchaResetCounter((current) => current + 1);
    setLeadError("");
    setLeadSubmitting(false);
  };

  const openLeadModal = (retailer) => {
    leadTriggerRef.current = document.activeElement;
    setSelectedRetailer(retailer);
    setLeadModalOpen(true);
    setLeadError("");
  };

  useDialogA11y({
    open: leadModalOpen,
    dialogRef: leadModalRef,
    onClose: resetLeadModal,
    initialFocusRef: leadNameInputRef,
    restoreFocusRef: leadTriggerRef,
    lockBodyScroll: true,
  });

  const proceedToRetailer = (url) => {
    const nextWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (!nextWindow) {
      window.location.href = url;
    }
  };

  return (
    <>
      <aside className="purchase-panel">
      <div className="purchase-panel__header">
        <h2 className="purchase-panel__title">{showAvailableMode ? (isHindi ? "यहां उपलब्ध" : "Available At") : (isHindi ? "उपलब्धता" : "Availability")}</h2>
        <p className="purchase-panel__status">{availabilityLabel}</p>
      </div>

      {showAvailableMode ? (
        <>
          <div className="purchase-panel__price-block" aria-label={isHindi ? "संस्करण मूल्य" : "Edition pricing"}>
            <p className="purchase-panel__price-format">{displayFormat}</p>
            {displayPrice ? (
              <p className="purchase-panel__price">{displayPrice}</p>
            ) : (
              <p className="purchase-panel__note">{isHindi ? "मूल्य शीघ्र घोषित होगा" : "Price to be announced"}</p>
            )}
          </div>

          <div className="purchase-panel__retailers">
            {displayRetailers.map((retailer) => {
              const content = (
                <>
                  <span className="purchase-panel__retailer-top-row">
                    <RetailerMark retailerKey={retailer.key} />
                    <span>{retailer.name}</span>
                  </span>
                  <span className="purchase-panel__retailer-subtext">
                    {getRetailerDescriptor(retailer)}
                  </span>
                </>
              );
              return (
                <button
                  type="button"
                  key={retailer.key}
                  className="purchase-panel__button purchase-panel__button--secondary"
                  aria-label={retailer.actionLabel}
                  onClick={() => {
                    notifyBuyLinkClick({
                      bookTitle: book?.title,
                      editionLabel: activeEdition?.label || activeEdition?.formatLabel,
                      retailer: retailer.name,
                      url: retailer.url,
                      source: "purchase-panel",
                    });
                    openLeadModal(retailer);
                  }}
                >
                  {content}
                </button>
              );
            })}
            {displayRetailers.length === 0 ? (
              <div className="purchase-panel__button purchase-panel__button--secondary purchase-panel__button--disabled" aria-label="Buy links coming soon">
                <span className="purchase-panel__retailer-top-row">
                  <span>Buy links</span>
                </span>
                <span className="purchase-panel__retailer-subtext">Coming Soon</span>
              </div>
            ) : null}
          </div>

          <div className="purchase-panel__secondary-actions">
            {hasSample ? (
              <button type="button" className="purchase-panel__button purchase-panel__button--ghost" onClick={onPreviewOpen}>
                {isHindi ? "अंश पढ़ें" : "Read Sample"}
              </button>
            ) : null}

            <button type="button" className="purchase-panel__button purchase-panel__button--ghost" onClick={handleShare}>
              {isHindi ? "पुस्तक साझा करें" : "Share Book"}
            </button>
          </div>
        </>
      ) : (
        <a href="/contact" className="purchase-panel__button purchase-panel__button--secondary">
          {isHindi ? "सूचित करें" : "Notify Me"}
        </a>
      )}

      </aside>

      {leadModalOpen ? (
        <div className="purchase-panel__lead-backdrop" onClick={resetLeadModal}>
          <div
            ref={leadModalRef}
            className="purchase-panel__lead-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-lead-modal-title"
            aria-describedby="purchase-lead-modal-description"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="purchase-lead-modal-title" className="purchase-panel__lead-title">
              {isHindi ? "आगे बढ़ने से पहले" : "Before You Continue"}
            </h3>
            <p id="purchase-lead-modal-description" className="purchase-panel__lead-description">
              {isHindi
                ? "आप चाहें तो नाम और ईमेल भरें। इसके बाद आप खरीद लिंक पर भेजे जाएंगे।"
                : "Name and email are optional. You will then be redirected to the buy link."}
            </p>

            <form
              className="purchase-panel__lead-form"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!selectedRetailer?.url) {
                  setLeadError(isHindi ? "खरीद लिंक उपलब्ध नहीं है।" : "Buy link is not available.");
                  return;
                }

                if (isCaptchaEnabled() && !captchaToken) {
                  setCaptchaError(isHindi
                    ? "कृपया सुरक्षा जांच पूरी करें।"
                    : "Please complete the security check before continuing.");
                  return;
                }

                setLeadSubmitting(true);
                setLeadError("");
                setCaptchaError("");

                try {
                  await submitBuyNowLead({
                    name: readerName,
                    email: readerEmail,
                    bookTitle: book?.title || "Unknown",
                    editionLabel: activeEdition?.label || activeEdition?.formatLabel || "Unknown",
                    retailerName: selectedRetailer.name,
                    buyUrl: selectedRetailer.url,
                    captchaToken,
                  });

                  proceedToRetailer(selectedRetailer.url);
                  resetLeadModal();
                } catch (error) {
                  setLeadError(error?.message || (isHindi
                    ? "विवरण भेजने में समस्या हुई। फिर से प्रयास करें।"
                    : "Could not send details. Please try again."));
                  setLeadSubmitting(false);
                }
              }}
            >
              <label className="purchase-panel__lead-label" htmlFor="purchase-lead-name">
                {isHindi ? "नाम (वैकल्पिक)" : "Name (optional)"}
              </label>
              <input
                id="purchase-lead-name"
                ref={leadNameInputRef}
                type="text"
                className="purchase-panel__lead-input"
                value={readerName}
                onChange={(event) => setReaderName(event.target.value)}
              />

              <label className="purchase-panel__lead-label" htmlFor="purchase-lead-email">
                {isHindi ? "ईमेल (वैकल्पिक)" : "Email (optional)"}
              </label>
              <input
                id="purchase-lead-email"
                type="email"
                className="purchase-panel__lead-input"
                value={readerEmail}
                onChange={(event) => setReaderEmail(event.target.value)}
              />

              <CaptchaChallenge
                onTokenChange={(token) => {
                  setCaptchaToken(token);
                  if (token) {
                    setCaptchaError("");
                  }
                }}
                resetCounter={captchaResetCounter}
                errorMessage={captchaError}
              />

              {leadError ? <p className="purchase-panel__lead-error">{leadError}</p> : null}

              <div className="purchase-panel__lead-actions">
                <button type="button" className="purchase-panel__button purchase-panel__button--ghost" onClick={resetLeadModal}>
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
                <button type="submit" className="purchase-panel__button purchase-panel__button--secondary" disabled={leadSubmitting}>
                  {leadSubmitting ? (isHindi ? "भेज रहा है..." : "Submitting...") : (isHindi ? "जारी रखें" : "Continue to Buy")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PurchasePanel;