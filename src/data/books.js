const books = [
  {
    id: "the-last-goodbye",
    title: "The Last Goodbye I Never Got",
    subtitle:
      "A deeply felt novel about grief, memory, and the fragile work of learning how to keep loving after loss.",
    description:
      "A quiet, intimate story of love, loss, and the difficult grace of moving forward.",
    status: "Published",
    slug: "the-last-goodbye-i-never-got",
    seo: {
      title: "The Last Goodbye I Never Got | Anurag Verma",
      description:
        "Explore The Last Goodbye I Never Got by Anurag Verma, a reflective novel about loss, remembrance, and emotional healing.",
    },
    synopsis: [
      "The Last Goodbye I Never Got stays close to the interior life of someone carrying unfinished conversations, treasured memories, and the ache of a goodbye that never arrived in the form it should have.",
      "Through reflective prose and emotionally observant scenes, the book lingers on how grief moves through daily life while still making room for tenderness, hope, and the possibility of healing.",
    ],
    discoveries: [
      "How love continues to shape a life even after loss changes its form.",
      "The quiet emotional weight of unfinished conversations and remembered moments.",
      "Why healing often looks less like closure and more like learning how to carry tenderness forward.",
    ],
    reviews: [],
    editions: {
      english: {
        label: "English",
        languageCode: "en",
        available: true,
        formatLabel: "English Edition",
        cover: {
          eyebrow: "Published Novel",
          subtitle: "English edition",
        },
        sampleId: "lastGoodbye-en",
        purchaseLinks: {},
      },
      hindi: {
        label: "हिन्दी",
        languageCode: "hi",
        available: true,
        formatLabel: "Hindi Edition",
        cover: {
          eyebrow: "Published Novel",
          subtitle: "हिन्दी संस्करण",
        },
        sampleId: null,
        purchaseLinks: {},
      },
    },
  },
  {
    id: "the-untold-stories",
    title: "The Untold Stories Behind The Last Goodbye I Never Got",
    subtitle:
      "A companion volume that returns to the emotional landscape behind the first book and lingers with the stories that stayed beneath the surface.",
    description:
      "A deeper look into the people, places, and memories that shaped the original story.",
    status: "Coming Soon",
    slug: "the-untold-stories",
    seo: {
      title: "The Untold Stories Behind The Last Goodbye I Never Got | Anurag Verma",
      description:
        "Discover the upcoming companion book from Anurag Verma that explores the memories, people, and emotions behind The Last Goodbye I Never Got.",
    },
    synopsis: [
      "This companion work gathers the emotional echoes, personal histories, and unspoken threads that gave The Last Goodbye I Never Got its deeper shape.",
      "Rather than revisiting the same story, it broadens the world around it, inviting readers to spend more time with the memories, silences, and emotional truths that could not be fully contained in a single narrative arc.",
    ],
    discoveries: [
      "The people and moments that quietly informed the emotional foundation of the original novel.",
      "A closer look at memory, perspective, and the stories that continue beyond the page.",
      "Fresh emotional context for readers who want to stay longer inside the world of the first book.",
    ],
    reviews: [],
    editions: {
      english: {
        label: "English",
        languageCode: "en",
        available: true,
        formatLabel: "English Edition",
        cover: {
          eyebrow: "Coming Soon",
          subtitle: "English edition",
        },
        sampleId: null,
        purchaseLinks: {},
      },
      hindi: {
        label: "हिन्दी",
        languageCode: "hi",
        available: false,
        formatLabel: "Hindi Edition",
        cover: {
          eyebrow: "Coming Soon",
          subtitle: "हिन्दी संस्करण",
        },
        sampleId: null,
        purchaseLinks: {},
      },
    },
  },
  {
    id: "lessons-of-the-heart",
    title: "Lessons of the Heart",
    subtitle:
      "A reflective collection centered on compassion, resilience, and the everyday courage required to begin again.",
    description:
      "A reflective collection of stories about healing, compassion, and everyday courage.",
    status: "Coming Soon",
    slug: "lessons-of-the-heart",
    seo: {
      title: "Lessons of the Heart | Anurag Verma",
      description:
        "Read about Lessons of the Heart, an upcoming book by Anurag Verma exploring healing, empathy, and emotional resilience.",
    },
    synopsis: [
      "Lessons of the Heart brings together emotionally grounded reflections on how people endure, soften, and rebuild themselves in the wake of change.",
      "Across intimate moments and carefully observed experiences, the book considers how compassion and courage are often formed in the smallest decisions rather than in grand declarations.",
    ],
    discoveries: [
      "Stories that reflect the quiet bravery hidden inside ordinary life.",
      "A thoughtful exploration of healing that values gentleness as much as strength.",
      "An invitation to notice empathy, patience, and emotional resilience in daily experience.",
    ],
    reviews: [],
    editions: {
      english: {
        label: "English",
        languageCode: "en",
        available: true,
        formatLabel: "English Edition",
        cover: {
          eyebrow: "Coming Soon",
          subtitle: "English edition",
        },
        sampleId: null,
        purchaseLinks: {},
      },
      hindi: {
        label: "हिन्दी",
        languageCode: "hi",
        available: false,
        formatLabel: "Hindi Edition",
        cover: {
          eyebrow: "Coming Soon",
          subtitle: "हिन्दी संस्करण",
        },
        sampleId: null,
        purchaseLinks: {},
      },
    },
  },
];

export function getBookById(bookId) {
  return books.find((book) => book.id === bookId) || null;
}

export function getRelatedBooks(currentBookId, limit = 2) {
  return books.filter((book) => book.id !== currentBookId).slice(0, limit);
}

export default books;