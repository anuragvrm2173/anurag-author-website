import "./Blog.css";

import { HelmetProvider } from "react-helmet-async";

import BlogGrid from "../../components/blog/BlogGrid/BlogGrid";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import useSiteSettings from "../../hooks/useSiteSettings";
import usePublicContent from "../../hooks/usePublicContent";

function Blog() {
  const { blogPosts } = usePublicContent({ includeBooks: false, includeBlogPosts: true });
  const { siteConfig } = useSiteSettings();
  const [featuredArticle, ...latestArticles] = blogPosts;
  const categoryMap = blogPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {});

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
          image: `${siteConfig.url}/og/blog.svg`,
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

        <section className="blog-page__featured" aria-labelledby="blog-featured-title">
          <Container>
            <h2 id="blog-featured-title" className="blog-page__section-title">Featured Article</h2>
            {featuredArticle ? <BlogGrid posts={[featuredArticle]} compact /> : null}
          </Container>
        </section>

        <section className="blog-page__list" aria-labelledby="blog-latest-title">
          <Container>
            <h2 id="blog-latest-title" className="blog-page__section-title">Latest Articles</h2>
            <BlogGrid posts={latestArticles} />
          </Container>
        </section>

        <section className="blog-page__categories" aria-labelledby="blog-categories-title">
          <Container>
            <h2 id="blog-categories-title" className="blog-page__section-title">Browse by Category</h2>
            <div className="blog-page__category-grid" role="list" aria-label="Blog categories">
              {Object.entries(categoryMap).map(([category, posts]) => (
                <article key={category} className="blog-page__category-card" role="listitem">
                  <h3>{category}</h3>
                  <p>{posts.length} article{posts.length > 1 ? "s" : ""}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </HelmetProvider>
  );
}

export default Blog;
