import "./Admin.css";

import { useEffect, useState } from "react";

import { fetchAdminDashboardStats } from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAdminDashboardStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Dashboard</p>
          <h1 className="admin-page__title">Publishing control room</h1>
          <p className="admin-page__description">Monitor content, moderation, and reader activity from one place.</p>
        </div>
      </header>

      {stats ? (
        <div className="admin-stats">
          {[
            ["Books", stats.books],
            ["Blog Posts", stats.blogPosts],
            ["Pending Reviews", stats.pendingReviews],
            ["Published Reviews", stats.publishedReviews],
            ["Newsletter Subscribers", stats.newsletterSubscribers],
            ["Messages", stats.messages],
          ].map(([label, value]) => (
            <article key={label} className="admin-card admin-stat">
              <p className="admin-stat__label">{label}</p>
              <p className="admin-stat__value">{value}</p>
            </article>
          ))}
        </div>
      ) : null}

      <div className="admin-grid">
        <article className="admin-card">
          <p className="admin-card__label">Last Updated</p>
          <h2>{stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : "Not available yet"}</h2>
          <p>Once Supabase content tables are populated, this dashboard will reflect live editorial activity and moderation volume.</p>
        </article>

        <article className="admin-card">
          <p className="admin-card__label">Launch Checklist</p>
          <ul>
            <li>Add your admin user to `admin_users` in Supabase.</li>
            <li>Create a `media` storage bucket for uploads.</li>
            <li>Configure Vercel environment variables for Supabase and analytics.</li>
            <li>Seed books and blog posts into Supabase before switching the public site.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default AdminDashboard;