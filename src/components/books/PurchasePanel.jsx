const PURCHASE_LABELS = {
  paperback: "Buy Paperback",
  kindle: "Buy Kindle",
  amazon: "Amazon",
  pothi: "Pothi",
  notionPress: "Notion Press",
};

function PurchasePanel({ bookStatus, activeEdition, onPreviewOpen }) {
  const purchaseLinks = Object.entries(activeEdition.purchaseLinks || {}).filter(([, value]) => value);
  const primaryLinks = purchaseLinks.filter(([key]) => key === "paperback" || key === "kindle");
  const retailerLinks = purchaseLinks.filter(([key]) => key !== "paperback" && key !== "kindle");
  const hasSample = Boolean(activeEdition.sampleId);

  return (
    <aside className="purchase-panel">
      <div className="purchase-panel__header">
        <h2 className="purchase-panel__title">Get the Book</h2>
        <p className="purchase-panel__status">{bookStatus}</p>
      </div>

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
              {PURCHASE_LABELS[key]}
            </a>
          ))}
        </div>
      ) : (
        <p className="purchase-panel__note">Purchase links are not available for this edition yet.</p>
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
              {PURCHASE_LABELS[key]}
            </a>
          ))}
        </div>
      ) : null}

      {hasSample ? (
        <button type="button" className="purchase-panel__button purchase-panel__button--ghost" onClick={onPreviewOpen}>
          Look Inside
        </button>
      ) : null}
    </aside>
  );
}

export default PurchasePanel;