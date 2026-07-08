import "./Search.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import useSiteSettings from "../../hooks/useSiteSettings";
import { getBlogPostPath, getBlogSearchText } from "../../data/blog";
import usePublicContent from "../../hooks/usePublicContent";

const RECENT_SEARCHES_KEY = "recent_searches";

function highlightText(text, query) {
  if (!query) {
    return text;
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "ig");
  const parts = String(text).split(regex);

  return parts.map((part, index) => (
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={`${part}-${index}`}>{part}</mark>
      : <span key={`${part}-${index}`}>{part}</span>
  ));
}

function Search() {
  const { books, blogPosts } = usePublicContent({ includeBooks: true, includeBlogPosts: true });
  const { siteConfig } = useSiteSettings();
  const [query, setQuery] = useState("");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const inputRef = useRef(null);

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/";

      if (isShortcut || isSlash) {
        event.preventDefault();
        setIsPaletteOpen(true);
      }

      if (event.key === "Escape") {
        setIsPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!normalizedQuery) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRecentSearches((current) => {
        const next = [normalizedQuery, ...current.filter((item) => item !== normalizedQuery)].slice(0, 8);
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
        return next;
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [normalizedQuery]);

  const filteredBooks = useMemo(() => {
    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(normalizedQuery) ||
        String(book.subtitle || "").toLowerCase().includes(normalizedQuery) ||
        (book.themes || []).join(" ").toLowerCase().includes(normalizedQuery) ||
        (book.genres || []).join(" ").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [books, normalizedQuery]);

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      return blogPosts;
    }

    return blogPosts.filter((post) => {
      return getBlogSearchText(post).includes(normalizedQuery);
    });
  }, [blogPosts, normalizedQuery]);

  const recentBooks = books.slice(0, 3);
  const recentBlogs = blogPosts.slice(0, 3);
  const hasNoResults = normalizedQuery && filteredBooks.length === 0 && filteredPosts.length === 0;

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
          image: `${siteConfig.url}/og/search.svg`,
        }}
      />

      <main className="search-page">
        {isPaletteOpen ? (
          <div className="search-page__palette" role="dialog" aria-modal="true" aria-label="Quick search" onClick={() => setIsPaletteOpen(false)}>
            <div className="search-page__palette-card" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className="search-page__palette-action"
                onClick={() => {
                  setIsPaletteOpen(false);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                Search books...
              </button>
              <button
                type="button"
                className="search-page__palette-action"
                onClick={() => {
                  setIsPaletteOpen(false);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                Search articles...
              </button>
            </div>
          </div>
        ) : null}

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
              ref={inputRef}
              className="search-page__input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: healing, love, goodbye, memoir"
            />

            {recentSearches.length > 0 ? (
              <div className="search-page__recent" aria-label="Recent searches">
                <p className="search-page__recent-label">Recent</p>
                <div className="search-page__recent-list">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="search-page__recent-item"
                      onClick={() => setQuery(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
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
                  <Link key={book.id} to={`/library/${book.id}`} className="search-page__card" role="listitem">
                    <p className="search-page__meta">{book.status}</p>
                    <h3>{highlightText(book.title, normalizedQuery)}</h3>
                    <p>{highlightText(book.shortDescription, normalizedQuery)}</p>
                    <span className="search-page__link">
                      Open Book
                    </span>
                  </Link>
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
                  <Link key={post.id} to={getBlogPostPath(post.id)} className="search-page__card" role="listitem">
                    <p className="search-page__meta">{post.category}</p>
                    <h3>{highlightText(post.title, normalizedQuery)}</h3>
                    <p>{highlightText(post.excerpt, normalizedQuery)}</p>
                    <span className="search-page__link">
                      Read in Blog
                    </span>
                  </Link>
                ))
              ) : (
                <p className="search-page__empty">No blog posts matched your search.</p>
              )}
            </div>
          </Container>
        </section>

        {!normalizedQuery ? (
          <section className="search-page__results" aria-labelledby="search-recent-books-title">
            <Container>
              <h2 id="search-recent-books-title" className="search-page__section-title">Recent Books</h2>
              <div className="search-page__grid" role="list" aria-label="Recent books">
                {recentBooks.map((book) => (
                  <Link key={book.id} to={`/library/${book.id}`} className="search-page__card" role="listitem">
                    <p className="search-page__meta">{book.status}</p>
                    <h3>{book.title}</h3>
                    <p>{book.shortDescription}</p>
                    <span className="search-page__link">Open Book</span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {!normalizedQuery ? (
          <section className="search-page__results" aria-labelledby="search-recent-blog-title">
            <Container>
              <h2 id="search-recent-blog-title" className="search-page__section-title">Recent Blogs</h2>
              <div className="search-page__grid" role="list" aria-label="Recent blogs">
                {recentBlogs.map((post) => (
                  <Link key={post.id} to={getBlogPostPath(post.id)} className="search-page__card" role="listitem">
                    <p className="search-page__meta">{post.category}</p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="search-page__link">Read in Blog</span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {hasNoResults ? (
          <section className="search-page__results" aria-labelledby="search-empty-title">
            <Container>
              <div className="search-page__illustration" role="img" aria-label="No results illustration">
                <span className="search-page__illustration-icon" aria-hidden="true">📚</span>
                <h2 id="search-empty-title" className="search-page__section-title">No Results Found</h2>
                <p className="search-page__empty">Try broader keywords or browse recent books and blog posts.</p>
              </div>
            </Container>
          </section>
        ) : null}
      </main>
    </HelmetProvider>
  );
}

export default Search;
