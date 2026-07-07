import Container from "../ui/Container/Container";

function WritingFocus({ title, intro, themes, outro }) {
  return (
    <section className="about-writing-focus" aria-labelledby="about-writing-focus-title">
      <Container>
        <div className="about-writing-focus__inner">
          <h2 id="about-writing-focus-title" className="about-writing-focus__title">
            {title}
          </h2>

          <p className="about-writing-focus__intro">{intro}</p>

          <div className="about-writing-focus__grid" role="list" aria-label="Writing themes">
            {themes.map((theme) => (
              <article key={theme} className="about-writing-focus__card" role="listitem">
                <p>{theme}</p>
              </article>
            ))}
          </div>

          <p className="about-writing-focus__outro">{outro}</p>
        </div>
      </Container>
    </section>
  );
}

export default WritingFocus;