import "./Privacy.css";

import { HelmetProvider } from "react-helmet-async";

import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import siteConfig from "../../data/siteConfig";

function Privacy() {
  return (
    <HelmetProvider>
      <SEO
        title="Privacy Policy | Anurag Verma"
        description="Read the privacy policy for the official website of author Anurag Verma."
        canonicalUrl={`${siteConfig.url}/privacy`}
        openGraph={{
          title: "Privacy Policy | Anurag Verma",
          description: "Read the privacy policy for the official website of author Anurag Verma.",
          type: "website",
          url: `${siteConfig.url}/privacy`,
          image: `${siteConfig.url}/og/about.svg`,
        }}
      />

      <main className="privacy-page">
        <section className="privacy-page__hero" aria-labelledby="privacy-title">
          <Container>
            <SectionHeader
              titleId="privacy-title"
              eyebrow="Legal"
              title="Privacy Policy"
              description="Your trust matters. This page explains what data is collected and how it is handled."
              align="left"
            />
          </Container>
        </section>

        <section className="privacy-page__content" aria-label="Privacy policy details">
          <Container>
            <article className="privacy-page__card">
              <h2>Information We Collect</h2>
              <p>
                We collect information you choose to share, such as your name, email address, and message when you
                contact us or subscribe to updates.
              </p>

              <h2>How Information Is Used</h2>
              <p>
                Your information is used to respond to messages, share requested updates, and improve the reading
                experience on this website.
              </p>

              <h2>Cookies and Analytics</h2>
              <p>
                Basic analytics and cookies may be used to understand site performance and visitor behavior. No
                sensitive personal data is sold.
              </p>

              <h2>Data Security</h2>
              <p>
                Reasonable technical and organizational steps are taken to protect your information from unauthorized
                access.
              </p>

              <h2>Your Rights</h2>
              <p>
                You may request access, correction, or deletion of your personal information by contacting the email
                listed on the Contact page.
              </p>

              <h2>Policy Updates</h2>
              <p>
                This policy may be updated to reflect legal or operational changes. Continued use of the website means
                acceptance of the updated policy.
              </p>
            </article>
          </Container>
        </section>
      </main>
    </HelmetProvider>
  );
}

export default Privacy;
