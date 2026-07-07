import Container from "../ui/Container/Container";
import { FaAmazon, FaEnvelope, FaGoodreadsG, FaInstagram, FaYoutube } from "react-icons/fa";

const platformIcons = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  amazon: FaAmazon,
  goodreads: FaGoodreadsG,
  email: FaEnvelope,
};

function SocialLinks({ links }) {
  const activeLinks = links.filter((link) => link.active !== false && link.url);

  return (
    <section className="about-social-links" aria-labelledby="about-social-links-title">
      <Container>
        <div className="about-social-links__inner">
          <h2 id="about-social-links-title" className="about-social-links__title">
            Social Links
          </h2>

          <ul className="about-social-links__list">
            {activeLinks.map((link) => {
              const isMail = link.url.startsWith("mailto:");
              const Icon = platformIcons[link.platform] || FaEnvelope;

              return (
                <li key={link.label}>
                  <a
                    href={link.url}
                    className="about-social-links__anchor"
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noreferrer noopener"}
                    aria-label={`${link.label} profile`}
                  >
                    <span className="about-social-links__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span>{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default SocialLinks;