import "./Footer.css";

import Newsletter from "../../../sections/Newsletter/Newsletter";

function Footer() {
  return (
    <>
      <Newsletter source="Footer" />
      <footer className="footer">
        <div className="footer__container">
          <p>© 2026 Anurag Verma. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
