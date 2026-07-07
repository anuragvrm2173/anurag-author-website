export const reviews = [
	{
		id: "review-1",
		quote:
			"I opened this book for closure, but I stayed for the quiet truth that healing does not arrive all at once.",
		reviewerName: "Aarav S.",
		reviewerRole: "Reader",
		source: "Amazon India",
		bookId: "the-last-goodbye",
		featured: true,
	},
	{
		id: "review-2",
		quote:
			"The writing feels like a letter written in the middle of the night, honest, vulnerable, and impossible to forget.",
		reviewerName: "Mitali R.",
		reviewerRole: "Reader",
		source: "Goodreads",
		bookId: "the-last-goodbye",
		featured: true,
	},
	{
		id: "review-3",
		quote:
			"Some pages hurt in the best possible way, then leave you calmer than you were before you began.",
		reviewerName: "Nikhil P.",
		reviewerRole: "Book Club Member",
		source: "Reader Message",
		bookId: "the-last-goodbye",
		featured: true,
	},
	{
		id: "review-4",
		quote:
			"Anurag writes about grief with tenderness and restraint, never forcing emotion, only revealing it.",
		reviewerName: "Shreya K.",
		reviewerRole: "Reader",
		source: "Instagram",
		bookId: "the-last-goodbye",
		featured: false,
	},
	{
		id: "review-5",
		quote:
			"This story reminded me that some goodbyes are never finished, but life can still become gentle again.",
		reviewerName: "Harsh V.",
		reviewerRole: "Reader",
		source: "Goodreads",
		bookId: "the-last-goodbye",
		featured: false,
	},
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
