const STORE_LOGOS = {
  amazon: "/store-logos/amazon.svg",
  notionPress: "/store-logos/notion-press.svg",
  pothi: "/store-logos/pothi.svg",
  flipkart: "/store-logos/flipkart.svg",
};

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
  const isPublished = bookStatus === "Published";
  const retailers = normalizeRetailers(activeEdition);
  const retailerByKey = retailers.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});
  const displayRetailers = RETAILER_PRIORITY
    .filter((key) => ["amazon", "notionPress", "pothi", "flipkart"].includes(key))
    .map((key) => {
      const item = retailerByKey[key];
      if (item) {
        return item;
      }
      return {
        key,
        name: toTitleCase(key),
        available: false,
        url: null,
        actionLabel: `Buy from ${toTitleCase(key)}`,
        statusLabel: "Coming Soon",
      };
    });
  const hasSample = Boolean(activeEdition.sampleId);
  const primaryFormatKey = getPrimaryFormat(activeEdition.formats || {});
  const displayFormat = primaryFormatKey ? toTitleCase(primaryFormatKey) : (activeEdition.formatLabel || (isHindi ? "संस्करण" : "Edition"));
  const directPricing = activeEdition.pricing && typeof activeEdition.pricing.amount === "number" ? activeEdition.pricing : null;
  const formatPricing = primaryFormatKey ? activeEdition.pricing?.[primaryFormatKey] : null;
  const displayPricing = formatPricing || directPricing || (activeEdition.priceInr
    ? { currency: "INR", amount: activeEdition.priceInr }
    : null);
  const displayPrice = formatCurrencyPrice(displayPricing);
  const availabilityLabel = isPublished
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
    if (retailer.key === "notionPress") {
      return "Official Store";
    }
    return retailer.actionLabel || (isHindi ? "उपलब्ध" : "Available");
  };

  return (
    <aside className="purchase-panel">
      <div className="purchase-panel__header">
        <h2 className="purchase-panel__title">{isPublished ? (isHindi ? "यहां उपलब्ध" : "Available At") : (isHindi ? "उपलब्धता" : "Availability")}</h2>
        <p className="purchase-panel__status">{isPublished ? availabilityLabel : (isHindi ? "शीघ्र" : "Coming Soon")}</p>
      </div>

      {isPublished ? (
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
                    {retailer.available && retailer.url ? getRetailerDescriptor(retailer) : "Coming Soon"}
                  </span>
                </>
              );

              if (retailer.available && retailer.url) {
                return (
                  <a
                    key={retailer.key}
                    href={retailer.url}
                    className="purchase-panel__button purchase-panel__button--secondary"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={retailer.actionLabel}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={retailer.key} className="purchase-panel__button purchase-panel__button--secondary purchase-panel__button--disabled" aria-label={`${retailer.name} coming soon`}>
                  {content}
                </div>
              );
            })}
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
  );
}

export default PurchasePanel;