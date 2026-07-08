import "./Contact.css";

import { HelmetProvider } from "react-helmet-async";
import { FaAmazon, FaEnvelope, FaGoodreadsG, FaInstagram, FaYoutube } from "react-icons/fa6";

import ContactForm from "../../components/forms/ContactForm/ContactForm";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import authorImage from "../../assets/images/author/author.jpg";
import useSiteSettings from "../../hooks/useSiteSettings";

function Contact() {
  const { siteConfig, socialLinks } = useSiteSettings();
  const contactChannels = socialLinks.filter((link) => link.active !== false);
  const inquiries = ["Media", "Collaborations", "Speaking", "General Questions"];
  const channelMeta = {
    instagram: {
      icon: FaInstagram,
      label: "@anuragvrm2173",
    },
    youtube: {
      icon: FaYoutube,
      label: "Anurag Verma Vlog",
    },
    "amazon-author": {
      icon: FaAmazon,
      label: "Author profile and book listings",
    },
    goodreads: {
      icon: FaGoodreadsG,
      label: "Reviews, shelves, and reading community",
    },
    email: {
      icon: FaEnvelope,
      label: "vanuragverma2173@gmail.com",
    },
  };

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
          image: `${siteConfig.url}/og/contact.svg`,
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
                <p className="contact-page__response-time">Typical response time: 1-3 business days</p>
              </div>

              <aside className="contact-page__aside" aria-labelledby="contact-channels-title">
                <div className="contact-page__author">
                  <picture>
                    <source
                      type="image/avif"
                      srcSet="/images/optimized/author/author-400.avif 400w, /images/optimized/author/author-800.avif 800w, /images/optimized/author/author-1200.avif 1200w"
                      sizes="56px"
                    />
                    <source
                      type="image/webp"
                      srcSet="/images/optimized/author/author-400.webp 400w, /images/optimized/author/author-800.webp 800w, /images/optimized/author/author-1200.webp 1200w"
                      sizes="56px"
                    />
                    <img src={authorImage} alt="Anurag Verma portrait" loading="lazy" width="320" height="320" />
                  </picture>
                  <p>Anurag Verma</p>
                </div>

                <h2 id="contact-channels-title" className="contact-page__section-title">
                  Other Ways to Connect
                </h2>

                <p className="contact-page__channels-copy">
                  If the form isn't working right now, you can still reach me through any of these platforms.
                </p>

                <ul className="contact-page__channels">
                  {contactChannels.map((channel) => (
                    <li key={channel.id} className="contact-page__channel-item">
                      <a
                        className="contact-page__channel-link"
                        href={channel.url}
                        target={channel.external ? "_blank" : undefined}
                        rel={channel.external ? "noreferrer noopener" : undefined}
                        aria-label={`${channel.name} link`}
                      >
                        <span className="contact-page__channel-icon" aria-hidden="true">
                          {(() => {
                            const Icon = channelMeta[channel.id]?.icon;
                            return Icon ? <Icon /> : null;
                          })()}
                        </span>
                        <span className="contact-page__channel-copy">
                          <span className="contact-page__channel-name">{channel.name}</span>
                          <span className="contact-page__channel-handle">{channelMeta[channel.id]?.label || channel.url}</span>
                        </span>
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
