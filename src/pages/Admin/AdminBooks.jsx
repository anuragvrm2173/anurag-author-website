import "./Admin.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import { deleteAdminBook, fetchAdminBooks, generateSlug, getDefaultBookForm, restoreAdminBook, upsertAdminBook, updateAdminBookEditionLinks, uploadAdminMediaFile } from "../../services/adminService";
import { appendRuntimeTrace, createRuntimeTraceId, withRuntimeTrace } from "../../utils/runtimeTrace";

function buildBookForm(book) {
  if (!book) {
    return getDefaultBookForm();
  }

  return {
    ...getDefaultBookForm(),
    id: book.id || "",
    slug: book.slug || "",
    title: book.title || "",
    subtitle: book.subtitle || "",
    shortDescription: book.shortDescription || "",
    longDescription: book.longDescription || "",
    description: book.description || "",
    genres: (book.genres || []).join("\n"),
    themes: (book.themes || []).join("\n"),
    status: String(book.status || "Draft").toLowerCase().replace(/\s+/g, "_"),
    displayOrder: book.displayOrder ?? 0,
    publicationDate: book.publicationDate || "",
    publishedAt: book.publishedAt || "",
    pages: book.pages || "",
    language: book.language || "",
    isbn: book.isbn || "",
    publisher: book.publisher || "",
    readingTime: book.readingTime || "",
    synopsis: (book.synopsis || []).join("\n"),
    discoveries: (book.discoveries || []).join("\n"),
    whoThisBookIsFor: (book.whoThisBookIsFor || []).join("\n"),
    favoriteQuotes: (book.favoriteQuotes || []).join("\n"),
    relatedBooks: (book.relatedBooks || []).join("\n"),
    relatedBlogIds: (book.relatedBlogIds || []).join("\n"),
    formatsJson: JSON.stringify(book.formats || {}, null, 2),
    purchaseLinksJson: JSON.stringify(book.purchaseLinks || {}, null, 2),
    seoJson: JSON.stringify(book.seo || {}, null, 2),
    editionsJson: JSON.stringify(book.editions || {}, null, 2),
  };
}

function BookEditorForm({ initialForm, selectedBook, onSaved, onError, onReset }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialForm.slug));
  const parsedEditions = useMemo(() => {
    try {
      const parsed = JSON.parse(form.editionsJson || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }, [form.editionsJson]);

  // Parse purchase links JSON into editable rows
  const [purchaseRows, setPurchaseRows] = useState(() => {
    try {
      const parsed = JSON.parse(initialForm.purchaseLinksJson || "{}");
      return Object.entries(parsed).length > 0
        ? Object.entries(parsed).map(([key, url]) => ({ key, url }))
        : [{ key: "amazon", url: "" }];
    } catch { return [{ key: "amazon", url: "" }]; }
  });

  function updateEditionCover(editionKey, coverKey, publicUrl) {
    const editions = JSON.parse(form.editionsJson || "{}");
    const nextEditions = {
      ...editions,
      [editionKey]: {
        ...(editions[editionKey] || {}),
        cover: {
          ...((editions[editionKey] || {}).cover || {}),
          [coverKey]: publicUrl,
        },
      },
    };

    setForm((current) => ({ ...current, editionsJson: JSON.stringify(nextEditions, null, 2) }));
  }

  function getCurrentCoverUrl(editionKey, coverKey) {
    const url = parsedEditions?.[editionKey]?.cover?.[coverKey];
    return typeof url === "string" ? url.trim() : "";
  }

  return (
    <form
      className="admin-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        onError("");
        const traceId = createRuntimeTraceId("SaveBook");
        try {
          await withRuntimeTrace(traceId, async () => {
            appendRuntimeTrace({ type: "breadcrumb", action: "SaveBook: click", traceId, bookId: form.id || null, slug: form.slug || null });
            const nextPurchaseLinks = {};
            purchaseRows.forEach(({ key, url }) => {
              if (key && url) {
                nextPurchaseLinks[key] = url;
              }
            });
            appendRuntimeTrace({ type: "breadcrumb", action: "SaveBook: validation passed", traceId, purchaseLinkKeys: Object.keys(nextPurchaseLinks) });
            const nextForm = {
              ...form,
              purchaseLinksJson: JSON.stringify(nextPurchaseLinks, null, 2),
            };

            appendRuntimeTrace({ type: "breadcrumb", action: "SaveBook: calling upsertAdminBook", traceId, formId: nextForm.id || null, title: nextForm.title || null });
            await upsertAdminBook(nextForm);
            appendRuntimeTrace({ type: "breadcrumb", action: "SaveBook: returned from upsertAdminBook", traceId, formId: nextForm.id || null });
            await onSaved(nextForm);
            appendRuntimeTrace({ type: "breadcrumb", action: "SaveBook: reloading books complete", traceId, formId: nextForm.id || null });
            navigate(`/admin/books/${nextForm.id || nextForm.slug || nextForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
          });
        } catch (nextError) {
          appendRuntimeTrace({ type: "breadcrumb", action: "SaveBook: error", traceId, error: String(nextError?.message || nextError) });
          onError(nextError.message);
        } finally {
          setSaving(false);
          appendRuntimeTrace({ type: "breadcrumb", action: "SaveBook: finished", traceId });
        }
      }}
    >
      <div>
        <p className="admin-page__eyebrow">Editor</p>
        <h2 className="admin-page__title" style={{ fontSize: "2rem" }}>{selectedBook ? "Edit Book" : "Create Book"}</h2>
      </div>

      <div className="admin-form__grid">
        {[
          ["id", "ID"],
          ["slug", "Slug"],
          ["title", "Title"],
          ["subtitle", "Subtitle"],
          ["displayOrder", "Display Order"],
          ["shortDescription", "Short Description", true],
          ["longDescription", "Long Description", true],
          ["description", "SEO Description", true],
          ["genres", "Genres (one per line)", true],
          ["themes", "Themes (one per line)", true],
          ["publicationDate", "Publication Date"],
          ["publishedAt", "Published At"],
          ["pages", "Pages"],
          ["language", "Language"],
          ["isbn", "ISBN"],
          ["publisher", "Publisher"],
          ["readingTime", "Reading Time"],
          ["relatedBooks", "Related Books IDs", true],
          ["relatedBlogIds", "Related Blog IDs", true],
          ["synopsis", "Synopsis (one per line)", true],
          ["discoveries", "Discoveries (one per line)", true],
          ["whoThisBookIsFor", "Who This Book Is For", true],
          ["favoriteQuotes", "Favorite Quotes", true],
          ["formatsJson", "Formats JSON", true],
          ["seoJson", "SEO JSON", true],
          ["editionsJson", "Editions JSON", true],
        ].map(([key, label, isFull]) => (
          <div key={key} className={`admin-form__field ${isFull ? "admin-form__field--full" : ""}`.trim()}>
            <label htmlFor={`book-${key}`}>{label}</label>
            {String(key).endsWith("Json") || ["shortDescription", "longDescription", "description", "genres", "themes", "relatedBooks", "relatedBlogIds", "synopsis", "discoveries", "whoThisBookIsFor", "favoriteQuotes"].includes(key)
              ? <textarea id={`book-${key}`} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
              : <input id={`book-${key}`} value={form[key]} onChange={(event) => {
                const nextValue = event.target.value;
                if (key === "title") {
                  setForm((current) => ({
                    ...current,
                    title: nextValue,
                    slug: slugTouched ? current.slug : generateSlug(nextValue),
                  }));
                  return;
                }

                if (key === "slug") {
                  setSlugTouched(true);
                }

                setForm((current) => ({ ...current, [key]: nextValue }));
              }} />}
          </div>
        ))}
        <div className="admin-form__field">
          <label htmlFor="book-status">Status</label>
          <select id="book-status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
            <option value="published">Published</option>
            <option value="coming_soon">Coming Soon</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.75rem" }}>Buy Now Links</label>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {purchaseRows.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr auto", gap: "0.5rem", alignItems: "center" }}>
                <input
                  value={row.key}
                  onChange={(e) => setPurchaseRows((current) => current.map((r, j) => j === i ? { ...r, key: e.target.value } : r))}
                  placeholder="amazon / flipkart / goodreads…"
                  style={{ padding: "0.45rem 0.6rem", border: "1px solid #ccc", borderRadius: "0.5rem", fontFamily: "inherit" }}
                />
                <input
                  type="url"
                  value={row.url}
                  onChange={(e) => setPurchaseRows((current) => current.map((r, j) => j === i ? { ...r, url: e.target.value } : r))}
                  placeholder="https://..."
                  style={{ padding: "0.45rem 0.6rem", border: "1px solid #ccc", borderRadius: "0.5rem", fontFamily: "inherit" }}
                />
                <button
                  type="button"
                  onClick={() => setPurchaseRows((current) => current.filter((_, j) => j !== i))}
                  style={{ padding: "0.45rem 0.75rem", borderRadius: "0.5rem", background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer", fontWeight: "700" }}
                >✕</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPurchaseRows((current) => [...current, { key: "", url: "" }])}
              style={{ justifySelf: "start", padding: "0.45rem 1rem", borderRadius: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontWeight: "600", marginTop: "0.25rem" }}
            >+ Add Link</button>
          </div>
        </div>
      </div>

      <div className="admin-card admin-media-upload-grid">
        <p className="admin-card__label">Cover Uploads</p>
        <p className="admin-meta-note">Uploading here updates the matching edition cover URLs inside the editions JSON automatically.</p>
        {[
          ["english", "frontCover", "English Front Cover"],
          ["english", "fullCover", "English Full Cover"],
          ["hindi", "frontCover", "Hindi Front Cover"],
          ["hindi", "fullCover", "Hindi Full Cover"],
        ].map(([editionKey, coverKey, label]) => (
          <div key={`${editionKey}-${coverKey}`} className="admin-cover-upload-row">
            <label>{label}</label>
            {getCurrentCoverUrl(editionKey, coverKey) ? (
              <div className="admin-cover-upload-preview">
                <img src={getCurrentCoverUrl(editionKey, coverKey)} alt={`${label} current`} className="admin-media-thumb" loading="lazy" />
                <a href={getCurrentCoverUrl(editionKey, coverKey)} target="_blank" rel="noopener noreferrer" className="admin-link-button">
                  View Current Image
                </a>
              </div>
            ) : (
              <p className="admin-meta-note">No image set yet.</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                try {
                  const uploaded = await uploadAdminMediaFile(file, `covers/${form.id || generateSlug(form.title) || "book"}`);
                  updateEditionCover(editionKey, coverKey, uploaded.publicUrl);
                } catch (nextError) {
                  onError(nextError.message);
                } finally {
                  event.target.value = "";
                }
              }}
            />
          </div>
        ))}
      </div>

      <div className="admin-form__actions">
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Book"}</Button>
        <Button type="button" variant="outline" onClick={onReset}>Reset</Button>
      </div>

      {selectedBook ? (
        <div className="admin-card admin-audit-card">
          <p className="admin-card__label">Audit Info</p>
          <div className="admin-audit-grid">
            {[
              ["Created", selectedBook.createdAt],
              ["Updated", selectedBook.updatedAt],
              ["Published", selectedBook.publishedAt],
              ["Archived", selectedBook.deletedAt],
            ].map(([label, value]) => (
              <div key={label} className="admin-audit-item">
                <span>{label}</span>
                <strong>{value ? new Date(value).toLocaleString() : "—"}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}

function AdminBooks() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreating = window.location.pathname.endsWith("/new");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [showArchived, setShowArchived] = useState(searchParams.get("archived") === "1");
  const activeStatus = searchParams.get("status") || "all";
  const [managingLinksFor, setManagingLinksFor] = useState(null); // { bookId, editionKey }
  const [linkEdits, setLinkEdits] = useState([]); // [{ key, url }]
  const [linkSaving, setLinkSaving] = useState(false);

  async function loadBooks(includeArchived = showArchived) {
    const nextBooks = await fetchAdminBooks({ includeArchived });
    setBooks(nextBooks);
  }

  useEffect(() => {
    let active = true;

    fetchAdminBooks({ includeArchived: showArchived })
      .then((nextBooks) => {
        if (active) {
          setBooks(nextBooks);
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError.message);
        }
      });

    return () => {
      active = false;
    };
  }, [showArchived]);

  const selectedBook = useMemo(() => books.find((item) => item.id === bookId || item.slug === bookId) || null, [bookId, books]);
  const filteredBooks = useMemo(() => {
    if (activeStatus === "all") {
      return books;
    }

    if (activeStatus === "draft") {
      return books.filter((book) => ["draft", "coming soon"].includes(String(book.status || "").toLowerCase()));
    }

    return books.filter((book) => String(book.status || "").toLowerCase() === activeStatus.replace(/_/g, " "));
  }, [activeStatus, books]);
  const initialForm = useMemo(() => buildBookForm(selectedBook), [selectedBook]);
  const formKey = isCreating ? "book-new" : selectedBook?.id || bookId || "book-default";

  // Extract links from an edition — handles both purchaseLinks and retailers formats
  function extractEditionLinks(ed, bookPurchaseLinks = {}) {
    const links = {};
    const editionPurchaseLinks = Object.keys(ed.purchaseLinks || {}).length > 0
      ? (ed.purchaseLinks || {})
      : (bookPurchaseLinks || {});

    Object.entries(editionPurchaseLinks).forEach(([key, url]) => {
      if (typeof url === "string" && /^https?:\/\//i.test(url.trim())) {
        links[key] = url.trim();
      }
    });

    Object.entries(ed.retailers || {}).forEach(([key, r]) => {
      const url = typeof r === "string" ? r : (r?.url || r?.href || "");
      if ((typeof r === "string" || r?.available !== false) && typeof url === "string" && /^https?:\/\//i.test(url.trim())) {
        const label = (typeof r === "object" && r?.name) ? r.name : key;
        if (!links[label]) {
          links[label] = url.trim();
        }
      }
    });

    return links;
  }

  // Flatten each book's editions into separate rows
  const editionRows = useMemo(() => {
    const rows = [];
    filteredBooks.forEach((book) => {
      const editions = book.editions || {};
      const editionKeys = Object.keys(editions);
      if (editionKeys.length > 0) {
        editionKeys.forEach((key) => {
          const ed = editions[key];
          rows.push({
            ...book,
            _editionKey: key,
            _editionLabel: ed.label || key,
            _editionLinks: extractEditionLinks(ed, book.purchaseLinks || {}),
            _languageCode: ed.languageCode || key,
          });
        });
      } else {
        rows.push({ ...book, _editionKey: null, _editionLabel: null, _editionLinks: book.purchaseLinks || {}, _languageCode: null });
      }
    });
    return rows;
  }, [filteredBooks]);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Books</p>
          <h1 className="admin-page__title">Manage books and editions</h1>
          <p className="admin-page__description">Create, update, and archive titles without editing source files.</p>
        </div>
        <div className="admin-page__actions">
          <div className="admin-filter-group" role="tablist" aria-label="Book status filters">
            {[
              ["all", "All"],
              ["draft", "Draft + Coming Soon"],
              ["published", "Published"],
              ["archived", "Archived"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`admin-filter-chip ${activeStatus === value ? "admin-filter-chip--active" : ""}`.trim()}
                onClick={() => {
                  const nextShowArchived = value === "archived";
                  setShowArchived(nextShowArchived);
                  setSearchParams((current) => {
                    const nextParams = new URLSearchParams(current);
                    if (value === "all") {
                      nextParams.delete("status");
                    } else {
                      nextParams.set("status", value);
                    }

                    if (nextShowArchived) {
                      nextParams.set("archived", "1");
                    } else {
                      nextParams.delete("archived");
                    }

                    return nextParams;
                  });
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => {
                const nextChecked = event.target.checked;
                setShowArchived(nextChecked);
                setSearchParams((current) => {
                  const nextParams = new URLSearchParams(current);
                  if (nextChecked) {
                    nextParams.set("archived", "1");
                  } else {
                    nextParams.delete("archived");
                  }
                  return nextParams;
                });
              }}
            />
            <span>Show archived</span>
          </label>
          <Link to="/admin/books/new" className="admin-link-button">Create Book</Link>
        </div>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}
      {books.length > 0 && filteredBooks.length === 0 ? (
        <div className="admin-empty">No books match the current filter. Try a different status or turn off archived mode.</div>
      ) : null}

      <div className="admin-grid">
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Title / Edition</th>
                <th>Status</th>
                <th>Buy Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {editionRows.flatMap((row) => {
                const rowKey = row._editionKey ? `${row.id}-${row._editionKey}` : row.id;
                const isManaging = managingLinksFor?.bookId === row.id && managingLinksFor?.editionKey === row._editionKey;
                const result = [
                    <tr key={rowKey}>
                      <td data-label="Title / Edition">
                        <strong>{row.title}</strong>
                        {row._editionLabel && (
                          <span style={{ marginLeft: "0.5rem", padding: "0.15rem 0.5rem", borderRadius: "999px", background: row._languageCode === "hi" ? "#fef3c7" : "#dbeafe", color: row._languageCode === "hi" ? "#92400e" : "#1e40af", fontSize: "0.78rem", fontWeight: "600" }}>
                            {row._editionLabel}
                          </span>
                        )}
                      </td>
                      <td data-label="Status"><span className={`admin-status-pill admin-status-pill--${String(row.status || "draft").toLowerCase().replace(/\s+/g, "_")}`}>{row.status}</span></td>
                      <td data-label="Buy Links">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                          {Object.entries(row._editionLinks).length > 0
                            ? Object.entries(row._editionLinks).map(([label, url]) => (
                                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                                  style={{ padding: "0.2rem 0.6rem", borderRadius: "0.4rem", background: "var(--color-primary)", color: "white", fontSize: "0.8rem", fontWeight: "600", textDecoration: "none" }}>
                                  {label} ↗
                                </a>
                              ))
                            : <span style={{ color: "#999", fontSize: "0.85rem" }}>No links</span>
                          }
                        </div>
                      </td>
                      <td data-label="Actions">
                        <div className="admin-table__actions">
                          <Link to={`/admin/books/${row.id}`} className="admin-link-button">Edit Book</Link>
                          <button type="button" className="admin-inline-button"
                            onClick={() => {
                              if (isManaging) { setManagingLinksFor(null); return; }
                              setManagingLinksFor({ bookId: row.id, editionKey: row._editionKey });
                              const current = Object.entries(row._editionLinks);
                              setLinkEdits(current.length > 0 ? current.map(([k, v]) => ({ key: k, url: v })) : [{ key: "", url: "" }]);
                            }}>
                            {isManaging ? "Close Links" : "Manage Links"}
                          </button>
                          {row.deletedAt ? (
                            <button type="button" className="admin-inline-button" onClick={async () => { await restoreAdminBook(row.id); await loadBooks(showArchived); }}>Restore</button>
                          ) : (
                            <button type="button" className="admin-inline-button admin-inline-button--danger"
                              onClick={async () => {
                                if (!window.confirm(`Delete ${row.title}?`)) return;
                                await deleteAdminBook(row.id);
                                await loadBooks(showArchived);
                                if (bookId === row.id) navigate("/admin/books");
                              }}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                ];
                if (isManaging) result.push(
                      <tr key={`${rowKey}-links`}>
                        <td colSpan={4} style={{ background: "#f9f3e6", padding: "1rem", borderTop: "2px solid var(--color-primary)" }}>
                          <p style={{ fontWeight: "700", marginBottom: "0.75rem" }}>
                            Buy Links — {row.title} {row._editionLabel ? `(${row._editionLabel})` : ""}
                          </p>
                          <div style={{ display: "grid", gap: "0.5rem" }}>
                            {linkEdits.map((lnk, i) => (
                              <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr auto", gap: "0.5rem", alignItems: "center" }}>
                                <input value={lnk.key} placeholder="amazon / flipkart…"
                                  onChange={(e) => setLinkEdits((cur) => cur.map((l, j) => j === i ? { ...l, key: e.target.value } : l))}
                                  style={{ padding: "0.45rem 0.6rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
                                <input type="url" value={lnk.url} placeholder="https://..."
                                  onChange={(e) => setLinkEdits((cur) => cur.map((l, j) => j === i ? { ...l, url: e.target.value } : l))}
                                  style={{ padding: "0.45rem 0.6rem", border: "1px solid #ccc", borderRadius: "0.5rem" }} />
                                <button type="button"
                                  onClick={() => setLinkEdits((cur) => cur.filter((_, j) => j !== i))}
                                  style={{ padding: "0.45rem 0.7rem", borderRadius: "0.5rem", background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer", fontWeight: "700" }}>✕</button>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                            <button type="button"
                              onClick={() => setLinkEdits((cur) => [...cur, { key: "", url: "" }])}
                              style={{ padding: "0.45rem 1rem", borderRadius: "0.5rem", background: "#e0f2fe", color: "#0369a1", border: "none", cursor: "pointer", fontWeight: "600" }}>+ Add Link</button>
                            <button type="button" disabled={linkSaving}
                              onClick={async () => {
                                setLinkSaving(true);
                                const traceId = createRuntimeTraceId("SaveLinks");
                                try {
                                  await withRuntimeTrace(traceId, async () => {
                                    appendRuntimeTrace({ type: "breadcrumb", action: "SaveLinks: click", traceId, bookId: row.id, editionKey: row._editionKey || null });
                                    const newLinks = {};
                                    linkEdits.forEach(({ key, url }) => { if (key && url) newLinks[key] = url; });
                                    appendRuntimeTrace({ type: "breadcrumb", action: "SaveLinks: validation passed", traceId, keys: Object.keys(newLinks), bookId: row.id, editionKey: row._editionKey || null });
                                    appendRuntimeTrace({ type: "breadcrumb", action: "SaveLinks: calling updateAdminBookEditionLinks", traceId, bookId: row.id, editionKey: row._editionKey || null });
                                    await updateAdminBookEditionLinks(row.id, row._editionKey, newLinks);
                                    appendRuntimeTrace({ type: "breadcrumb", action: "SaveLinks: returned from updateAdminBookEditionLinks", traceId, bookId: row.id, editionKey: row._editionKey || null });
                                    await loadBooks(showArchived);
                                    appendRuntimeTrace({ type: "breadcrumb", action: "SaveLinks: reloading books complete", traceId, bookId: row.id, editionKey: row._editionKey || null });
                                    setManagingLinksFor(null);
                                    setError("");
                                  });
                                } catch (err) {
                                  appendRuntimeTrace({ type: "breadcrumb", action: "SaveLinks: error", traceId, bookId: row.id, editionKey: row._editionKey || null, error: String(err?.message || err) });
                                  setError(err.message);
                                }
                                finally {
                                  setLinkSaving(false);
                                  appendRuntimeTrace({ type: "breadcrumb", action: "SaveLinks: finished", traceId, bookId: row.id, editionKey: row._editionKey || null });
                                }
                              }}
                              style={{ padding: "0.45rem 1.25rem", borderRadius: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontWeight: "600" }}>
                              {linkSaving ? "Saving…" : "Save Links"}
                            </button>
                            <button type="button" onClick={() => setManagingLinksFor(null)}
                              style={{ padding: "0.45rem 1rem", borderRadius: "0.5rem", background: "#e5e7eb", color: "#374151", border: "none", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                );
                return result;
              })}
            </tbody>
          </table>
        </div>

        <BookEditorForm
          key={formKey}
          initialForm={initialForm}
          selectedBook={selectedBook}
          onError={setError}
          onSaved={async () => {
            await loadBooks(showArchived);
          }}
          onReset={() => navigate("/admin/books")}
        />
      </div>
    </section>
  );
}

export default AdminBooks;