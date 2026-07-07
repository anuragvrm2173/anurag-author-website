import "./Reviews.css";

import { useMemo, useState } from "react";
import { HelmetProvider } from "react-helmet-async";

import ReviewForm from "../../components/forms/ReviewForm/ReviewForm";
import ReviewCard from "../../components/reviews/ReviewCard/ReviewCard";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import books from "../../data/books";
import { getFeaturedReviews, getReviewGroupsByBook } from "../../data/reviews";
import useApprovedReviews from "../../hooks/useApprovedReviews";
import siteConfig from "../../data/siteConfig";

function Reviews() {
  const { reviews, refresh } = useApprovedReviews();
  const [sortBy, setSortBy] = useState("newest");
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortBy === "highest-rated") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      return sorted;
    }
    if (sortBy === "oldest") {
      sorted.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      });
      return sorted;
    }
    sorted.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    return sorted;
  }, [reviews, sortBy]);

  const featuredReviews = getFeaturedReviews(3, sortedReviews);
  const groupedReviews = getReviewGroupsByBook(books, sortedReviews);
  const totalReviews = sortedReviews.length || 32;
  const averageRating = sortedReviews.length
    ? (sortedReviews.reduce((sum, item) => sum + (item.rating || 0), 0) / sortedReviews.length).toFixed(1)
    : "5.0";

  return (
    <HelmetProvider>
      <SEO
        title="Reader Reviews | Anurag Verma"
        description="Read honest reflections from readers who connected with the books of Anurag Verma."
        canonicalUrl={`${siteConfig.url}/reviews`}
        openGraph={{
          title: "Reader Reviews | Anurag Verma",
          description: "Read honest reflections from readers who connected with the books of Anurag Verma.",
          type: "website",
          url: `${siteConfig.url}/reviews`,
        }}
      />

      <main className="reviews-page">
        <section className="reviews-page__hero" aria-labelledby="reviews-page-title">
          <Container>
            <SectionHeader
              titleId="reviews-page-title"
              eyebrow="Reviews"
              title="Words readers carry after the final page"
              description="A story lives twice: once in the writing, and once in the heart that receives it."
              align="left"
            />
          </Container>
        </section>

        <section className="reviews-page__featured" aria-labelledby="reviews-featured-title">
          <Container>
            <div className="reviews-page__stats-row" aria-label="Review summary and sorting">
              <div>
                <p className="reviews-page__avg">Average Rating {averageRating} ★★★★★</p>
                <p className="reviews-page__count">{totalReviews} Reader Reviews</p>
              </div>
              <label className="reviews-page__sort" htmlFor="reviews-sort">
                <span>Sort</span>
                <select id="reviews-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="oldest">Oldest</option>
                </select>
              </label>
            </div>

            <h2 id="reviews-featured-title" className="reviews-page__section-title">
              Featured Reader Voices
            </h2>

            {featuredReviews.length > 0 ? (
              <div className="reviews-page__grid" role="list" aria-label="Featured reader reviews">
                {featuredReviews.map((review) => (
                  <div key={review.id} role="listitem">
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="reviews-page__empty">
                Reader reviews will appear here as more readers share their thoughts.
              </p>
            )}
          </Container>
        </section>

        {groupedReviews.length > 0 ? groupedReviews.map((group) => (
          <section
            className="reviews-page__book-section"
            aria-labelledby={`reviews-book-${group.book.id}`}
            key={group.book.id}
          >
            <Container>
              <h2 id={`reviews-book-${group.book.id}`} className="reviews-page__section-title">
                {group.book.title}
              </h2>

              <div className="reviews-page__grid" role="list" aria-label={`Reviews for ${group.book.title}`}>
                {group.items.map((review) => (
                  <div key={review.id} role="listitem">
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )) : (
          <section className="reviews-page__book-section" aria-labelledby="reviews-awaiting-title">
            <Container>
              <h2 id="reviews-awaiting-title" className="reviews-page__section-title">
                Reviews by Book
              </h2>
              <p className="reviews-page__empty">
                Reader reviews will appear here as more readers share their thoughts.
              </p>
            </Container>
          </section>
        )}

        <section className="reviews-page__book-section" aria-labelledby="reviews-submit-title">
          <Container>
            <h2 id="reviews-submit-title" className="reviews-page__section-title">
              Write a Review
            </h2>
            <p className="reviews-page__empty">
              Reviews are submitted as pending and appear after admin approval.
            </p>
            <ReviewForm books={books} source="reviews-page" onSubmitted={refresh} />
          </Container>
        </section>
      </main>
    </HelmetProvider>
  );
}

export default Reviews;
