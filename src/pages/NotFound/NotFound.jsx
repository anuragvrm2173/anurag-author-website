import "./NotFound.css";

import { HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import siteConfig from "../../data/siteConfig";

function NotFound() {
  return (
    <HelmetProvider>
      <SEO
        title="Page Not Found | Anurag Verma"
        description="The page you are looking for could not be found."
        canonicalUrl={`${siteConfig.url}/not-found`}
        openGraph={{
          title: "Page Not Found | Anurag Verma",
          description: "The page you are looking for could not be found.",
          type: "website",
          url: `${siteConfig.url}/not-found`,
          image: `${siteConfig.url}/og/search.svg`,
        }}
        noindex
      />

      <main className="not-found-page">
        <Container>
          <section className="not-found-page__card" aria-labelledby="not-found-title">
            <p className="not-found-page__eyebrow">404</p>
            <h1 id="not-found-title" className="not-found-page__title">
              Every story has a missing page.
            </h1>
            <p className="not-found-page__text">It seems this page has become one of the stories that got away.</p>
            <Link to="/" className="not-found-page__link">
              Return Home
            </Link>
          </section>
        </Container>
      </main>
    </HelmetProvider>
  );
}

export default NotFound;
