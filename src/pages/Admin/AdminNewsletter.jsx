import "./Admin.css";

import { useEffect, useState } from "react";

import { deleteAdminNewsletterSubscriber, fetchAdminNewsletterSubscribers } from "../../services/adminService";

function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminNewsletterSubscribers().then(setSubscribers).catch((nextError) => setError(nextError.message));
  }, []);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Newsletter</p>
          <h1 className="admin-page__title">Subscriber management</h1>
          <p className="admin-page__description">Review signup sources, export later, and remove inactive records.</p>
        </div>
        <div className="admin-page__actions">
          <button
            type="button"
            className="admin-link-button"
            onClick={() => {
              const rows = [
                ["email", "source", "provider", "subscribed_at", "status"],
                ...subscribers.map((subscriber) => [
                  subscriber.email || "",
                  subscriber.source || "",
                  subscriber.provider || "",
                  subscriber.subscribed_at || "",
                  subscriber.status || "active",
                ]),
              ];

              const csv = rows
                .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
                .join("\n");

              const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export CSV
          </button>
        </div>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Source</th>
              <th>Provider</th>
              <th>Subscribed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td>{subscriber.email}</td>
                <td>{subscriber.source || "—"}</td>
                <td>{subscriber.provider || "—"}</td>
                <td>{subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toLocaleString() : "—"}</td>
                <td><span className={`admin-status-pill admin-status-pill--${subscriber.status || "active"}`}>{subscriber.status || "active"}</span></td>
                <td>
                  <div className="admin-table__actions">
                    <button type="button" className="admin-inline-button admin-inline-button--danger" onClick={async () => {
                      await deleteAdminNewsletterSubscriber(subscriber.id);
                      setSubscribers((current) => current.map((item) => item.id === subscriber.id ? { ...item, status: "deleted" } : item));
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminNewsletter;