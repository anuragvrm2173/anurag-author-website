const books = [
  {
    id: "the-last-goodbye",
    title: "The Last Goodbye I Never Got",
    description:
      "A quiet, intimate story of love, loss, and the difficult grace of moving forward.",
    status: "Published",
    slug: "the-last-goodbye-i-never-got",
    editions: {
      english: { label: "English", available: true },
      hindi: { label: "हिन्दी", available: true },
    },
    sampleId: "lastGoodbye-en",
  },
  {
    id: "the-untold-stories",
    title: "The Untold Stories Behind The Last Goodbye I Never Got",
    description:
      "A deeper look into the people, places, and memories that shaped the original story.",
    status: "Coming Soon",
    slug: "the-untold-stories",
    editions: {
      english: { label: "English", available: true },
      hindi: { label: "हिन्दी", available: false },
    },
  },
  {
    id: "lessons-of-the-heart",
    title: "Lessons of the Heart",
    description:
      "A reflective collection of stories about healing, compassion, and everyday courage.",
    status: "Coming Soon",
    slug: "lessons-of-the-heart",
    editions: {
      english: { label: "English", available: true },
      hindi: { label: "हिन्दी", available: false },
    },
  },
];

export default books;