import Container from "../ui/Container/Container";

function ReaderConnection({ title, paragraphs }) {
  return (
    <section className="about-reader-connection" aria-labelledby="about-reader-connection-title">
      <Container>
        <div className="about-reader-connection__inner">
          <h2 id="about-reader-connection-title" className="about-reader-connection__title">
            {title}
          </h2>

          <div className="about-reader-connection__content">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ReaderConnection;