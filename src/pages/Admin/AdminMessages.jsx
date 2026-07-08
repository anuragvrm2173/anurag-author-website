import "./Admin.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { fetchAdminMessages, updateAdminMessage } from "../../services/adminService";

function AdminMessages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const activeStatus = searchParams.get("status") || "all";

  useEffect(() => {
    fetchAdminMessages().then(setMessages).catch((nextError) => setError(nextError.message));
  }, []);

  const filteredMessages = useMemo(() => {
    if (activeStatus === "all") {
      return messages;
    }

    if (activeStatus === "unread") {
      return messages.filter((message) => message.status !== "read" && message.status !== "archived");
    }

    return messages.filter((message) => message.status === activeStatus);
  }, [activeStatus, messages]);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Messages</p>
          <h1 className="admin-page__title">Inbox and contact workflow</h1>
          <p className="admin-page__description">Track unread, read, and archived messages once the public contact form is wired into Supabase.</p>
        </div>
        <div className="admin-filter-group" role="tablist" aria-label="Message status filters">
          {[
            ["all", "All"],
            ["unread", "Unread"],
            ["read", "Read"],
            ["archived", "Archived"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`admin-filter-chip ${activeStatus === value ? "admin-filter-chip--active" : ""}`.trim()}
              onClick={() => {
                setSearchParams((current) => {
                  const nextParams = new URLSearchParams(current);
                  if (value === "all") {
                    nextParams.delete("status");
                  } else {
                    nextParams.set("status", value);
                  }
                  return nextParams;
                });
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}
      {messages.length === 0 ? <div className="admin-empty">No messages yet. Connect the contact form to the `messages` table to see submissions here.</div> : null}
      {messages.length > 0 && filteredMessages.length === 0 ? <div className="admin-empty">No messages match the current filter.</div> : null}

      {filteredMessages.length > 0 ? (
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
              {filteredMessages.map((message) => (
                <tr key={message.id}>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.message}</td>
                  <td><span className={`admin-status-pill admin-status-pill--${message.status}`}>{message.status}</span></td>
                  <td>
                    <div className="admin-table__actions">
                      {message.status === "unread" ? <button type="button" className="admin-inline-button" onClick={async () => {
                        await updateAdminMessage(message.id, { status: "read" });
                        setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: "read" } : item));
                      }}>Mark Read</button> : null}
                      {message.status === "read" ? <button type="button" className="admin-inline-button" onClick={async () => {
                        await updateAdminMessage(message.id, { status: "unread" });
                        setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: "unread" } : item));
                      }}>Mark Unread</button> : null}
                      {message.status !== "archived" ? <button type="button" className="admin-inline-button" onClick={async () => {
                        await updateAdminMessage(message.id, { status: "archived" });
                        setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: "archived" } : item));
                      }}>Archive</button> : null}
                      {message.status === "archived" ? <button type="button" className="admin-inline-button" onClick={async () => {
                        await updateAdminMessage(message.id, { status: "read" });
                        setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: "read" } : item));
                      }}>Restore</button> : null}
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