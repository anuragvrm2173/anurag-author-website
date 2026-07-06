import { NavLink } from "react-router-dom";
import navigation from "../../../data/navigation";

import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          Anurag Verma
        </NavLink>

        <nav className="navbar__menu">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;