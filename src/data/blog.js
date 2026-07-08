import { getBookById } from "./books";

const BLOG_VISUAL_THEMES = {
	"Author Journey": {
		eyebrow: "Author Journal",
		motif: "Memory, loss, and the reasons stories remain",
		background:
			"radial-gradient(circle at top left, rgba(234, 204, 150, 0.9), transparent 38%), linear-gradient(135deg, #23170f 0%, #5b3921 48%, #d0a96c 100%)",
	},
	"Behind the Book": {
		eyebrow: "Behind the Book",
		motif: "The chapters behind the published page",
		background:
			"radial-gradient(circle at top right, rgba(244, 228, 193, 0.88), transparent 36%), linear-gradient(135deg, #1f2630 0%, #48566a 45%, #c59f68 100%)",
	},
	Writing: {
		eyebrow: "Writing Notes",
		motif: "How emotion becomes language",
		background:
			"radial-gradient(circle at 18% 16%, rgba(217, 233, 229, 0.88), transparent 30%), linear-gradient(135deg, #16353a 0%, #2e5f67 50%, #a4c5b6 100%)",
	},
	Storytelling: {
		eyebrow: "Storycraft",
		motif: "Meaning discovered through narrative",
		background:
			"radial-gradient(circle at 16% 14%, rgba(255, 222, 197, 0.85), transparent 28%), linear-gradient(135deg, #3a1f18 0%, #7c4e3e 50%, #d9ab8a 100%)",
	},
	Healing: {
		eyebrow: "Healing Notes",
		motif: "Learning what it means to carry memory",
		background:
			"radial-gradient(circle at top left, rgba(223, 235, 210, 0.88), transparent 34%), linear-gradient(135deg, #1d2f1a 0%, #466542 52%, #b8c9a0 100%)",
	},
	Reflection: {
		eyebrow: "Reflections",
		motif: "What readers keep after the final page",
		background:
			"radial-gradient(circle at top, rgba(225, 216, 249, 0.82), transparent 34%), linear-gradient(135deg, #26203b 0%, #564a7d 50%, #c1b4e8 100%)",
	},
	Personal: {
		eyebrow: "Personal Notes",
		motif: "Home, family, and the first language of feeling",
		background:
			"radial-gradient(circle at 14% 18%, rgba(255, 231, 210, 0.88), transparent 34%), linear-gradient(135deg, #3b281d 0%, #805943 50%, #ddb490 100%)",
	},
	Process: {
		eyebrow: "Writing Process",
		motif: "From raw drafts to finished form",
		background:
			"radial-gradient(circle at top right, rgba(233, 241, 245, 0.88), transparent 34%), linear-gradient(135deg, #1d2930 0%, #456371 50%, #b3c8d3 100%)",
	},
};

export const blogPosts = [
	{
		id: "the-story-behind-the-words",
		title: "The Story Behind the Words",
		excerpt:
			"Every book begins long before the first sentence. These are the moments, losses, and lessons that became the foundation of Anurag Verma's work.",
		readingTime: "8 min read",
		publishedAt: "July 2026",
		category: "Author Journey",
		visual: {
			motif: "Every book begins before the first sentence.",
		},
		relatedBookIds: ["the-last-goodbye", "the-untold-stories", "lessons-of-the-heart"],
		contentSections: [
			{
				heading: "Who I Am",
				paragraphs: [
					"I'm Anurag Verma, an Indian author who believes that stories have the power to stay with us long after we've finished reading them.",
					"I don't write to escape life. I write to understand it. The moments that shaped me, the people I loved, the losses I carried, and the lessons I learned have all found their way into my work.",
					"My books are deeply personal, but they are also about the emotions we all experience: love, grief, hope, regret, healing, and the quiet courage it takes to keep moving forward.",
					"If my words help even one reader feel understood, then they have done what they were meant to do.",
				],
			},
			{
				heading: "Why I Write",
				paragraphs: [
					"Writing began as a way of making sense of experiences I could not explain.",
					"Some stories are too important to remain memories. They deserve to become words, because somewhere, someone else may be living through the same chapter.",
					"I don't write to offer perfect advice or easy answers. I write because stories have a unique way of reaching places that advice never can.",
					"If a reader closes one of my books feeling a little less alone, a little more hopeful, or simply understood, then every page has served its purpose.",
				],
			},
			{
				heading: "The Books",
				paragraphs: [
					"Every book I write builds upon the one before it.",
					"The Last Goodbye I Never Got is where the journey begins, a deeply personal story of love, loss, and the echoes that remain long after goodbye.",
					"The Untold Stories Behind The Last Goodbye I Never Got goes beyond the pages of that first book, revealing the experiences, emotions, and reflections that shaped its creation.",
					"With Lessons of the Heart, those experiences grow into something larger: a collection of reflections on love, healing, resilience, and the quiet wisdom that often emerges only after life changes us.",
					"Together, these books form a continuing journey, not separate stories, but different chapters of the same conversation.",
				],
			},
			{
				heading: "A Few Chapters of My Journey",
				paragraphs: [
					"2026: Published my debut book, The Last Goodbye I Never Got, transforming deeply personal experiences into a story shared with readers.",
					"Later in 2026: Released The Untold Stories Behind The Last Goodbye I Never Got, offering a closer look at the memories, emotions, and creative journey behind the first book.",
					"Today: Continuing to write stories that explore love, loss, healing, and the lessons that shape us, while building a body of work that grows with every new book.",
				],
			},
			{
				heading: "What's Next",
				paragraphs: [
					"I'm still writing.",
					"Not because every story has been told, but because every new season of life reveals something worth understanding.",
					"The books ahead will continue exploring the emotions that connect us all: love, loss, resilience, hope, and the quiet moments that often change us the most.",
					"My hope is simple: to create stories that readers return to, recommend to others, and carry with them long after the final page.",
					"Because sometimes a book does not change your life all at once. Sometimes, it simply stays with you until you're ready to change your own.",
				],
			},
		],
	},
	{
		id: "why-i-wrote-the-last-goodbye",
		title: "Why I Wrote The Last Goodbye I Never Got",
		excerpt:
			"Some memories refuse to stay silent. Writing became the only way to preserve moments that shaped me before time softened their edges.",
		readingTime: "7 min read",
		publishedAt: "July 2026",
		category: "Behind the Book",
		content: [
			"People often ask why I decided to write such a personal story. The answer is simple: some memories refuse to stay silent.",
			"For years, I carried moments I could not fully explain: love that changed me, loss that stayed with me, and conversations I replayed in my mind long after they were over.",
			"Writing became the only way to preserve those experiences before time softened their edges.",
			"I did not write this book because I had all the answers. I wrote it because I was still searching for them.",
			"If someone finds a piece of their own story inside mine, then every page was worth writing."
		],
	},
	{
		id: "how-personal-loss-changed-my-writing",
		title: "How Personal Loss Changed My Writing",
		excerpt:
			"Loss changed what I notice and what I choose to write. The smallest moments began to carry the deepest meaning.",
		readingTime: "6 min read",
		publishedAt: "June 2026",
		category: "Writing",
		content: [
			"Loss changes more than our lives. It changes the way we see people, the way we remember moments, and the way we tell stories.",
			"Before loss, I focused on events. After loss, I began noticing emotions hidden inside ordinary moments.",
			"A conversation with my father. A quiet sacrifice by my mother. A message from someone I loved.",
			"Those experiences taught me that the smallest moments often become the ones we carry forever.",
			"That realization changed not only what I write, but why I write."
		],
	},
	{
		id: "why-stories-matter-more-than-advice",
		title: "Why Stories Matter More Than Advice",
		excerpt:
			"Advice tells people what to do. Stories allow people to discover meaning in their own way.",
		readingTime: "5 min read",
		publishedAt: "May 2026",
		category: "Storytelling",
		content: [
			"Advice tells people what to do. Stories allow people to discover it for themselves.",
			"A lesson can be forgotten, but a story has a way of staying with us.",
			"Long after we finish a book, we remember a character, a conversation, or a single moment that changes how we see our own lives.",
			"That is why I choose stories over instructions.",
			"I do not want to tell readers what to think. I want to share honestly and let them find the meaning that speaks to them."
		],
	},
	{
		id: "difference-between-healing-and-moving-on",
		title: "The Difference Between Healing and Moving On",
		excerpt:
			"Moving on and healing are not the same. Healing is learning to carry memory without letting it define your life.",
		readingTime: "5 min read",
		publishedAt: "April 2026",
		category: "Healing",
		content: [
			"People often use healing and moving on as if they mean the same thing. I do not believe they do.",
			"Moving on suggests leaving something behind. Healing is learning how to carry it without letting it define every part of your life.",
			"Some people will always remain part of your story. Some losses never disappear completely.",
			"Healing does not erase memories. It changes the relationship you have with them.",
			"For me, writing has never been about forgetting. It has always been about understanding."
		],
	},
	{
		id: "behind-the-book-untold-stories",
		title: "Behind the Book: The Untold Stories",
		excerpt:
			"Every book leaves something behind. This companion work explores the moments that lived between published chapters.",
		readingTime: "6 min read",
		publishedAt: "March 2026",
		category: "Behind the Book",
		content: [
			"Every book leaves something behind. Not because those moments are unimportant, but because not every memory belongs in the main story.",
			"The Untold Stories grew from pages that did not make it into the first book.",
			"It is not a sequel. It is a deeper look at the people, moments, and emotions that shaped the journey.",
			"It offers readers a chance to see the same story from another perspective.",
			"Sometimes what remains untold is just as meaningful as what is written."
		],
	},
	{
		id: "what-readers-carry-from-stories",
		title: "What Readers Carry from Stories",
		excerpt:
			"The best books do not just end. They continue quietly in how readers think, remember, and heal.",
		readingTime: "6 min read",
		publishedAt: "February 2026",
		category: "Reflection",
		content: [
			"A story lives twice: once in writing and once in the reader who receives it.",
			"Readers often remember one line, one chapter, one character that met them at the right time.",
			"Those fragments become emotional tools they return to during difficult days.",
			"That is the quiet power of literature. It does not always solve pain, but it gives shape to it.",
			"When a reader says, 'I felt seen,' that is the deepest form of success for any writer."
		],
	},
	{
		id: "writing-with-emotional-honesty",
		title: "Writing with Emotional Honesty",
		excerpt:
			"Emotional honesty is not dramatic writing. It is precise writing that stays truthful to lived experience.",
		readingTime: "5 min read",
		publishedAt: "January 2026",
		category: "Writing",
		content: [
			"Emotional honesty begins with attention. Noticing what was actually felt, not just what sounds poetic.",
			"It asks a writer to resist exaggeration and stay near truth.",
			"In personal writing, honesty does not mean sharing everything. It means sharing the right things clearly.",
			"Readers can recognize sincerity quickly. They can also recognize performance.",
			"When language is honest, it creates trust. Trust is what turns pages into connection."
		],
	},
	{
		id: "family-memory-and-language",
		title: "Family, Memory, and the Language of Home",
		excerpt:
			"The emotional vocabulary we inherit from family shapes how we remember, grieve, and heal.",
		readingTime: "4 min read",
		publishedAt: "December 2025",
		category: "Personal",
		content: [
			"Before we learn literary language, we learn emotional language at home.",
			"How families speak about love, conflict, sacrifice, and silence becomes part of our voice.",
			"When I write about family, I am writing about the first place where I learned both tenderness and resilience.",
			"Memory does not preserve facts alone. It preserves tone, pauses, and the emotional weather of a room.",
			"Those details are often where the truest stories live."
		],
	},
	{
		id: "from-draft-to-book",
		title: "From Draft to Book: What Changes Most",
		excerpt:
			"The biggest change between draft and publication is usually clarity: what the story is truly trying to say.",
		readingTime: "7 min read",
		publishedAt: "November 2025",
		category: "Process",
		content: [
			"Early drafts are full of urgency. Later drafts are full of decisions.",
			"What to keep, what to cut, and what belongs in a different book entirely.",
			"Revision is where a manuscript learns discipline. It is also where it discovers voice.",
			"Publication is not the end of writing. It is the beginning of dialogue with readers.",
			"A finished book is not perfect memory. It is the truest version we can offer at that time."
		],
	},
	{
		id: "why-books-still-matter",
		title: "Why Books Still Matter in a Fast World",
		excerpt:
			"Books create the rarest modern experience: sustained attention to another human life.",
		readingTime: "5 min read",
		publishedAt: "October 2025",
		category: "Reflection",
		content: [
			"A fast world rewards quick answers. Books reward careful understanding.",
			"Reading asks us to slow down long enough to encounter complexity.",
			"That matters especially in emotional life, where simple answers often fail.",
			"Books give language to feelings we struggle to name.",
			"In that sense, reading is not escape. It is practice for being fully human."
		],
	},
];

function normalizeText(value) {
	return String(value || "")
		.toLowerCase()
		.replace(/[^a-z0-9\u0900-\u097f]+/g, " ")
		.trim();
}

function getBlogCorpus(post) {
	const sectionText = (post.contentSections || [])
		.flatMap((section) => [section.heading, ...(section.paragraphs || [])])
		.join(" ");

	return [post.title, post.excerpt, ...(post.content || []), sectionText].join(" ");
}

export function getBlogPostById(postId) {
	return blogPosts.find((post) => post.id === postId) || null;
}

export function getBlogPostPath(postId) {
	return `/blog/${postId}`;
}

export function getBlogSearchText(post) {
	return [post.title, post.excerpt, post.category, getBlogCorpus(post)].join(" ").toLowerCase();
}

export function getBlogVisual(post) {
	const baseTheme = BLOG_VISUAL_THEMES[post.category] || {
		eyebrow: "Essay",
		motif: "Reflections from the writing life",
		background:
			"radial-gradient(circle at top left, rgba(232, 218, 190, 0.88), transparent 34%), linear-gradient(135deg, #2d241a 0%, #6a5238 52%, #d1b38b 100%)",
	};

	return {
		...baseTheme,
		...post.visual,
	};
}

export function getBlogPostsByBookId(bookId) {
	const book = getBookById(bookId);

	if (!book?.relatedBlogIds?.length) {
		return [];
	}

	return book.relatedBlogIds
		.map((postId) => getBlogPostById(postId))
		.filter(Boolean);
}
