const configuredSiteUrl = (import.meta.env.VITE_SITE_URL || "https://anurag-author-website.vercel.app/").trim();

const siteConfig = {
  siteName: "Anurag Verma",
  tagline: "Author, storyteller, and voice for meaningful words",
  defaultTitle: "Anurag Verma | Author",
  defaultDescription: "Official website of author Anurag Verma.",
  url: configuredSiteUrl.replace(/\/+$/, ""),
};

export default siteConfig;
