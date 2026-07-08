function envOrFallback(key, fallback) {
  return (import.meta.env[key] || fallback).trim();
}

const socialLinks = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    url: envOrFallback("VITE_SOCIAL_INSTAGRAM_URL", "https://instagram.com/anuragvrm2173"),
    external: true,
    active: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "youtube",
    url: envOrFallback("VITE_SOCIAL_YOUTUBE_URL", "https://youtube.com/@anuragvermavlog"),
    external: true,
    active: true,
  },
  {
    id: "amazon-author",
    name: "Amazon Author",
    icon: "amazon",
    url: envOrFallback("VITE_SOCIAL_AMAZON_AUTHOR_URL", "https://amazon.in/stores/Anurag-Verma/author/B0H7PH8QW4"),
    external: true,
    active: true,
  },
  {
    id: "goodreads",
    name: "Goodreads",
    icon: "goodreads",
    url: envOrFallback("VITE_SOCIAL_GOODREADS_URL", "https://goodreads.com/anuragvrm2173"),
    external: true,
    active: true,
  },
  {
    id: "email",
    name: "Email",
    icon: "email",
    url: envOrFallback("VITE_CONTACT_EMAIL_URL", "mailto:vanuragverma2173@gmail.com"),
    external: false,
    active: true,
  },
];

export default socialLinks;
