const PURCHASE_LABELS = {
  paperback: "Buy Paperback",
  kindle: "Buy Kindle",
  amazon: "Amazon",
  pothi: "Pothi",
  notionPress: "Notion Press",
};

const PURCHASE_LABELS_HI = {
  paperback: "पेपरबैक खरीदें",
  kindle: "किंडल खरीदें",
  amazon: "अमेज़न",
  pothi: "पोथी",
  notionPress: "नोटियन प्रेस",
};

function PurchasePanel({ bookStatus, activeEdition, onPreviewOpen, isHindi = false }) {
  const labels = isHindi ? PURCHASE_LABELS_HI : PURCHASE_LABELS;
  const purchaseLinks = Object.entries(activeEdition.purchaseLinks || {}).filter(([, value]) => value);
  const primaryLinks = purchaseLinks.filter(([key]) => key === "paperback" || key === "kindle");
  const retailerLinks = purchaseLinks.filter(([key]) => key !== "paperback" && key !== "kindle");
  const hasSample = Boolean(activeEdition.sampleId);
  const formatNames = Object.entries(activeEdition.formats || {})
    .filter(([, isAvailable]) => Boolean(isAvailable))
    .map(([name]) => name.toUpperCase());

  return (
    <aside className="purchase-panel">
      <div className="purchase-panel__header">
        <h2 className="purchase-panel__title">{isHindi ? "पुस्तक प्राप्त करें" : "Get the Book"}</h2>
        <p className="purchase-panel__status">{isHindi && bookStatus === "Published" ? "प्रकाशित" : bookStatus}</p>
      </div>

      <p className="purchase-panel__note">
        {activeEdition.publicationDate
          ? `${isHindi ? "प्रकाशन" : "Publication"}: ${new Date(activeEdition.publicationDate).toLocaleDateString("en-IN")}`
          : isHindi
            ? "प्रकाशन तिथि शीघ्र घोषित होगी।"
            : "Publication date to be announced."}
      </p>
      <p className="purchase-panel__note">
        {isHindi ? "फॉर्मेट" : "Formats"}: {formatNames.length > 0 ? formatNames.join(", ") : (isHindi ? "शीघ्र" : "Coming Soon")}
      </p>

      {primaryLinks.length > 0 ? (
        <div className="purchase-panel__actions">
          {primaryLinks.map(([key, value]) => (
            <a
              key={key}
              href={value}
              className="purchase-panel__button purchase-panel__button--primary"
              target="_blank"
              rel="noreferrer"
            >
              {labels[key]}
            </a>
          ))}
        </div>
      ) : (
        <p className="purchase-panel__note">{isHindi ? "अभी खरीद लिंक उपलब्ध नहीं हैं।" : "Purchase links are not available for this edition yet."}</p>
      )}

      {retailerLinks.length > 0 ? (
        <div className="purchase-panel__retailers">
          {retailerLinks.map(([key, value]) => (
            <a
              key={key}
              href={value}
              className="purchase-panel__button purchase-panel__button--secondary"
              target="_blank"
              rel="noreferrer"
            >
              {labels[key]}
            </a>
          ))}
        </div>
      ) : null}

      {purchaseLinks.length === 0 ? (
        <button type="button" className="purchase-panel__button purchase-panel__button--secondary" disabled>
          {isHindi ? "सूचित करें" : "Notify Me"}
        </button>
      ) : null}

      {hasSample ? (
        <button type="button" className="purchase-panel__button purchase-panel__button--ghost" onClick={onPreviewOpen}>
          {isHindi ? "अंश पढ़ें" : "Look Inside"}
        </button>
      ) : null}
    </aside>
  );
}

export default PurchasePanel;