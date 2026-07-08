import "./AdminLayout.css";

import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import Button from "../components/ui/Button/Button";
import { signOutAdmin } from "../services/adminService";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/books", label: "Books" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/newsletter", label: "Newsletter" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/settings", label: "Settings" },
];

function AdminLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__heading-row">
          <div>
            <p className="admin-layout__eyebrow">Admin</p>
            <h1 className="admin-layout__title">Author Platform</h1>
          </div>
          <button
            type="button"
            className="admin-layout__menu-toggle"
            onClick={() => setIsNavOpen((current) => !current)}
            aria-expanded={isNavOpen}
            aria-controls="admin-layout-nav"
          >
            {isNavOpen ? "Close" : "Menu"}
          </button>
        </div>

        <nav
          id="admin-layout-nav"
          className={`admin-layout__nav ${isNavOpen ? "admin-layout__nav--open" : ""}`.trim()}
          aria-label="Admin navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-layout__nav-link ${isActive ? "admin-layout__nav-link--active" : ""}`.trim()}
              onClick={() => setIsNavOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="outline"
          className={`admin-layout__signout ${isNavOpen ? "admin-layout__signout--open" : ""}`.trim()}
          onClick={async () => {
            await signOutAdmin();
            window.location.href = "/admin/login";
          }}
        >
          Sign Out
        </Button>
      </aside>

      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;