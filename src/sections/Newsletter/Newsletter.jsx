import "./Newsletter.css";

import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container/Container";

function Newsletter() {
  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <Container>
        <div className="newsletter__card">
          <div className="newsletter__content">
            <p className="newsletter__eyebrow">Stay Connected</p>
            <h2 id="newsletter-title" className="newsletter__title">
              Receive updates on new releases and literary reflections.
            </h2>
            <p className="newsletter__description">
              Join the newsletter for thoughtful updates, behind-the-scenes notes, and first access to new work.
            </p>
          </div>

          <form className="newsletter__form">
            <label className="visually-hidden" htmlFor="newsletter-email">
              Email address
            </label>
            <input id="newsletter-email" type="email" placeholder="Email address" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </Container>
    </section>
  );
}

export default Newsletter;
