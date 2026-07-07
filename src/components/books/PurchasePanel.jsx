import { FaAmazon, FaStore } from "react-icons/fa";

const FORMAT_KEYS = new Set(["paperback", "kindle", "ebook", "hardcover", "audiobook"]);
const FORMAT_PRIORITY = ["paperback", "hardcover", "kindle", "ebook", "audiobook"];
const RETAILER_PRIORITY = ["pothi", "amazon", "notionPress", "flipkart", "kindle"];

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
    if (typeof value === "string") {
      return {
        key,
        name: toTitleCase(key),
        available: true,
        url: value,
        actionLabel: `Buy from ${toTitleCase(key)}`,
        statusLabel: null,
      };
    }

    return {
      key,
      name: value?.name || toTitleCase(key),
      available: value?.available !== false,
      url: value?.url || value?.href || null,
      actionLabel: value?.actionLabel || value?.label || `Buy from ${value?.name || toTitleCase(key)}`,
      statusLabel: value?.statusLabel || value?.label || "Coming Soon",
    };
  });

  if (fromStructured.length > 0) {
    return fromStructured;
  }

  return Object.entries(activeEdition.purchaseLinks || {})
    .filter(([key, value]) => !FORMAT_KEYS.has(key) && Boolean(value))
    .map(([key, value]) => ({
      key,
      name: toTitleCase(key),
      available: true,
      url: value,
      actionLabel: `Buy from ${toTitleCase(key)}`,
      statusLabel: null,
    }));
}

function formatDisplayDate(dateValue, locale) {
  if (!dateValue) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
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

function RetailerMark({ retailerKey, retailerName }) {
  if (retailerKey === "amazon") {
    return (
      <span className="purchase-panel__retailer-mark" aria-hidden="true">
        <FaAmazon />
      </span>
    );
  }

  return (
    <span className="purchase-panel__retailer-mark" aria-hidden="true">
      <FaStore />
    </span>
  );
}

function PurchasePanel({ bookStatus, book, activeEdition, onPreviewOpen, isHindi = false }) {
  const locale = isHindi ? "hi-IN" : "en-IN";
  const retailers = normalizeRetailers(activeEdition);
  const orderedRetailers = [...retailers].sort((left, right) => {
    const leftIndex = RETAILER_PRIORITY.indexOf(left.key);
    const rightIndex = RETAILER_PRIORITY.indexOf(right.key);
    const leftRank = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const rightRank = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
    return leftRank - rightRank;
  });
  const availableRetailers = orderedRetailers.filter((item) => item.available && item.url);
  const unavailableRetailers = orderedRetailers.filter((item) => !item.available || !item.url);
  const hasSample = Boolean(activeEdition.sampleId);
  const primaryFormatKey = getPrimaryFormat(activeEdition.formats || {});
  const displayFormat = primaryFormatKey ? toTitleCase(primaryFormatKey) : (activeEdition.formatLabel || (isHindi ? "संस्करण" : "Edition"));
  const isPublished = bookStatus === "Published";

  const directPricing = activeEdition.pricing && typeof activeEdition.pricing.amount === "number" ? activeEdition.pricing : null;
  const formatPricing = primaryFormatKey ? activeEdition.pricing?.[primaryFormatKey] : null;
  const displayPricing = formatPricing || directPricing || (activeEdition.priceInr
    ? { currency: "INR", amount: activeEdition.priceInr }
    : null);
  const displayPrice = formatCurrencyPrice(displayPricing);
  const publicationDate = activeEdition.publicationDate || book?.publicationDate;
  const publicationLabel = formatDisplayDate(publicationDate, locale);
  const expectedLabel = publicationDate
    ? new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(new Date(publicationDate))
    : null;
  const availabilityLabel = isPublished
    ? (isHindi ? "उपलब्ध अब" : "Available Now")
    : expectedLabel
      ? (isHindi ? `अपेक्षित ${expectedLabel}` : `Expected ${expectedLabel}`)
      : (isHindi ? "शीघ्र" : "Coming Soon");

  const metadata = activeEdition.metadata || {};
  const publishedValue = formatDisplayDate(metadata.publicationDate || publicationDate, locale);
  const metadataRows = [
    { key: "format", label: "Format", value: displayFormat },
    { key: "language", label: "Language", value: metadata.language || activeEdition.language || activeEdition.label || book?.language },
    { key: "pages", label: "Pages", value: metadata.pages || activeEdition.pages || book?.pages },
    { key: "publisher", label: "Publisher", value: metadata.publisher || activeEdition.publisher || book?.publisher },
    { key: "published", label: "Published", value: publishedValue },
    { key: "isbn13", label: "ISBN-13", value: metadata.isbn13 || activeEdition.isbn13 || activeEdition.isbn || book?.isbn },
    { key: "asin", label: "ASIN", value: metadata.asin || activeEdition.asin },
    { key: "weight", label: "Weight", value: metadata.weight || activeEdition.weight },
    { key: "dimensions", label: "Dimensions", value: metadata.dimensions || activeEdition.dimensions },
    { key: "country", label: "Country", value: metadata.country || activeEdition.country },
  ].filter((item) => Boolean(item.value));

  const additionalInfoRows = [
    { key: "packer", label: "Packer", value: activeEdition.packer?.name },
    {
      key: "address",
      label: "Address",
      value: Array.isArray(activeEdition.packer?.address)
        ? activeEdition.packer.address.join(", ")
        : activeEdition.packer?.address,
    },
    { key: "website", label: "Website", value: activeEdition.packer?.website },
    { key: "email", label: "Email", value: activeEdition.packer?.email },
    { key: "genericName", label: "Generic Name", value: metadata.genericName },
  ].filter((item) => Boolean(item.value));

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

  return (
    <aside className="purchase-panel">
      <div className="purchase-panel__header">
        <h2 className="purchase-panel__title">{isHindi ? "पुस्तक प्राप्त करें" : "Get the Book"}</h2>
        <p className="purchase-panel__status">{availabilityLabel}</p>
      </div>

      <div className="purchase-panel__price-block" aria-label={isHindi ? "संस्करण मूल्य" : "Edition pricing"}>
        <p className="purchase-panel__price-format">{displayFormat}</p>
        {displayPrice ? (
          <p className="purchase-panel__price">{displayPrice}</p>
        ) : (
          <p className="purchase-panel__note">{isHindi ? "मूल्य शीघ्र घोषित होगा" : "Price to be announced"}</p>
        )}
        {availableRetailers.length > 0 ? (
          <p className="purchase-panel__note">{isHindi ? "उपलब्ध" : "Available at"}</p>
        ) : null}
      </div>

      {availableRetailers.length > 0 ? (
        <div className="purchase-panel__retailers">
          {availableRetailers.map((retailer) => (
            <a
              key={retailer.key}
              href={retailer.url}
              className="purchase-panel__button purchase-panel__button--secondary"
              target="_blank"
              rel="noreferrer"
              aria-label={retailer.actionLabel}
            >
              <RetailerMark retailerKey={retailer.key} retailerName={retailer.name} />
              <span>[ {retailer.name} ]</span>
            </a>
          ))}
        </div>
      ) : null}

      {unavailableRetailers.length > 0 ? (
        <div className="purchase-panel__retailers-unavailable" aria-label={isHindi ? "अनुपलब्ध विक्रेता" : "Unavailable retailers"}>
          {unavailableRetailers.map((retailer) => (
            <div key={retailer.key} className="purchase-panel__retailer-unavailable-item">
              <p className="purchase-panel__retailer-name">{retailer.name}</p>
              <p className="purchase-panel__retailer-status">{retailer.statusLabel}</p>
            </div>
          ))}
        </div>
      ) : null}

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

      <dl className="purchase-panel__metadata" aria-label={isHindi ? "पुस्तक मेटाडेटा" : "Book metadata"}>
        {metadataRows.map((item) => (
          <div key={item.key} className="purchase-panel__metadata-item">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      {additionalInfoRows.length > 0 ? (
        <details className="purchase-panel__additional">
          <summary>Additional Information</summary>
          <dl className="purchase-panel__additional-list">
            {additionalInfoRows.map((item) => (
              <div key={item.key} className="purchase-panel__additional-item">
                <dt>{item.label}</dt>
                <dd>
                  {item.key === "website" ? (
                    <a href={item.value} target="_blank" rel="noreferrer">{item.value}</a>
                  ) : item.key === "email" ? (
                    <a href={`mailto:${item.value}`}>{item.value}</a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      ) : null}
    </aside>
  );
}

export default PurchasePanel;