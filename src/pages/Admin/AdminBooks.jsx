import "./Admin.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import { deleteAdminBook, fetchAdminBooks, generateSlug, getDefaultBookForm, restoreAdminBook, upsertAdminBook, updateAdminBookEditionLinks, uploadAdminMediaFile } from "../../services/adminService";
import { appendRuntimeTrace, createRuntimeTraceId, withRuntimeTrace } from "../../utils/runtimeTrace";

const BOOK_FORM_SECTIONS = [
  {
    title: "Core Details",
    description: "Define the public identity and summary copy for this title.",
    fields: [
      ["id", "Book ID"],
      ["slug", "Slug"],
      ["title", "Title"],
      ["subtitle", "Subtitle"],
      ["displayOrder", "Display Order"],
      ["shortDescription", "Short Description", true],
      ["longDescription", "Long Description", true],
      ["description", "SEO Description", true],
    ],
  },
  {
    title: "Publishing",
    description: "Track status, metadata, and publishing timeline.",
    fields: [
      ["publicationDate", "Publication Date"],
      ["publishedAt", "Published At"],
      ["pages", "Pages"],
      ["language", "Language"],
      ["isbn", "ISBN"],
      ["publisher", "Publisher"],
      ["readingTime", "Reading Time"],
      ["formatsJson", "Formats JSON", true],
    ],
  },
  {
    title: "Reader Context",
    description: "Connect themes, takeaways, and related content.",
    fields: [
      ["genres", "Genres (one per line)", true],
      ["themes", "Themes (one per line)", true],
      ["synopsis", "Synopsis (one per line)", true],
      ["discoveries", "Discoveries (one per line)", true],
      ["whoThisBookIsFor", "Who This Book Is For", true],
      ["favoriteQuotes", "Favorite Quotes", true],
      ["relatedBooks", "Related Books IDs", true],
      ["relatedBlogIds", "Related Blog IDs", true],
    ],
  },
  {
    title: "Advanced JSON",
    description: "Edit edition-specific and SEO structures directly when needed.",
    fields: [
      ["seoJson", "SEO JSON", true],
      ["editionsJson", "Editions JSON", true],
    ],
  },
];

function formatStatusValue(status = "draft") {
  return String(status || "draft").toLowerCase().replace(/\s+/g, "_");
}

function getStatusCount(books, status) {
  if (status === "archived") {
    return books.filter((book) => Boolean(book.deletedAt)).length;
  }

  if (status === "draft") {
    return books.filter((book) => ["draft", "coming soon"].includes(String(book.status || "").toLowerCase())).length;
  }

  return books.filter((book) => String(book.status || "").toLowerCase() === status).length;
}

function getEditionStatusText(row) {
  const linkCount = Object.keys(row._editionLinks || {}).length;
  if (linkCount > 0) {
    return `${linkCount} live ${linkCount === 1 ? "link" : "links"}`;
  }

  return row.deletedAt ? "Archived" : "No purchase links";
}

function getBookSearchText(row) {
  return [
    row.title,
    row.subtitle,
    row.id,
    row.slug,
    row._editionLabel,
    row.status,
  ].filter(Boolean).join(" ").toLowerCase();
}

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

  const [purchaseRows, setPurchaseRows] = useState(() => {
    try {
      const parsed = JSON.parse(initialForm.purchaseLinksJson || "{}");
      return Object.entries(parsed).length > 0
        ? Object.entries(parsed).map(([key, url]) => ({ key, url }))
        : [{ key: "amazon", url: "" }];
    } catch {
      return [{ key: "amazon", url: "" }];
    }
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

  function setFieldValue(key, nextValue) {
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
  }

  return (
    <form
      className="admin-form admin-books-editor"
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
      <div className="admin-books-editor__intro">
        <div>
          <p className="admin-page__eyebrow">Editor</p>
          <h2 className="admin-books-editor__title">{selectedBook ? "Edit Book" : "Create Book"}</h2>
          <p className="admin-meta-note">Update the main listing, edition metadata, links, and cover assets from one workspace.</p>
        </div>
        <div className="admin-books-editor__headline-card">
          <span className={`admin-status-pill admin-status-pill--${formatStatusValue(form.status)}`}>{String(form.status || "draft").replace(/_/g, " ")}</span>
          <strong>{form.title || "Untitled Book"}</strong>
          <span>{form.slug || "slug-will-appear-here"}</span>
        </div>
      </div>

      <div className="admin-books-editor__sections">
        {BOOK_FORM_SECTIONS.map((section) => (
          <section key={section.title} className="admin-card admin-books-editor__section">
            <div className="admin-books-editor__section-header">
              <div>
                <p className="admin-card__label">{section.title}</p>
                <h3>{section.title}</h3>
              </div>
              <p className="admin-meta-note">{section.description}</p>
            </div>

            <div className="admin-form__grid">
              {section.fields.map(([key, label, isFull]) => (
                <div key={key} className={`admin-form__field ${isFull ? "admin-form__field--full" : ""}`.trim()}>
                  <label htmlFor={`book-${key}`}>{label}</label>
                  {String(key).endsWith("Json") || ["shortDescription", "longDescription", "description", "genres", "themes", "relatedBooks", "relatedBlogIds", "synopsis", "discoveries", "whoThisBookIsFor", "favoriteQuotes"].includes(key)
                    ? <textarea id={`book-${key}`} value={form[key]} onChange={(event) => setFieldValue(key, event.target.value)} />
                    : <input id={`book-${key}`} value={form[key]} onChange={(event) => setFieldValue(key, event.target.value)} />}
                </div>
              ))}
              {section.title === "Publishing" ? (
                <div className="admin-form__field">
                  <label htmlFor="book-status">Status</label>
                  <select id="book-status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
                    <option value="published">Published</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <div className="admin-card admin-books-editor__links">
        <div className="admin-books-editor__section-header">
          <div>
            <p className="admin-card__label">Store Links</p>
            <h3>Primary Purchase Links</h3>
          </div>
          <p className="admin-meta-note">These book-level links are used as a fallback when an edition does not define its own retailers.</p>
        </div>

        <div className="admin-books-link-grid">
          {purchaseRows.map((row, i) => (
            <div key={i} className="admin-books-link-row">
              <input
                value={row.key}
                onChange={(e) => setPurchaseRows((current) => current.map((r, j) => j === i ? { ...r, key: e.target.value } : r))}
                placeholder="amazon / flipkart / goodreads…"
              />
              <input
                type="url"
                value={row.url}
                onChange={(e) => setPurchaseRows((current) => current.map((r, j) => j === i ? { ...r, url: e.target.value } : r))}
                placeholder="https://..."
              />
              <button
                type="button"
                className="admin-books-link-remove"
                onClick={() => setPurchaseRows((current) => current.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-inline-button"
            onClick={() => setPurchaseRows((current) => [...current, { key: "", url: "" }])}
          >
            + Add Link
          </button>
        </div>
      </div>

      <div className="admin-card admin-media-upload-grid">
        <div className="admin-books-editor__section-header">
          <div>
            <p className="admin-card__label">Cover Assets</p>
            <h3>Edition Cover Uploads</h3>
          </div>
          <p className="admin-meta-note">Uploading here updates the matching edition cover URLs inside the editions JSON automatically.</p>
        </div>
        <div className="admin-books-cover-grid">
          {[
            ["english", "frontCover", "English Front Cover"],
            ["english", "fullCover", "English Full Cover"],
            ["hindi", "frontCover", "Hindi Front Cover"],
            ["hindi", "fullCover", "Hindi Full Cover"],
          ].map(([editionKey, coverKey, label]) => (
            <div key={`${editionKey}-${coverKey}`} className="admin-cover-upload-row admin-books-cover-card">
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
      </div>

      <div className="admin-form__actions admin-books-editor__actions">
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
          setLoading(false);
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError.message);
          setLoading(false);
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
  const summaryCards = useMemo(() => ([
    { label: "Total Titles", value: books.length },
    { label: "Draft + Coming Soon", value: getStatusCount(books, "draft") },
    { label: "Published", value: getStatusCount(books, "published") },
    { label: "Archived", value: getStatusCount(books, "archived") },
  ]), [books]);
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
  const visibleEditionRows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return editionRows;
    }

    return editionRows.filter((row) => getBookSearchText(row).includes(normalizedQuery));
  }, [editionRows, searchQuery]);
  const selectedEditionSummary = useMemo(() => {
    if (!selectedBook) {
      return null;
    }

    const editions = Object.entries(selectedBook.editions || {});
    return {
      editionCount: editions.length,
      activeLinks: editions.reduce((count, [, edition]) => count + Object.keys(extractEditionLinks(edition, selectedBook.purchaseLinks || {})).length, 0),
    };
  }, [selectedBook]);

  return (
    <section className="admin-page admin-books-page">
      <header className="admin-card admin-hero admin-books-hero">
        <div className="admin-hero__content admin-books-hero__content">
          <div>
            <p className="admin-page__eyebrow">Books</p>
            <h1 className="admin-page__title">Books studio</h1>
            <p className="admin-page__description">Manage titles, edition purchase links, and cover assets from a calmer, editor-first workspace.</p>
          </div>
          <div className="admin-hero__highlights" aria-label="Book summary">
            {summaryCards.map((item) => (
              <article key={item.label} className="admin-hero__badge">
                <p>{item.label}</p>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </header>

      <section className="admin-section">
        <div className="admin-section__header">
          <div>
            <p className="admin-card__label">Catalog</p>
            <h2 className="admin-section__title">Browse and manage editions</h2>
          </div>
          <div className="admin-page__actions">
            <input
              className="admin-books-toolbar__search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title, slug, edition, or status"
              aria-label="Search books"
            />
            <Link to="/admin/books/new" className="admin-link-button">Create Book</Link>
          </div>
        </div>

        <div className="admin-page__actions admin-books-toolbar">
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
        </div>
      </section>

      {error ? <p className="admin-auth__error">{error}</p> : null}
      {loading ? <p className="admin-meta-note">Loading books…</p> : null}
      {books.length > 0 && filteredBooks.length === 0 ? (
        <div className="admin-empty">No books match the current filter. Try a different status or turn off archived mode.</div>
      ) : null}
      {filteredBooks.length > 0 && visibleEditionRows.length === 0 ? (
        <div className="admin-empty">No edition rows match your search. Try a different keyword.</div>
      ) : null}

      <div className="admin-grid admin-books-layout">
        <section className="admin-card admin-books-catalog">
          <div className="admin-books-catalog__header">
            <div>
              <p className="admin-card__label">Edition Catalog</p>
              <h2>Titles and editions</h2>
            </div>
            <span className="admin-meta-note">{visibleEditionRows.length} visible rows</span>
          </div>

          <div className="admin-books-catalog__list">
            {visibleEditionRows.map((row) => {
              const rowKey = row._editionKey ? `${row.id}-${row._editionKey}` : row.id;
              const isManaging = managingLinksFor?.bookId === row.id && managingLinksFor?.editionKey === row._editionKey;

              return (
                <article key={rowKey} className={`admin-books-card ${selectedBook?.id === row.id ? "admin-books-card--selected" : ""}`.trim()}>
                  <div className="admin-books-card__header">
                    <div>
                      <div className="admin-books-card__title-row">
                        <h3>{row.title}</h3>
                        {row._editionLabel ? (
                          <span className={`admin-books-card__edition-pill admin-books-card__edition-pill--${row._languageCode === "hi" ? "hi" : "default"}`}>{row._editionLabel}</span>
                        ) : null}
                      </div>
                      <p>{row.subtitle || row.slug || row.id}</p>
                    </div>
                    <span className={`admin-status-pill admin-status-pill--${formatStatusValue(row.status)}`}>{row.status}</span>
                  </div>

                  <div className="admin-books-card__meta">
                    <span>{getEditionStatusText(row)}</span>
                    <span>{row.deletedAt ? "Archived title" : row._editionKey ? `Edition key: ${row._editionKey}` : "Book-level links only"}</span>
                  </div>

                  <div className="admin-books-card__links">
                    {Object.entries(row._editionLinks).length > 0
                      ? Object.entries(row._editionLinks).map(([label, url]) => (
                          <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="admin-books-card__link-chip">
                            {label}
                          </a>
                        ))
                      : <span className="admin-meta-note">No purchase links yet.</span>}
                  </div>

                  <div className="admin-table__actions admin-books-card__actions">
                    <Link to={`/admin/books/${row.id}`} className="admin-link-button">Edit Book</Link>
                    <button
                      type="button"
                      className="admin-inline-button"
                      onClick={() => {
                        if (isManaging) {
                          setManagingLinksFor(null);
                          return;
                        }
                        setManagingLinksFor({ bookId: row.id, editionKey: row._editionKey });
                        const current = Object.entries(row._editionLinks);
                        setLinkEdits(current.length > 0 ? current.map(([k, v]) => ({ key: k, url: v })) : [{ key: "", url: "" }]);
                      }}
                    >
                      {isManaging ? "Close Links" : "Manage Links"}
                    </button>
                    {row.deletedAt ? (
                      <button type="button" className="admin-inline-button" onClick={async () => { await restoreAdminBook(row.id); await loadBooks(showArchived); }}>
                        Restore
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-inline-button admin-inline-button--danger"
                        onClick={async () => {
                          if (!window.confirm(`Delete ${row.title}?`)) return;
                          await deleteAdminBook(row.id);
                          await loadBooks(showArchived);
                          if (bookId === row.id) navigate("/admin/books");
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {isManaging ? (
                    <div className="admin-books-links-panel">
                      <div className="admin-books-links-panel__header">
                        <div>
                          <p className="admin-card__label">Edition Links</p>
                          <h4>{row.title}{row._editionLabel ? ` · ${row._editionLabel}` : ""}</h4>
                        </div>
                        <span className="admin-meta-note">Update the live retailer links for this edition.</span>
                      </div>

                      <div className="admin-books-link-grid">
                        {linkEdits.map((lnk, i) => (
                          <div key={i} className="admin-books-link-row">
                            <input
                              value={lnk.key}
                              placeholder="amazon / flipkart…"
                              onChange={(e) => setLinkEdits((cur) => cur.map((l, j) => j === i ? { ...l, key: e.target.value } : l))}
                            />
                            <input
                              type="url"
                              value={lnk.url}
                              placeholder="https://..."
                              onChange={(e) => setLinkEdits((cur) => cur.map((l, j) => j === i ? { ...l, url: e.target.value } : l))}
                            />
                            <button type="button" className="admin-books-link-remove" onClick={() => setLinkEdits((cur) => cur.filter((_, j) => j !== i))}>
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="admin-books-links-panel__actions">
                        <button type="button" className="admin-inline-button" onClick={() => setLinkEdits((cur) => [...cur, { key: "", url: "" }])}>+ Add Link</button>
                        <button
                          type="button"
                          className="admin-link-button"
                          disabled={linkSaving}
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
                            } finally {
                              setLinkSaving(false);
                              appendRuntimeTrace({ type: "breadcrumb", action: "SaveLinks: finished", traceId, bookId: row.id, editionKey: row._editionKey || null });
                            }
                          }}
                        >
                          {linkSaving ? "Saving…" : "Save Links"}
                        </button>
                        <button type="button" className="admin-inline-button" onClick={() => setManagingLinksFor(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <aside className="admin-books-editor-panel">
          {selectedEditionSummary ? (
            <div className="admin-card admin-books-editor-panel__summary">
              <p className="admin-card__label">Selected Title</p>
              <h2>{selectedBook.title}</h2>
              <div className="admin-books-editor-panel__summary-grid">
                <div>
                  <span>Editions</span>
                  <strong>{selectedEditionSummary.editionCount}</strong>
                </div>
                <div>
                  <span>Active Links</span>
                  <strong>{selectedEditionSummary.activeLinks}</strong>
                </div>
              </div>
            </div>
          ) : null}

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
        </aside>
      </div>
    </section>
  );
}

export default AdminBooks;