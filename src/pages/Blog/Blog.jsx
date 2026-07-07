import "./Blog.css";

import { HelmetProvider } from "react-helmet-async";

import BlogGrid from "../../components/blog/BlogGrid/BlogGrid";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import { blogPosts } from "../../data/blog";
import siteConfig from "../../data/siteConfig";

function Blog() {
  return (
    <HelmetProvider>
      <SEO
        title="Blog | Anurag Verma"
        description="Read reflective essays and writing notes from Anurag Verma on love, loss, healing, and personal growth."
        canonicalUrl={`${siteConfig.url}/blog`}
        openGraph={{
          title: "Blog | Anurag Verma",
          description:
            "Read reflective essays and writing notes from Anurag Verma on love, loss, healing, and personal growth.",
          type: "website",
          url: `${siteConfig.url}/blog`,
        }}
      />

      <main className="blog-page">
        <section className="blog-page__hero" aria-labelledby="blog-page-title">
          <Container>
            <SectionHeader
              titleId="blog-page-title"
              eyebrow="Blog"
              title="Notes from the quiet spaces between chapters"
              description="These essays are where memory becomes language and reflection becomes a way forward."
              align="left"
            />
          </Container>
        </section>

        <section className="blog-page__list">
          <Container>
            <BlogGrid posts={blogPosts} />
          </Container>
        </section>
      </main>
    </HelmetProvider>
  );
}

export default Blog;
