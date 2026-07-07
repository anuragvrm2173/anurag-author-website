import UpcomingBookCover from "./UpcomingBookCover";
import "./BookCoverArt.css";

const OPTIMIZED_BASE_BY_SOURCE = {
  "/src/assets/images/books/(eng)lgb.jpeg": "/images/optimized/books/(eng)lgb",
  "/src/assets/images/books/(hin)lgb.jpeg": "/images/optimized/books/(hin)lgb",
  "/src/assets/images/books/last-goodbye-en.jpg": "/images/optimized/books/last-goodbye-en",
  "/src/assets/images/books/last-goodbye-hi.jpg": "/images/optimized/books/last-goodbye-hi",
};

function getOptimizedBase(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  const matched = Object.entries(OPTIMIZED_BASE_BY_SOURCE).find(([sourcePath]) => imagePath.includes(sourcePath));
  return matched?.[1] || null;
}

function buildSrcSet(basePath, format) {
  if (!basePath) {
    return "";
  }

  return [400, 800, 1200].map((width) => `${basePath}-${width}.${format} ${width}w`).join(", ");
}

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
  const optimizedBase = getOptimizedBase(preferredImage);

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
      <picture>
        {optimizedBase ? (
          <source
            type="image/avif"
            srcSet={buildSrcSet(optimizedBase, "avif")}
            sizes={variant === "full" ? "(max-width: 960px) 92vw, 640px" : "(max-width: 960px) 48vw, 320px"}
          />
        ) : null}
        {optimizedBase ? (
          <source
            type="image/webp"
            srcSet={buildSrcSet(optimizedBase, "webp")}
            sizes={variant === "full" ? "(max-width: 960px) 92vw, 640px" : "(max-width: 960px) 48vw, 320px"}
          />
        ) : null}
        <img
          src={preferredImage}
          alt={alt}
          className={`book-cover-art__image ${imageClassName}`.trim()}
          loading={loading}
          decoding="async"
          width={variant === "full" ? "1600" : "800"}
          height={variant === "full" ? "1153" : "1200"}
        />
      </picture>
    </div>
  );
}

export default BookCoverArt;
