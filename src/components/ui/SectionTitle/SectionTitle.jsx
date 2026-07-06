import "./SectionTitle.css";

function SectionTitle({
  eyebrow,
  title,
  description,
}) {
  return (
    <header className="section-title">
      {eyebrow && (
        <p className="section-title__eyebrow">
          {eyebrow}
        </p>
      )}

      <h2 className="section-title__heading">
        {title}
      </h2>

      {description && (
        <p className="section-title__description">
          {description}
        </p>
      )}
    </header>
  );
}

export default SectionTitle;