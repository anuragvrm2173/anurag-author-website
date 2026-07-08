import "./Admin.css";

import { useEffect, useState } from "react";

import Button from "../../components/ui/Button/Button";
import { listAdminMediaFiles, uploadAdminMediaFile } from "../../services/adminService";

function AdminMedia() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    listAdminMediaFiles().then(setFiles).catch((nextError) => setError(nextError.message));
  }, []);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Media</p>
          <h1 className="admin-page__title">Storage-backed uploads</h1>
          <p className="admin-page__description">Upload book covers, author portraits, and article imagery to the `media` bucket in Supabase Storage.</p>
        </div>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}

      <div className="admin-card">
        <div className="admin-form__actions">
          <input
            type="file"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }

              setUploading(true);
              setError("");
              try {
                await uploadAdminMediaFile(file);
                setFiles(await listAdminMediaFiles());
              } catch (nextError) {
                setError(nextError.message);
              } finally {
                setUploading(false);
                event.target.value = "";
              }
            }}
          />
          <Button type="button" disabled>{uploading ? "Uploading…" : "Choose File"}</Button>
        </div>
      </div>

      {files.length === 0 ? <div className="admin-empty">No media files found. Create a `media` bucket in Supabase Storage to start uploading assets.</div> : null}

      {files.length > 0 ? (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Updated</th>
                <th>Size</th>
                <th>Public URL</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.name}>
                  <td>{file.name}</td>
                  <td>{file.updated_at ? new Date(file.updated_at).toLocaleString() : "—"}</td>
                  <td>{file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : "—"}</td>
                  <td>{file.publicUrl ? <a href={file.publicUrl} target="_blank" rel="noreferrer">Open</a> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export default AdminMedia;