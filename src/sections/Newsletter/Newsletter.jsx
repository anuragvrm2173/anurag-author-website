import "./Newsletter.css";

import { useState } from "react";

import CaptchaChallenge from "../../components/common/CaptchaChallenge/CaptchaChallenge";
import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container/Container";
import { isCaptchaEnabled } from "../../services/captchaService";
import { subscribeToNewsletter } from "../../services/newsletterService";

function Newsletter({ source = "Homepage" }) {
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaResetCounter, setCaptchaResetCounter] = useState(0);
  const isLoading = status === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const email = String(formData.get("email") || "").trim();
    if (!email) {
      return;
    }

    if (isCaptchaEnabled() && !captchaToken) {
      setStatus("error");
      setStatusMessage("Please complete the security check before subscribing.");
      setCaptchaError("Please complete the security check before subscribing.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");
    setCaptchaError("");
    try {
      const result = await subscribeToNewsletter(email, source, { captchaToken });
      formElement.reset();
      setStatus("success");
      setCaptchaToken("");
      setCaptchaResetCounter((current) => current + 1);
      if (result.delivered) {
        setStatusMessage("You are subscribed successfully. Welcome.");
      } else {
        setStatusMessage("You are on the list. We will finalize delivery as services recover.");
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage(error.message || "We couldn't subscribe you right now. Please try again.");
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

          <CaptchaChallenge
            onTokenChange={(token) => {
              setCaptchaToken(token);
              if (token) {
                setCaptchaError("");
              }
            }}
            resetCounter={captchaResetCounter}
            errorMessage={captchaError}
          />

          {status === "success" ? (
            <p className="newsletter__status newsletter__status--success" role="status">
              {statusMessage || "You are subscribed. Welcome."}
            </p>
          ) : null}

          {status === "error" ? (
            <p id="newsletter-status" className="newsletter__status newsletter__status--error" role="status">
              {statusMessage || "We couldn't subscribe you right now. This is usually a temporary issue. Please try again in a few moments, or contact me directly if the problem continues."}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export default Newsletter;
