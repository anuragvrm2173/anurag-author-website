import "./Reviews.css";

import { HelmetProvider } from "react-helmet-async";

import ReviewCard from "../../components/reviews/ReviewCard/ReviewCard";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import books from "../../data/books";
import { getFeaturedReviews, getReviewGroupsByBook } from "../../data/reviews";
import siteConfig from "../../data/siteConfig";

function Reviews() {
  const featuredReviews = getFeaturedReviews(3);
  const groupedReviews = getReviewGroupsByBook(books);

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
            <h2 id="reviews-featured-title" className="reviews-page__section-title">
              Featured Reader Voices
            </h2>

            <div className="reviews-page__grid" role="list" aria-label="Featured reader reviews">
              {featuredReviews.map((review) => (
                <div key={review.id} role="listitem">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </Container>
        </section>

        {groupedReviews.map((group) => (
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
        ))}
      </main>
    </HelmetProvider>
  );
}

export default Reviews;
