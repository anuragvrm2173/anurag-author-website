import { useState } from "react";

import Button from "../../ui/Button/Button";
import "./ContactForm.css";

const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/vanuragverma2173@gmail.com";

function ContactForm() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      _subject: "Contact Form Submission",
    };

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      event.currentTarget.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <form className="contact-form" aria-label="Contact form" onSubmit={handleSubmit}>
      <div className="contact-form__field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows="6" required />
      </div>

      <Button type="submit">{status === "loading" ? "Sending..." : "Send Message"}</Button>

      {status === "success" ? (
        <p className="contact-form__status contact-form__status--success" role="status">
          Your message was sent successfully.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="contact-form__status contact-form__status--error" role="alert">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}

export default ContactForm;