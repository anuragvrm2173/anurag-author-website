import "./Home.css";

import { HelmetProvider } from "react-helmet-async";

import Hero from "../../sections/Hero/Hero";
import FeaturedBooks from "../../sections/FeaturedBooks/FeaturedBooks";
import WritingPhilosophy from "../../sections/WritingPhilosophy/WritingPhilosophy";
import AboutPreview from "../../sections/AboutPreview/AboutPreview";
import Timeline from "../../sections/Timeline/Timeline";
import Reviews from "../../sections/Reviews/Reviews";
import Newsletter from "../../sections/Newsletter/Newsletter";
import SEO from "../../components/seo/SEO";
import siteConfig from "../../data/siteConfig";

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.siteName,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

function Home() {
  return (
    <HelmetProvider>
      <SEO
        title="Anurag Verma | Author"
        description="Official website of author Anurag Verma. Explore books, reviews, and essays on love, loss, healing, and personal growth."
        canonicalUrl={siteConfig.url}
        openGraph={{
          title: "Anurag Verma | Author",
          description: "Explore books, reviews, and essays on love, loss, healing, and personal growth.",
          type: "website",
          url: siteConfig.url,
        }}
        structuredData={websiteStructuredData}
      />

      <main className="home-page">
        <Hero />
        <FeaturedBooks />
        <WritingPhilosophy />
        <AboutPreview />
        <Timeline />
        <Reviews />
        <Newsletter source="Homepage" />
      </main>
    </HelmetProvider>
  );
}

export default Home;
