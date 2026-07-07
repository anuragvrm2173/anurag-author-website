import { HelmetProvider } from "react-helmet-async";

import AuthorProfile from "../../components/about/AuthorProfile";
import ReaderConnection from "../../components/about/ReaderConnection";
import SocialLinks from "../../components/about/SocialLinks";
import StorySection from "../../components/about/StorySection";
import WritingFocus from "../../components/about/WritingFocus";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import authorImage from "../../assets/images/author/author.jpg";
import siteConfig from "../../data/siteConfig";
import socialLinks from "../../data/socialLinks";
import { timeline } from "../../data/timeline";
import Newsletter from "../../sections/Newsletter/Newsletter";

import "../../sections/Timeline/Timeline.css";
import "./About.css";

const storyParagraphs = [
  "I'm Anurag Verma, an Indian author who writes about the moments that quietly change us-the love we remember, the goodbyes we never expected, and the strength we discover while learning to move forward.",
  "My books aren't written to offer perfect answers.",
  "They're written to remind you that you're not alone in the questions.",
  "Every story begins with something real. Sometimes it's loss. Sometimes it's hope. Most often, it's both.",
  "Whether you're healing, reflecting, or simply searching for a book that understands how life really feels, I hope you find a part of yourself somewhere in these pages.",
];

const writingThemes = [
  "Love that changes us",
  "Loss that teaches us",
  "Healing that takes time",
  "Personal growth born from difficult moments",
  "The quiet lessons hidden inside ordinary life",
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

        <StorySection title="The Story Behind the Words" paragraphs={storyParagraphs} />

        <section className="about-quote" aria-label="Author quote">
          <Container>
            <blockquote className="about-quote__text">
              I don't write because I have all the answers.
              <br />
              <br />
              I write because stories have always helped me understand the questions.
            </blockquote>
          </Container>
        </section>

        <WritingFocus
          title="What I Write"
          intro="I write emotionally driven books that explore:"
          themes={writingThemes}
          outro="My writing blends memoir, storytelling, and reflection-not to tell readers what to think, but to help them see their own lives a little differently."
        />

        <ReaderConnection title="Why Readers Connect" paragraphs={readerConnectionParagraphs} />

        <section className="timeline about-timeline" aria-labelledby="about-timeline-title">
          <Container>
            <div className="timeline__header">
              <p className="timeline__eyebrow">Writing Journey Timeline</p>
              <h2 id="about-timeline-title" className="timeline__title">
                The chapters that shaped this journey.
              </h2>
            </div>

            <div className="timeline__list" role="list" aria-label="Writing journey milestones">
              {timeline.map((item) => (
                <article className="timeline__item" key={`${item.year}-${item.title}`} role="listitem">
                  <div className="timeline__year">{item.year}</div>
                  <div className="timeline__content">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <AuthorProfile
          name="Anurag Verma"
          occupation="Author"
          authorImage={authorImage}
          writingThemes={["Love", "Loss", "Healing", "Hope"]}
          shortBio="Anurag Verma is an Indian author whose books explore love, loss, healing, and personal growth through deeply human stories. Drawing from real-life experiences, he writes with honesty and emotional depth, creating books that help readers find hope, resilience, and meaning in life's most difficult moments."
          longBio="Anurag Verma is an Indian author who believes that the most powerful stories are often the ones we live ourselves. His writing explores the emotional realities of love, grief, healing, and personal growth, transforming lived experiences into stories that feel deeply personal yet universally relatable. Rather than offering easy answers, his books invite readers to reflect, heal, and discover strength within their own journeys. His debut book, The Last Goodbye I Never Got, introduced readers to an intimate story of love, loss, and the echoes that remain long after goodbye. Building on that foundation, he continues to write books that blend memoir, storytelling, and thoughtful reflection-encouraging readers to embrace vulnerability, rediscover hope, and find meaning even in life's hardest chapters. Anurag's goal is simple: to create books that stay with readers long after the final page, offering comfort, perspective, and the reminder that even our deepest wounds can become the beginning of something stronger."
          basedIn="India"
        />

        <SocialLinks links={socialLinks} />

        <Newsletter />
      </main>
    </HelmetProvider>
  );
}

export default About;
