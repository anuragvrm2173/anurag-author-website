import Container from "../ui/Container/Container";

function StorySection({ title, paragraphs }) {
  return (
    <section className="about-story" aria-labelledby="about-story-title">
      <Container>
        <div className="about-story__inner">
          <h2 id="about-story-title" className="about-story__title">
            {title}
          </h2>

          <div className="about-story__content">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default StorySection;