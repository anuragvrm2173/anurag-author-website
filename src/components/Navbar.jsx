import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <nav>
        <h2>Anurag Verma</h2>

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>

          <li>
            <Link to="/library">Library</Link>
          </li>

          <li>
            <Link to="/reviews">Reviews</Link>
          </li>

          <li>
            <Link to="/blog">Blog</Link>
          </li>

          <li>
            <Link to="/contact">Contact</Link>
          </li>

          <li>
            <Link to="/search">Search</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
