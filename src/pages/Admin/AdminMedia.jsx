import "./Admin.css";

import { useEffect, useMemo, useState } from "react";

import Button from "../../components/ui/Button/Button";
import { listAdminMediaFiles, uploadAdminMediaFile } from "../../services/adminService";

const LOCAL_MEDIA_MODULES = import.meta.glob([
  "../../assets/**/*.{png,jpg,jpeg,webp,avif,gif,svg,mp4,webm,pdf}",
  "../../../public/**/*.{png,jpg,jpeg,webp,avif,gif,svg,mp4,webm,pdf}",
], {
  eager: true,
  query: "?url",
  import: "default",
});

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${Math.round(bytes / 1024)} KB`;
}

function getFileExtension(value) {
  const normalized = String(value || "").split("?")[0].trim().toLowerCase();
  const dotIndex = normalized.lastIndexOf(".");
  if (dotIndex < 0) {
    return "";
  }

  return normalized.slice(dotIndex + 1);
}

function getMediaType(file) {
  const extension = getFileExtension(file.path || file.name || file.publicUrl);
  if (["png", "jpg", "jpeg", "webp", "avif", "gif", "svg"].includes(extension)) {
    return "image";
  }

  if (["mp4", "webm"].includes(extension)) {
    return "video";
  }

  if (["pdf"].includes(extension)) {
    return "document";
  }

  return "other";
}

function isImage(file) {
  return getMediaType(file) === "image";
}

function compareByKey(left, right, key) {
  if (key === "updated") {
    const leftTime = left.updated_at ? new Date(left.updated_at).getTime() : -1;
    const rightTime = right.updated_at ? new Date(right.updated_at).getTime() : -1;
    return leftTime - rightTime;
  }

  if (key === "size") {
    const leftSize = Number.isFinite(left.size) ? left.size : -1;
    const rightSize = Number.isFinite(right.size) ? right.size : -1;
    return leftSize - rightSize;
  }

  const leftValue = String(left[key] || "").toLowerCase();
  const rightValue = String(right[key] || "").toLowerCase();
  return leftValue.localeCompare(rightValue);
}

function toDisplayPath(modulePath) {
  if (modulePath.startsWith("../../assets/")) {
    return `src/assets/${modulePath.replace("../../assets/", "")}`;
  }

  if (modulePath.startsWith("../../../public/")) {
    return `public/${modulePath.replace("../../../public/", "")}`;
  }

  return modulePath;
}

function AdminMedia() {
  const [files, setFiles] = useState([]);
  const [bucketMissing, setBucketMissing] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState("");

  async function loadMedia() {
    const { files: nextFiles, bucketMissing: isBucketMissing } = await listAdminMediaFiles();
    setFiles(nextFiles);
    setBucketMissing(isBucketMissing);
  }

  useEffect(() => {
    loadMedia().catch((nextError) => setError(nextError.message));
  }, []);

  const localFiles = useMemo(() => Object.entries(LOCAL_MEDIA_MODULES).map(([modulePath, fileUrl]) => {
    const displayPath = toDisplayPath(modulePath);
    return {
      id: `local-${displayPath}`,
      name: displayPath.split("/").pop() || displayPath,
      path: displayPath,
      publicUrl: String(fileUrl || ""),
      source: displayPath.startsWith("public/") ? "public" : "src/assets",
      updated_at: null,
      size: null,
    };
  }), []);

  const combinedFiles = useMemo(() => {
    const storageFiles = files.map((file) => ({
      id: `storage-${file.id || file.name}`,
      name: file.name,
      path: `supabase/media/${file.name}`,
      publicUrl: file.publicUrl,
      source: "supabase",
      updated_at: file.updated_at || null,
      size: file.metadata?.size || null,
    }));

    return [...localFiles, ...storageFiles];
  }, [files, localFiles]);

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return combinedFiles.filter((file) => {
      if (sourceFilter !== "all" && file.source !== sourceFilter) {
        return false;
      }

      const mediaType = getMediaType(file);
      if (typeFilter !== "all" && mediaType !== typeFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = `${file.name} ${file.path} ${file.source}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [combinedFiles, query, sourceFilter, typeFilter]);

  const sortedFiles = useMemo(() => {
    const sorted = [...filteredFiles].sort((left, right) => compareByKey(left, right, sortKey));
    if (sortDirection === "desc") {
      sorted.reverse();
    }

    return sorted;
  }, [filteredFiles, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(sortedFiles.length / pageSize));
  const clampedPage = Math.min(page, pageCount);

  const pagedFiles = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return sortedFiles.slice(start, start + pageSize);
  }, [clampedPage, pageSize, sortedFiles]);

  useEffect(() => {
    setPage(1);
  }, [query, sourceFilter, typeFilter, sortKey, sortDirection, pageSize]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  async function handleCopyUrl(file) {
    if (!file.publicUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(file.publicUrl);
      setCopiedId(file.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === file.id ? "" : current));
      }, 1800);
    } catch {
      setError("Could not copy URL. Please copy it manually.");
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Media</p>
          <h1 className="admin-page__title">Storage-backed uploads</h1>
          <p className="admin-page__description">Review local media files from the repository and upload new assets to the `media` bucket in Supabase Storage.</p>
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
                await loadMedia();
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

      <div className="admin-card">
        <div className="admin-media-controls" aria-label="Media filters">
          <input
            type="search"
            placeholder="Search by file name or path"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
            <option value="all">All sources</option>
            <option value="supabase">Supabase</option>
            <option value="public">Public</option>
            <option value="src/assets">Src assets</option>
          </select>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">All types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="other">Other</option>
          </select>
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="updated">Sort by Updated</option>
            <option value="size">Sort by Size</option>
            <option value="source">Sort by Source</option>
          </select>
          <select value={sortDirection} onChange={(event) => setSortDirection(event.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <select value={String(pageSize)} onChange={(event) => setPageSize(Number(event.target.value))}>
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
          <span className="admin-meta-note">{sortedFiles.length} files</span>
        </div>
      </div>

      {bucketMissing ? <div className="admin-empty">Media bucket is missing. Local repository media is shown below. Create a `media` bucket in Supabase Storage to enable uploads and remote listing.</div> : null}
      {!bucketMissing && combinedFiles.length === 0 ? <div className="admin-empty">No media files found yet. Upload your first image to start populating the media library.</div> : null}
      {combinedFiles.length > 0 && sortedFiles.length === 0 ? <div className="admin-empty">No media files match your current filters.</div> : null}

      {pagedFiles.length > 0 ? (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Preview</th>
                <th>Name</th>
                <th>Path</th>
                <th>Updated</th>
                <th>Size</th>
                <th>Public URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedFiles.map((file) => (
                <tr key={file.id}>
                  <td>{file.source}</td>
                  <td>
                    {isImage(file) && file.publicUrl ? (
                      <a href={file.publicUrl} target="_blank" rel="noreferrer">
                        <img className="admin-media-thumb" src={file.publicUrl} alt={file.name} loading="lazy" />
                      </a>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>{file.name}</td>
                  <td>{file.path}</td>
                  <td>{file.updated_at ? new Date(file.updated_at).toLocaleString() : "—"}</td>
                  <td>{formatSize(file.size)}</td>
                  <td>{file.publicUrl ? <a href={file.publicUrl} target="_blank" rel="noreferrer">Open</a> : "—"}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-inline-button" disabled={!file.publicUrl} onClick={() => {
                        handleCopyUrl(file);
                      }}>
                        {copiedId === file.id ? "Copied" : "Copy URL"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-media-pagination" aria-label="Media table pagination">
            <button
              type="button"
              className="admin-inline-button"
              disabled={clampedPage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>
            <p className="admin-meta-note">Page {clampedPage} of {pageCount}</p>
            <button
              type="button"
              className="admin-inline-button"
              disabled={clampedPage >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AdminMedia;