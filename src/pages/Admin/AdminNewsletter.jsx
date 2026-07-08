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