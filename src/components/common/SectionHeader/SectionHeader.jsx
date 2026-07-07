import "./SectionHeader.css";

function SectionHeader({ eyebrow, title, description, align = "left", titleId }) {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow ? <p className="section-header__eyebrow">{eyebrow}</p> : null}
      <h1 id={titleId} className="section-header__title">
        {title}
      </h1>
      {description ? <p className="section-header__description">{description}</p> : null}
    </header>
  );
}

export default SectionHeader;