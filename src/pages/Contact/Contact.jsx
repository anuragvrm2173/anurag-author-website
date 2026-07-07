import "./Contact.css";

import { HelmetProvider } from "react-helmet-async";

import ContactForm from "../../components/forms/ContactForm/ContactForm";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import authorImage from "../../assets/images/author/author.jpg";
import siteConfig from "../../data/siteConfig";
import socialLinks from "../../data/socialLinks";

function Contact() {
  const contactChannels = socialLinks.filter((link) => link.active !== false);
  const inquiries = ["Media", "Collaborations", "Speaking", "General Questions"];

  return (
    <HelmetProvider>
      <SEO
        title="Contact | Anurag Verma"
        description="Reach out to Anurag Verma for reader messages, collaborations, and thoughtful literary conversations."
        canonicalUrl={`${siteConfig.url}/contact`}
        openGraph={{
          title: "Contact | Anurag Verma",
          description:
            "Reach out to Anurag Verma for reader messages, collaborations, and thoughtful literary conversations.",
          type: "website",
          url: `${siteConfig.url}/contact`,
        }}
      />

      <main className="contact-page">
        <section className="contact-page__hero" aria-labelledby="contact-page-title">
          <Container>
            <SectionHeader
              titleId="contact-page-title"
              eyebrow="Contact"
              title="If a story found you, I would be grateful to hear from you"
              description="Whether you are a reader, a creator, or someone standing at the edge of a difficult chapter, your words are welcome here."
              align="left"
            />
          </Container>
        </section>

        <section className="contact-page__content" aria-labelledby="contact-form-title">
          <Container>
            <div className="contact-page__grid">
              <div>
                <h2 id="contact-form-title" className="contact-page__section-title">
                  Send a Message
                </h2>
                <div className="contact-page__inquiries" aria-label="Inquiry categories">
                  {inquiries.map((item) => (
                    <span key={item} className="contact-page__inquiry-pill">{item}</span>
                  ))}
                </div>
                <p className="contact-page__note">
                  I read every message with care. Thank you for writing with sincerity.
                </p>
                <ContactForm />
              </div>

              <aside className="contact-page__aside" aria-labelledby="contact-channels-title">
                <div className="contact-page__author">
                  <img src={authorImage} alt="Anurag Verma portrait" loading="lazy" width="320" height="320" />
                  <p>Anurag Verma</p>
                </div>

                <h2 id="contact-channels-title" className="contact-page__section-title">
                  Other Ways to Connect
                </h2>

                <ul className="contact-page__channels">
                  {contactChannels.map((channel) => (
                    <li key={channel.id}>
                      <a
                        href={channel.url}
                        target={channel.external ? "_blank" : undefined}
                        rel={channel.external ? "noreferrer noopener" : undefined}
                        aria-label={`${channel.name} link`}
                      >
                        {channel.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </Container>
        </section>
      </main>
    </HelmetProvider>
  );
}

export default Contact;
