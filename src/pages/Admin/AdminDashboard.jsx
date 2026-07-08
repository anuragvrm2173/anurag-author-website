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
          <h1 className="admin-page__title">Welcome back, Anurag</h1>
          <p className="admin-page__description">Monitor content, moderation, and reader activity from one place.</p>
        </div>
      </header>

      {stats ? (
        <div className="admin-stats">
          {[
            ["Books", stats.books],
            ["Draft Books", stats.draftBooks],
            ["Blog Posts", stats.blogPosts],
            ["Draft Posts", stats.draftPosts],
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
          <p className="admin-card__label">Latest Blog</p>
          <h2>{stats?.latestBlogTitle || "No posts yet"}</h2>
          <p>{stats?.lastUpdated ? `Last settings update: ${new Date(stats.lastUpdated).toLocaleString()}` : "Not available yet"}</p>
        </article>

        <article className="admin-card">
          <p className="admin-card__label">Recent Activity</p>
          {stats?.recentActivity?.length ? (
            <ul>
              {stats.recentActivity.map((item) => (
                <li key={item.id}>{item.label}{item.timestamp ? ` • ${new Date(item.timestamp).toLocaleString()}` : ""}</li>
              ))}
            </ul>
          ) : (
            <p>No activity recorded yet.</p>
          )}
        </article>
      </div>
    </section>
  );
}

export default AdminDashboard;