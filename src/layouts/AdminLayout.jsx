import "./AdminLayout.css";

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
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div>
          <p className="admin-layout__eyebrow">Admin</p>
          <h1 className="admin-layout__title">Author Platform</h1>
        </div>

        <nav className="admin-layout__nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-layout__nav-link ${isActive ? "admin-layout__nav-link--active" : ""}`.trim()}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="outline"
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