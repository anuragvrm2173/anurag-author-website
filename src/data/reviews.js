export const reviews = [
	// Reviews will be added as verified reader feedback is collected.
];

export function getFeaturedReviews(limit = 3, list = reviews) {
	return list.filter((review) => review.featured).slice(0, limit);
}

export function getReviewsByBookId(bookId, list = reviews) {
	return list.filter((review) => review.bookId === bookId);
}

export function getReviewGroupsByBook(books, list = reviews) {
	return books
		.map((book) => ({
			book,
			items: getReviewsByBookId(book.id, list),
		}))
		.filter((group) => group.items.length > 0);
}
