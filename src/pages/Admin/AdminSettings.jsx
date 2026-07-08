import "./Admin.css";

import { useEffect, useState } from "react";

import Button from "../../components/ui/Button/Button";
import { fetchAdminSettings, upsertAdminSetting } from "../../services/adminService";

function AdminSettings() {
  const [settings, setSettings] = useState({ site: {}, socialLinks: [] });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}

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