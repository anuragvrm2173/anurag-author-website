import "./Admin.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { fetchAdminMessages, updateAdminMessage } from "../../services/adminService";

function getMessageType(message) {
  const text = String(message?.message || "");
  if (/\[BUY_NOW_LEAD\]|Book purchase intent/i.test(text)) {
    return "buy_now";
  }

  return "contact";
}

function getDisplayMessageBody(message) {
  return String(message?.message || "")
    .replace(/^\[BUY_NOW_LEAD\]\s*/i, "")
    .trim();
}

function createReplyLink(message) {
  const recipient = String(message.email || "").trim();
  if (!recipient) {
    return "";
  }

  const messageType = getMessageType(message);
  const subjectText = messageType === "buy_now" ? "Re: Your book purchase inquiry" : "Re: Your message to Anurag Verma";

  const subject = encodeURIComponent(subjectText);
  const body = encodeURIComponent([
    `Hi ${message.name || "there"},`,
    "",
    "Thank you for your message.",
    "",
    "Best regards,",
    "Anurag Verma",
    "",
    "--- Original Message ---",
    getDisplayMessageBody(message),
  ].join("\n"));

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

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
                <th>Type</th>
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
                  <td data-label="Type">
                    <span className={`admin-status-pill admin-status-pill--${getMessageType(message)}`}>
                      {getMessageType(message) === "buy_now" ? "Buy Now" : "Contact"}
                    </span>
                  </td>
                  <td data-label="Name">{message.name}</td>
                  <td data-label="Email">{message.email}</td>
                  <td data-label="Message">
                    <div className="admin-message-content">{getDisplayMessageBody(message)}</div>
                  </td>
                  <td data-label="Status"><span className={`admin-status-pill admin-status-pill--${message.status}`}>{message.status}</span></td>
                  <td data-label="Actions">
                    <div className="admin-table__actions">
                      {createReplyLink(message) ? (
                        <a className="admin-inline-button" href={createReplyLink(message)}>
                          Reply
                        </a>
                      ) : null}
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