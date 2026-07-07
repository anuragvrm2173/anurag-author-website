import { Link } from "react-router-dom";

import Button from "../../components/ui/Button/Button";

function HeroContent() {
  return (
    <div className="hero__text">
      <p className="hero__eyebrow">Author • India</p>

      <h1 id="hero-title" className="hero__title">
        Stories that stay long after the final page is turned.
      </h1>

      <p className="hero__description">
        Every story begins with something real and leaves behind something worth carrying.
      </p>

      <div className="hero__buttons">
        <Link to="/library" className="hero__link">
          <Button>Explore Books</Button>
        </Link>

        <Link to="/about" className="hero__link">
          <Button variant="outline">About the Author</Button>
        </Link>
      </div>
    </div>
  );
}

export default HeroContent;
