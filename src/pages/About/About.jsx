import { HelmetProvider } from "react-helmet-async";

import AuthorProfile from "../../components/about/AuthorProfile";
import ReaderConnection from "../../components/about/ReaderConnection";
import WritingFocus from "../../components/about/WritingFocus";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import authorImage from "../../assets/images/author/author.jpg";
import siteConfig from "../../data/siteConfig";
import socialLinks from "../../data/socialLinks";
import Newsletter from "../../sections/Newsletter/Newsletter";
import Timeline from "../../sections/Timeline/Timeline";

import "./About.css";

const writingThemes = [
  "Love that changes us",
  "Loss that teaches us",
  "Healing that takes time",
  "Personal growth born from difficult moments",
  "The quiet lessons hidden inside ordinary life",
];

const writingPhilosophyParagraphs = [
  "Some stories begin with imagination.",
  "Mine began with memories.",
  "I don't write to tell readers what to feel.",
  "I write so they discover feelings they've carried for years.",
];

const readingStats = [
  { label: "Books Published", value: "2" },
  { label: "Languages", value: "2" },
  { label: "Readers", value: "Growing Every Day" },
  { label: "Current Project", value: "Lessons of the Heart" },
];

const readerConnectionParagraphs = [
  "People don't read my books because I have all the answers.",
  "They read because the stories feel honest.",
  "If you've ever struggled to let go, searched for meaning after loss, or wondered how to begin again, these books were written with people like you in mind.",
  "My goal isn't simply to tell stories.",
  "It's to leave you with something you'll carry long after you've turned the final page.",
];

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anurag Verma",
  jobTitle: "Author",
  nationality: "Indian",
  description:
    "Anurag Verma is an Indian author whose books explore love, loss, healing, and personal growth through deeply human stories.",
  homeLocation: {
    "@type": "Country",
    name: "India",
  },
  sameAs: socialLinks.filter((link) => link.active !== false).map((link) => link.url),
};

function About() {
  return (
    <HelmetProvider>
      <SEO
        title="The Story Behind the Words | Anurag Verma"
        description="Learn about Indian author Anurag Verma, his writing journey, philosophy, and the stories behind his books on love, loss, healing, and personal growth."
        canonicalUrl={`${siteConfig.url}/about`}
        openGraph={{
          title: "The Story Behind the Words | Anurag Verma",
          description:
            "Learn about Indian author Anurag Verma, his writing journey, philosophy, and the stories behind his books on love, loss, healing, and personal growth.",
          type: "profile",
          url: `${siteConfig.url}/about`,
        }}
        structuredData={personStructuredData}
      />

      <main className="about-page">
        <section className="about-hero" aria-labelledby="about-hero-title">
          <Container>
            <SectionHeader
              titleId="about-hero-title"
              eyebrow="About"
              title="The Story Behind the Words"
              description="Every story begins somewhere. Mine began with ordinary moments that quietly changed everything. The books I write are shaped by love, loss, healing, and the belief that even life's hardest chapters can leave us with hope."
              align="left"
            />
          </Container>
        </section>

        <AuthorProfile
          name="Anurag Verma"
          occupation="Author"
          authorImage={authorImage}
          writingThemes={["Love", "Loss", "Healing", "Hope"]}
          shortBio="Anurag Verma is an Indian author whose books explore love, loss, healing, and personal growth through deeply human stories. Drawing from real-life experiences, he writes with honesty and emotional depth, creating books that help readers find hope, resilience, and meaning in life's most difficult moments."
          longBio="Anurag Verma is an Indian author who believes that the most powerful stories are often the ones we live ourselves. His writing explores the emotional realities of love, grief, healing, and personal growth, transforming lived experiences into stories that feel deeply personal yet universally relatable. Rather than offering easy answers, his books invite readers to reflect, heal, and discover strength within their own journeys. His debut book, The Last Goodbye I Never Got, was published on 6 July 2026 and introduced readers to an intimate story of love, loss, and the echoes that remain long after goodbye. Building on that foundation, he continues to write books that blend memoir, storytelling, and thoughtful reflection-encouraging readers to embrace vulnerability, rediscover hope, and find meaning even in life's hardest chapters. Anurag's goal is simple: to create books that stay with readers long after the final page, offering comfort, perspective, and the reminder that even our deepest wounds can become the beginning of something stronger."
          basedIn="India"
        />

        <section className="about-philosophy" aria-labelledby="about-philosophy-title">
          <Container>
            <h2 id="about-philosophy-title" className="about-story__title">Why I Write</h2>
            <div className="about-philosophy__content">
              {writingPhilosophyParagraphs.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Container>
        </section>

        <WritingFocus
          title="Writing Themes"
          intro="I write emotionally driven books that explore:"
          themes={writingThemes}
          outro="My writing blends memoir, storytelling, and reflection-not to tell readers what to think, but to help them see their own lives a little differently."
        />

        <ReaderConnection title="Why Readers Connect" paragraphs={readerConnectionParagraphs} />

        <Timeline />

        <section className="about-stats" aria-labelledby="about-stats-title">
          <Container>
            <h2 id="about-stats-title" className="about-story__title">Reading Statistics</h2>
            <div className="about-stats__grid" role="list" aria-label="Author reading statistics">
              {readingStats.map((item) => (
                <article key={item.label} className="about-stats__card" role="listitem">
                  <p className="about-stats__label">{item.label}</p>
                  <p className="about-stats__value">{item.value}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="about-quote" aria-label="Author quote">
          <Container>
            <blockquote className="about-quote__text">
              "I write so a reader can meet an old feeling,
              <br />
              forgive it,
              <br />
              and leave lighter than they arrived."
            </blockquote>
          </Container>
        </section>

        <Newsletter source="About" />
      </main>
    </HelmetProvider>
  );
}

export default About;
