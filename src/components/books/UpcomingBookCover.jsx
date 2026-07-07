import "./UpcomingBookCover.css";

function UpcomingBookCover({ title, subtitle, author, badge = "Coming Soon", className = "" }) {
  return (
    <div className={`upcoming-book-cover ${className}`.trim()} aria-hidden="true">
      <span className="upcoming-book-cover__spine" />
      <div className="upcoming-book-cover__inner">
        <p className="upcoming-book-cover__title">{title}</p>
        <p className="upcoming-book-cover__subtitle">{subtitle}</p>
        <p className="upcoming-book-cover__badge">{badge}</p>
        <p className="upcoming-book-cover__author">{author || "Anurag Verma"}</p>
      </div>
    </div>
  );
}

export default UpcomingBookCover;
