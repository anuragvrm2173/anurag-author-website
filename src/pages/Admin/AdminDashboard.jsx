import "./Admin.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchAdminDashboardStats } from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAdminDashboardStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <section className="admin-page">
      <header className="admin-card admin-hero">
        <div className="admin-hero__content">
          <div>
            <p className="admin-page__eyebrow">Dashboard</p>
            <h1 className="admin-page__title">Welcome back, Anurag</h1>
            <p className="admin-page__description">Monitor content, moderation, and reader activity from one place.</p>
          </div>

          <div className="admin-hero__highlights" aria-label="Priority items">
            {[
              ["Draft Content", (stats?.draftBooks || 0) + (stats?.draftPosts || 0)],
              ["Pending Reviews", stats?.pendingReviews || 0],
              ["Unread Messages", stats?.unreadMessages || 0],
            ].map(([label, value]) => (
              <article key={label} className="admin-hero__badge">
                <p>{label}</p>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
        </div>
      </header>

      {stats ? (
        <section className="admin-section">
          <div className="admin-section__header">
            <div>
              <p className="admin-card__label">Overview</p>
              <h2 className="admin-section__title">Platform snapshot</h2>
            </div>
            <p className="admin-meta-note">A live summary of content, moderation, subscriptions, and inbox activity.</p>
          </div>

          <div className="admin-stats">
          {[
            ["Books", stats.books],
            ["Draft Books", stats.draftBooks],
            ["Published Books", stats.publishedBooks],
            ["Archived Books", stats.archivedBooks],
            ["Blog Posts", stats.blogPosts],
            ["Draft Posts", stats.draftPosts],
            ["Published Posts", stats.publishedPosts],
            ["Archived Posts", stats.archivedPosts],
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
        </section>
      ) : null}

      <section className="admin-section">
        <div className="admin-section__header">
          <div>
            <p className="admin-card__label">Quick Focus</p>
            <h2 className="admin-section__title">Jump into priority work</h2>
          </div>
          <p className="admin-meta-note">Use these shortcuts to go directly into the queues and content slices that usually need attention first.</p>
        </div>

        <div className="admin-action-grid">
        {[
          {
            label: "Draft Books",
            value: stats?.draftBooks || 0,
            description: "Review unpublished or coming-soon titles.",
            to: "/admin/books?status=draft",
          },
          {
            label: "Archived Books",
            value: stats?.archivedBooks || 0,
            description: "Open the recovery view for archived titles.",
            to: "/admin/books?archived=1",
          },
          {
            label: "Published Books",
            value: stats?.publishedBooks || 0,
            description: "Review the books currently live on the site.",
            to: "/admin/books?status=published",
          },
          {
            label: "Draft Posts",
            value: stats?.draftPosts || 0,
            description: "Finish posts that are still waiting to publish.",
            to: "/admin/blog?status=draft",
          },
          {
            label: "Archived Posts",
            value: stats?.archivedPosts || 0,
            description: "Restore or inspect archived blog entries.",
            to: "/admin/blog?archived=1",
          },
          {
            label: "Published Posts",
            value: stats?.publishedPosts || 0,
            description: "Open the live blog content list for editorial review.",
            to: "/admin/blog?status=published",
          },
          {
            label: "Pending Reviews",
            value: stats?.pendingReviews || 0,
            description: "Open the moderation queue for submitted and pending reviews.",
            to: "/admin/reviews?status=pending",
          },
          {
            label: "Unread Messages",
            value: stats?.unreadMessages || 0,
            description: "Jump into the inbox view for unread reader messages.",
            to: "/admin/messages?status=unread",
          },
        ].map((item) => (
          <Link key={item.label} to={item.to} className="admin-card admin-action-card">
            <p className="admin-card__label">{item.label}</p>
            <p className="admin-stat__value">{item.value}</p>
            <p className="admin-action-card__description">{item.description}</p>
          </Link>
        ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section__header">
          <div>
            <p className="admin-card__label">Recent Signals</p>
            <h2 className="admin-section__title">Editorial and settings activity</h2>
          </div>
        </div>

        <div className="admin-grid">
        <article className="admin-card">
          <p className="admin-card__label">Latest Blog</p>
          <h2>{stats?.latestBlogTitle || "No posts yet"}</h2>
          <p>{stats?.lastUpdated ? `Last settings update: ${new Date(stats.lastUpdated).toLocaleString()}` : "Not available yet"}</p>
        </article>

        <article className="admin-card admin-activity-card">
          <p className="admin-card__label">Recent Activity</p>
          {stats?.recentActivity?.length ? (
            <ul className="admin-activity-list">
              {stats.recentActivity.map((item) => (
                <li key={item.id}>
                  <span>{item.label}</span>
                  <time>{item.timestamp ? new Date(item.timestamp).toLocaleString() : "Just now"}</time>
                </li>
              ))}
            </ul>
          ) : (
            <p>No activity recorded yet.</p>
          )}
        </article>
        </div>
      </section>
    </section>
  );
}

export default AdminDashboard;