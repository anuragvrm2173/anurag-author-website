import "./Admin.css";

import { useEffect, useState } from "react";

import { fetchAdminMessages, updateAdminMessage } from "../../services/adminService";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminMessages().then(setMessages).catch((nextError) => setError(nextError.message));
  }, []);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Messages</p>
          <h1 className="admin-page__title">Inbox and contact workflow</h1>
          <p className="admin-page__description">Track unread, read, and archived messages once the public contact form is wired into Supabase.</p>
        </div>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}
      {messages.length === 0 ? <div className="admin-empty">No messages yet. Connect the contact form to the `messages` table to see submissions here.</div> : null}

      {messages.length > 0 ? (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.message}</td>
                  <td><span className={`admin-status-pill admin-status-pill--${message.status}`}>{message.status}</span></td>
                  <td>
                    <div className="admin-table__actions">
                      {message.status !== "read" ? <button type="button" className="admin-inline-button" onClick={async () => {
                        await updateAdminMessage(message.id, { status: "read" });
                        setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: "read" } : item));
                      }}>Mark Read</button> : null}
                      {message.status !== "archived" ? <button type="button" className="admin-inline-button" onClick={async () => {
                        await updateAdminMessage(message.id, { status: "archived" });
                        setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: "archived" } : item));
                      }}>Archive</button> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export default AdminMessages;