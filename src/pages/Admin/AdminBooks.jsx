import "./Admin.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import { deleteAdminBook, fetchAdminBooks, generateSlug, getDefaultBookForm, restoreAdminBook, upsertAdminBook, uploadAdminMediaFile } from "../../services/adminService";

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

  return (
    <form
      className="admin-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        onError("");
        try {
          await upsertAdminBook(form);
          await onSaved(form);
          navigate(`/admin/books/${form.id || form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
        } catch (nextError) {
          onError(nextError.message);
        } finally {
          setSaving(false);
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
          ["purchaseLinksJson", "Purchase Links JSON", true],
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
                <th>Title</th>
                <th>Status</th>
                <th>Language</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td data-label="Title">
                    <strong>{book.title}</strong>
                    <div>{book.subtitle}</div>
                  </td>
                  <td data-label="Status"><span className={`admin-status-pill admin-status-pill--${String(book.status || "draft").toLowerCase().replace(/\s+/g, "_")}`}>{book.status}</span></td>
                  <td data-label="Language">{book.language || "—"}</td>
                  <td data-label="Actions">
                    <div className="admin-table__actions">
                      <Link to={`/admin/books/${book.id}`} className="admin-link-button">Edit</Link>
                      {book.deletedAt ? (
                        <button
                          type="button"
                          className="admin-inline-button"
                          onClick={async () => {
                            await restoreAdminBook(book.id);
                            await loadBooks(showArchived);
                          }}
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="admin-inline-button admin-inline-button--danger"
                          onClick={async () => {
                            if (!window.confirm(`Delete ${book.title}?`)) {
                              return;
                            }

                            await deleteAdminBook(book.id);
                            await loadBooks(showArchived);
                            if (bookId === book.id) {
                              navigate("/admin/books");
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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