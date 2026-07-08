import "./Newsletter.css";

import { useState } from "react";

import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container/Container";
import { subscribeToNewsletter } from "../../services/newsletterService";

function Newsletter({ source = "Homepage" }) {
  const [status, setStatus] = useState("idle");
  const isLoading = status === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    if (!email) {
      return;
    }

    setStatus("loading");
    try {
      await subscribeToNewsletter(email, source);
      event.currentTarget.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <Container>
        <div className="newsletter__card">
          <div className="newsletter__content">
            <p className="newsletter__eyebrow">Stay Connected</p>
            <h2 id="newsletter-title" className="newsletter__title">
              Receive new stories before they're published.
            </h2>
            <p className="newsletter__description">
              Join my readers for thoughtful updates, behind-the-scenes notes, and first access to new work.
            </p>
          </div>

          <form className="newsletter__form" onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="newsletter-email">
              Email address
            </label>
            <input id="newsletter-email" name="email" type="email" placeholder="Email address" required disabled={isLoading} aria-describedby={status === "error" ? "newsletter-status" : undefined} />
            <Button type="submit" disabled={isLoading}>{isLoading ? "Joining..." : "Join my readers"}</Button>
          </form>

          {status === "success" ? (
            <p className="newsletter__status newsletter__status--success" role="status">
              You are subscribed. Welcome.
            </p>
          ) : null}

          {status === "error" ? (
            <p id="newsletter-status" className="newsletter__status newsletter__status--error" role="status">
              We couldn't subscribe you right now. This is usually a temporary issue. Please try again in a few moments, or contact me directly if the problem continues.
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export default Newsletter;
