import "./WritingPhilosophy.css";

import Container from "../../components/ui/Container/Container";

function WritingPhilosophy() {
  return (
    <section className="writing-philosophy" aria-labelledby="writing-philosophy-title">
      <Container>
        <div className="writing-philosophy__content">
          <p className="writing-philosophy__eyebrow">Writing Philosophy</p>
          <h2 id="writing-philosophy-title" className="writing-philosophy__title">
            Writing with clarity, tenderness, and intention.
          </h2>
          <p className="writing-philosophy__text">
            Anurag Verma believes stories should not merely be read; they should be felt,
            remembered, and carried forward. Every book is shaped by honesty, discipline,
            and a deep respect for the quiet truths of human experience.
          </p>
          <blockquote className="writing-philosophy__quote">
            “The most lasting stories are the ones that make space for reflection.”
          </blockquote>
        </div>
      </Container>
    </section>
  );
}

export default WritingPhilosophy;
