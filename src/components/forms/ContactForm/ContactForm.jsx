import Button from "../../ui/Button/Button";
import "./ContactForm.css";

function ContactForm() {
  return (
    <form className="contact-form" aria-label="Contact form" onSubmit={(event) => event.preventDefault()}>
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

      <Button type="submit">Send Message</Button>
    </form>
  );
}

export default ContactForm;