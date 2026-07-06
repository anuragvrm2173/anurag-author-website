import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";

import navigation from "../../../data/navigation";

import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleMenu() {
    setIsMenuOpen((open) => !open);
  }

  return (
    <header className="navbar">
      <div className="navbar__container">

        <NavLink
          to="/"
          className="navbar__logo"
          onClick={closeMenu}
        >
          Anurag Verma
        </NavLink>

        <nav
          className={`navbar__nav ${
            isMenuOpen ? "navbar__nav--open" : ""
          }`}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "navbar__link active" : "navbar__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="navbar__toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <HiOutlineXMark />
          ) : (
            <HiOutlineBars3 />
          )}
        </button>

      </div>
    </header>
  );
}

export default Navbar;