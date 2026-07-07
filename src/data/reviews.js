export const reviews = [
	// Reviews will be added as verified reader feedback is collected.
];

export function getFeaturedReviews(limit = 3) {
	return reviews.filter((review) => review.featured).slice(0, limit);
}

export function getReviewsByBookId(bookId) {
	return reviews.filter((review) => review.bookId === bookId);
}

export function getReviewGroupsByBook(books) {
	return books
		.map((book) => ({
			book,
			items: getReviewsByBookId(book.id),
		}))
		.filter((group) => group.items.length > 0);
}
