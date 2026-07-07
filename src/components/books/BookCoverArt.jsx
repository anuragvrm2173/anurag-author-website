import UpcomingBookCover from "./UpcomingBookCover";
import "./BookCoverArt.css";

function BookCoverArt({
  title,
  subtitle,
  author,
  badge,
  cover,
  coverImage,
  variant = "front",
  alt,
  className = "",
  imageClassName = "",
  loading = "lazy",
}) {
  const preferredImage =
    coverImage ||
    (variant === "full"
      ? (cover?.fullCover || cover?.frontCover || null)
      : (cover?.frontCover || cover?.fullCover || null));

  if (!preferredImage) {
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
    <div className={`book-cover-art book-cover-art--${variant} ${className}`.trim()}>
      <img
        src={preferredImage}
        alt={alt}
        className={`book-cover-art__image ${imageClassName}`.trim()}
        loading={loading}
        decoding="async"
        width={variant === "full" ? "1600" : "800"}
        height={variant === "full" ? "1153" : "1200"}
      />
    </div>
  );
}

export default BookCoverArt;
