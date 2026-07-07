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
              const Icon = platformIcons[link.icon] || FaEnvelope;

              return (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="about-social-links__anchor"
                    target={!isMail && link.external ? "_blank" : undefined}
                    rel={!isMail && link.external ? "noreferrer noopener" : undefined}
                    aria-label={`${link.name} profile`}
                  >
                    <span className="about-social-links__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span>{link.name}</span>
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