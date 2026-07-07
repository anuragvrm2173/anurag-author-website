import "./Footer.css";

import { Link } from "react-router-dom";
import socialLinks from "../../../data/socialLinks";

const pages = [
  { label: "Books", path: "/library" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Reviews", path: "/reviews" },
  { label: "Contact", path: "/contact" },
];

const social = socialLinks.filter((item) => item.active !== false);

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div>
            <p className="footer__title">Books</p>
            <ul className="footer__list" aria-label="Footer navigation links">
              {pages.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer__title">Follow</p>
            <ul className="footer__list" aria-label="Social links">
              {social.map((item) => (
                <li key={item.id}>
                  <a href={item.url} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer noopener" : undefined}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bar" />

        <div className="footer__bottom">
          <p>© 2026 Anurag Verma</p>
          <p>All Rights Reserved.</p>
          <p className="footer__legal">
            <Link to="/privacy">Privacy</Link>
            <span>•</span>
            <Link to="/terms">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
