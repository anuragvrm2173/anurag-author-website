import "./ReviewCard.css";

function renderStars(rating = 0) {
  if (!rating) {
    return null;
  }

  return "★".repeat(rating);
}

function ReviewCard({ review, showVerifiedBadge = true }) {
  return (
    <article className="review-card" aria-label={`Review by ${review.reviewerName}`}>
      {showVerifiedBadge ? <p className="review-card__verified">Verified Reader</p> : null}
      {review.rating ? <p className="review-card__rating">{renderStars(review.rating)}</p> : null}
      <p className="review-card__quote">"{review.quote}"</p>
      <p className="review-card__author">
        {review.reviewerName}
        {review.reviewerRole ? `, ${review.reviewerRole}` : ""}
      </p>
      {review.source ? (
        <p className="review-card__source">
          Source:{" "}
          {review.sourceUrl ? (
            <a
              className="review-card__source-link"
              href={review.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {review.source}
            </a>
          ) : (
            review.source
          )}
        </p>
      ) : null}
    </article>
  );
}

export default ReviewCard;