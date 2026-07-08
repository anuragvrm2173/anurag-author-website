import "./Admin.css";

import { useEffect, useState } from "react";

import Button from "../../components/ui/Button/Button";
import { changeAdminPassword, fetchAdminSettings, upsertAdminSetting } from "../../services/adminService";

function AdminSettings() {
  const [settings, setSettings] = useState({ site: {}, socialLinks: [] });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordState, setPasswordState] = useState({ nextPassword: "", confirmPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    fetchAdminSettings().then(setSettings).catch((nextError) => setError(nextError.message));
  }, []);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Settings</p>
          <h1 className="admin-page__title">Author, SEO, and site controls</h1>
          <p className="admin-page__description">Adjust site-wide metadata, social links, and publishing defaults without touching source files.</p>
        </div>
        <div className="admin-page__actions">
          <button
            type="button"
            className="admin-link-button"
            onClick={() => {
              setShowPasswordForm((current) => !current);
              setPasswordMessage("");
              setError("");
            }}
          >
            {showPasswordForm ? "Close Password" : "Change Password"}
          </button>
        </div>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}

      {showPasswordForm ? (
        <form
          className="admin-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setPasswordSaving(true);
            setPasswordMessage("");
            setError("");

            if (passwordState.nextPassword.length < 8) {
              setError("Password must be at least 8 characters.");
              setPasswordSaving(false);
              return;
            }

            if (passwordState.nextPassword !== passwordState.confirmPassword) {
              setError("Password confirmation does not match.");
              setPasswordSaving(false);
              return;
            }

            try {
              await changeAdminPassword(passwordState.nextPassword);
              setPasswordState({ nextPassword: "", confirmPassword: "" });
              setPasswordMessage("Password changed successfully.");
            } catch (nextError) {
              setError(nextError.message || "Could not change password.");
            } finally {
              setPasswordSaving(false);
            }
          }}
        >
          <div className="admin-form__grid">
            <div className="admin-form__field">
              <label htmlFor="settings-next-password">New Password</label>
              <div className="admin-password-field">
                <input
                  id="settings-next-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordState.nextPassword}
                  onChange={(event) => setPasswordState((current) => ({ ...current, nextPassword: event.target.value }))}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowNewPassword((current) => !current)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  aria-pressed={showNewPassword}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="admin-form__field">
              <label htmlFor="settings-confirm-password">Confirm Password</label>
              <div className="admin-password-field">
                <input
                  id="settings-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordState.confirmPassword}
                  onChange={(event) => setPasswordState((current) => ({ ...current, confirmPassword: event.target.value }))}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <div className="admin-form__actions">
            <Button type="submit" disabled={passwordSaving}>{passwordSaving ? "Changing…" : "Update Password"}</Button>
          </div>
          {passwordMessage ? <p className="admin-meta-note">{passwordMessage}</p> : null}
        </form>
      ) : null}

      <form
        className="admin-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setError("");
          try {
            await upsertAdminSetting("site", settings.site || {});
            await upsertAdminSetting("socialLinks", settings.socialLinks || []);
          } catch (nextError) {
            setError(nextError.message);
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="admin-form__grid">
          {[
            ["siteName", "Site Name"],
            ["tagline", "Tagline"],
            ["defaultTitle", "Default Title"],
            ["defaultDescription", "Default Description", true],
            ["url", "Site URL"],
          ].map(([key, label, isFull]) => (
            <div key={key} className={`admin-form__field ${isFull ? "admin-form__field--full" : ""}`.trim()}>
              <label htmlFor={`settings-${key}`}>{label}</label>
              {isFull ? (
                <textarea id={`settings-${key}`} value={settings.site?.[key] || ""} onChange={(event) => setSettings((current) => ({ ...current, site: { ...current.site, [key]: event.target.value } }))} />
              ) : (
                <input id={`settings-${key}`} value={settings.site?.[key] || ""} onChange={(event) => setSettings((current) => ({ ...current, site: { ...current.site, [key]: event.target.value } }))} />
              )}
            </div>
          ))}
          <div className="admin-form__field admin-form__field--full">
            <label htmlFor="settings-social-links">Social Links JSON</label>
            <textarea
              id="settings-social-links"
              value={JSON.stringify(settings.socialLinks || [], null, 2)}
              onChange={(event) => {
                try {
                  setSettings((current) => ({ ...current, socialLinks: JSON.parse(event.target.value) }));
                } catch {
                  setError("Social links must be valid JSON.");
                }
              }}
            />
          </div>
        </div>

        <div className="admin-form__actions">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</Button>
        </div>
      </form>
    </section>
  );
}

export default AdminSettings;