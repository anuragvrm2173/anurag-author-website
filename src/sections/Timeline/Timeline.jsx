import "./Timeline.css";

import Container from "../../components/ui/Container/Container";
import { timeline } from "../../data/timeline";

function Timeline() {
  return (
    <section className="timeline" aria-labelledby="timeline-title">
      <Container>
        <div className="timeline__header">
          <p className="timeline__eyebrow">Writing Journey</p>
          <h2 id="timeline-title" className="timeline__title">
            The chapters shaping every story I write.
          </h2>
        </div>

        <div className="timeline__list" role="list">
          {timeline.map((item, index) => (
            <article className="timeline__item" key={`${item.year}-${item.title}`} role="listitem">
              <div className="timeline__marker" aria-hidden="true">✦</div>
              <div className="timeline__year">{item.year}</div>
              <div className="timeline__content" style={{ animationDelay: `${index * 120}ms` }}>
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
