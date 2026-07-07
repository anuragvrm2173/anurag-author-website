import "./Timeline.css";

import Container from "../../components/ui/Container/Container";

function Timeline() {
  const milestones = [
    { year: "2014", title: "First Published Essay", text: "A debut into literary publishing and personal storytelling." },
    { year: "2018", title: "Writing as Discipline", text: "Committed to a sustained practice of reflection and craft." },
    { year: "2022", title: "Authorial Breakthrough", text: "Developed the voice that would shape later works and memoirs." },
    { year: "2026", title: "Official Author Website", text: "A dedicated home for books, writing, and public conversation." },
  ];

  return (
    <section className="timeline" aria-labelledby="timeline-title">
      <Container>
        <div className="timeline__header">
          <p className="timeline__eyebrow">Writing Journey</p>
          <h2 id="timeline-title" className="timeline__title">
            A career shaped by patience, craft, and conviction.
          </h2>
        </div>

        <div className="timeline__list" role="list">
          {milestones.map((item) => (
            <article className="timeline__item" key={item.year} role="listitem">
              <div className="timeline__year">{item.year}</div>
              <div className="timeline__content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Timeline;
