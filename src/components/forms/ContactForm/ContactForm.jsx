import { useState } from "react";

import { submitContactMessage } from "../../../services/contactService";
import Button from "../../ui/Button/Button";
import "./ContactForm.css";

function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setStatusMessage("");

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const result = await submitContactMessage(payload);
      formElement.reset();
      setStatus("success");
      if (result.delivered) {
        setStatusMessage("Your message was sent successfully. Thank you for reaching out.");
      } else {
        setStatusMessage("Your message was saved successfully. Delivery will retry shortly.");
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage(error.message || "Something went wrong. Please try again.");
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
          {statusMessage || "Your message was sent successfully."}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="contact-form__status contact-form__status--error" role="alert">
          {statusMessage || "Something went wrong. Please try again."}
        </p>
      ) : null}
    </form>
  );
}

export default ContactForm;