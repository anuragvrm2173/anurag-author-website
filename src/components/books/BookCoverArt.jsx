import UpcomingBookCover from "./UpcomingBookCover";
import "./BookCoverArt.css";

function BookCoverArt({
  title,
  subtitle,
  author,
  badge,
  coverImage,
  alt,
  className = "",
  imageClassName = "",
  loading = "lazy",
}) {
  if (!coverImage) {
    return (
      <UpcomingBookCover
        title={title}
        subtitle={subtitle}
        author={author}
        badge={badge}
        className={className}
      />
    );
  }

  return (
    <div className={`book-cover-art ${className}`.trim()}>
      <img
        src={coverImage}
        alt={alt}
        className={`book-cover-art__image ${imageClassName}`.trim()}
        loading={loading}
        decoding="async"
        width="800"
        height="1200"
      />
    </div>
  );
}

export default BookCoverArt;
