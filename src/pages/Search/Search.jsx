import "./Search.css";

import { useMemo, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import { blogPosts } from "../../data/blog";
import books from "../../data/books";
import siteConfig from "../../data/siteConfig";

function Search() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredBooks = useMemo(() => {
    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.subtitle.toLowerCase().includes(normalizedQuery) ||
        book.themes.join(" ").toLowerCase().includes(normalizedQuery) ||
        book.genres.join(" ").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      return blogPosts;
    }

    return blogPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  return (
    <HelmetProvider>
      <SEO
        title="Search | Anurag Verma"
        description="Search books and essays by Anurag Verma across themes, genres, and reflections."
        canonicalUrl={`${siteConfig.url}/search`}
        openGraph={{
          title: "Search | Anurag Verma",
          description: "Search books and essays by Anurag Verma across themes, genres, and reflections.",
          type: "website",
          url: `${siteConfig.url}/search`,
        }}
      />

      <main className="search-page">
        <section className="search-page__hero" aria-labelledby="search-title">
          <Container>
            <SectionHeader
              titleId="search-title"
              eyebrow="Search"
              title="Find the chapter you need right now"
              description="Search across books and essays by title, theme, genre, or reflection."
              align="left"
            />

            <label htmlFor="search-input" className="search-page__label">
              Search Books and Blog
            </label>
            <input
              id="search-input"
              className="search-page__input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: healing, love, goodbye, memoir"
            />
          </Container>
        </section>

        <section className="search-page__results" aria-labelledby="search-books-title">
          <Container>
            <h2 id="search-books-title" className="search-page__section-title">
              Books
            </h2>
            <div className="search-page__grid" role="list" aria-label="Search books results">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <article key={book.id} className="search-page__card" role="listitem">
                    <p className="search-page__meta">{book.status}</p>
                    <h3>{book.title}</h3>
                    <p>{book.shortDescription}</p>
                    <Link to={`/library/${book.id}`} className="search-page__link">
                      Open Book
                    </Link>
                  </article>
                ))
              ) : (
                <p className="search-page__empty">No books matched your search.</p>
              )}
            </div>
          </Container>
        </section>

        <section className="search-page__results" aria-labelledby="search-blog-title">
          <Container>
            <h2 id="search-blog-title" className="search-page__section-title">
              Blog
            </h2>
            <div className="search-page__grid" role="list" aria-label="Search blog results">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article key={post.id} className="search-page__card" role="listitem">
                    <p className="search-page__meta">{post.category}</p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <Link to="/blog" className="search-page__link">
                      Read in Blog
                    </Link>
                  </article>
                ))
              ) : (
                <p className="search-page__empty">No blog posts matched your search.</p>
              )}
            </div>
          </Container>
        </section>
      </main>
    </HelmetProvider>
  );
}

export default Search;
