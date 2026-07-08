import "./Terms.css";

import { HelmetProvider } from "react-helmet-async";

import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import useSiteSettings from "../../hooks/useSiteSettings";

function Terms() {
  const { siteConfig } = useSiteSettings();

  return (
    <HelmetProvider>
      <SEO
        title="Terms of Use | Anurag Verma"
        description="Read the terms of use for the official website of author Anurag Verma."
        canonicalUrl={`${siteConfig.url}/terms`}
        openGraph={{
          title: "Terms of Use | Anurag Verma",
          description: "Read the terms of use for the official website of author Anurag Verma.",
          type: "website",
          url: `${siteConfig.url}/terms`,
          image: `${siteConfig.url}/og/about.svg`,
        }}
      />

      <main className="terms-page">
        <section className="terms-page__hero" aria-labelledby="terms-title">
          <Container>
            <SectionHeader
              titleId="terms-title"
              eyebrow="Legal"
              title="Terms of Use"
              description="By using this website, you agree to the terms below."
              align="left"
            />
          </Container>
        </section>

        <section className="terms-page__content" aria-label="Terms details">
          <Container>
            <article className="terms-page__card">
              <h2>Use of Content</h2>
              <p>
                All original writing, branding, and published material on this website is protected intellectual
                property and may not be copied or redistributed without permission.
              </p>

              <h2>Acceptable Use</h2>
              <p>
                You agree not to misuse the website, interfere with site functionality, or attempt unauthorized access
                to systems or data.
              </p>

              <h2>External Links</h2>
              <p>
                This website may link to external platforms such as retailers and social networks. We are not
                responsible for third-party content or privacy practices.
              </p>

              <h2>Disclaimer</h2>
              <p>
                Content is provided for informational and literary purposes. Availability of books, editions, and
                purchase links may change over time.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, the website owner is not liable for indirect or consequential
                damages related to use of this site.
              </p>

              <h2>Changes to Terms</h2>
              <p>
                Terms may be revised periodically. Continued use of the website constitutes acceptance of any updates.
              </p>
            </article>
          </Container>
        </section>
      </main>
    </HelmetProvider>
  );
}

export default Terms;
