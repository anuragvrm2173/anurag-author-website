export const reviews = [
	{
		id: "goodreads-anurag-last-goodbye-2026-06-27",
		bookId: "the-last-goodbye",
		reviewerName: "Anurag Verma",
		reviewerRole: "Goodreads Author",
		quote:
			"As the author of this book, I wanted to share a story that was lived before it was written. The Last Goodbye I Never Got is an autobiographical novel about love, heartbreak, family, loss, healing, and the memories that continue to shape us. Every chapter is inspired by real experiences, making this book deeply personal and emotionally honest. My hope is that readers who have experienced love, grief, or the pain of an unfinished goodbye will find comfort and connection within these pages. Thank you for giving my debut book a chance. I hope this story stays with you long after you've turned the final page.",
		source: "Goodreads",
		sourceUrl: "https://www.goodreads.com/review/show/8719913777",
		rating: 5,
		featured: true,
		status: "approved",
		createdAt: "2026-06-27T00:00:00.000Z",
	},
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
