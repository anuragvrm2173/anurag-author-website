import "./Admin.css";

import { useEffect, useState } from "react";

import { deleteAdminNewsletterSubscriber, fetchAdminNewsletterSubscribers } from "../../services/adminService";
import { sanitizeExternalUrl } from "../../utils/urlSafety";

function createSubscriberReplyLink(subscriber) {
  const recipient = String(subscriber.email || "").trim();
  if (!recipient) {
    return "";
  }

  const subject = encodeURIComponent("Thanks for subscribing");
  const body = encodeURIComponent([
    "Hi,",
    "",
    "Thank you for subscribing to my newsletter.",
    "I appreciate your support and look forward to sharing new writing updates with you.",
    "",
    "Warmly,",
    "Anurag Verma",
  ].join("\n"));

  return sanitizeExternalUrl(`mailto:${recipient}?subject=${subject}&body=${body}`);
}

function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let active = true;

    fetchAdminNewsletterSubscribers()
      .then((nextSubscribers) => {
        if (!active) {
          return;
        }
        setSubscribers(nextSubscribers);
      })
      .catch((nextError) => {
        if (!active) {
          return;
        }
        setError(nextError.message);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
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
      {loading ? <p className="admin-meta-note">Loading subscribers…</p> : null}
      {!loading && subscribers.length === 0 ? <div className="admin-empty">No subscribers found yet.</div> : null}

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
                <td data-label="Email">{subscriber.email}</td>
                <td data-label="Source">{subscriber.source || "—"}</td>
                <td data-label="Provider">{subscriber.provider || "—"}</td>
                <td data-label="Subscribed">{subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toLocaleString() : "—"}</td>
                <td data-label="Status"><span className={`admin-status-pill admin-status-pill--${subscriber.status || "active"}`}>{subscriber.status || "active"}</span></td>
                <td data-label="Actions">
                  <div className="admin-table__actions">
                    {createSubscriberReplyLink(subscriber) ? (
                      <a className="admin-inline-button" href={createSubscriberReplyLink(subscriber)}>
                        Email
                      </a>
                    ) : null}
                    <button type="button" className="admin-inline-button admin-inline-button--danger" disabled={deletingId === subscriber.id} onClick={async () => {
                      if (!window.confirm(`Delete subscriber ${subscriber.email}?`)) {
                        return;
                      }

                      setDeletingId(subscriber.id);
                      setError("");
                      try {
                        await deleteAdminNewsletterSubscriber(subscriber.id);
                        setSubscribers((current) => current.map((item) => item.id === subscriber.id ? { ...item, status: "deleted" } : item));
                      } catch (nextError) {
                        setError(nextError.message || "Could not delete subscriber.");
                      } finally {
                        setDeletingId("");
                      }
                    }}>{deletingId === subscriber.id ? "Deleting…" : "Delete"}</button>
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