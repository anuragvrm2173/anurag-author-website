import "./Admin.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import RichTextEditor from "../../components/forms/RichTextEditor/RichTextEditor";
import Button from "../../components/ui/Button/Button";
import { deleteAdminBlogPost, fetchAdminBlogPosts, generateSlug, getDefaultBlogForm, upsertAdminBlogPost } from "../../services/adminService";

function buildBlogForm(post) {
  if (!post) {
    return getDefaultBlogForm();
  }

  return {
    id: post.id || "",
    slug: post.slug || post.id || "",
    title: post.title || "",
    category: post.category || "",
    excerpt: post.excerpt || "",
    status: post.status || "draft",
    displayOrder: post.displayOrder ?? 0,
    readingTime: post.readingTime || "",
    publishedAt: post.publishedAt || "",
    featured: Boolean(post.featured),
    relatedBookIds: (post.relatedBookIds || []).join("\n"),
    visualJson: JSON.stringify(post.visual || {}, null, 2),
    bodyHtml: post.bodyHtml || "",
    contentSectionsJson: JSON.stringify(post.contentSections || [], null, 2),
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
  };
}

function BlogEditorForm({ initialForm, selectedPost, onSaved, onError, onReset }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialForm.slug));

  return (
    <form
      className="admin-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        onError("");
        try {
          await upsertAdminBlogPost(form);
          await onSaved(form);
          navigate(`/admin/blog/${form.id || form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
        } catch (nextError) {
          onError(nextError.message);
        } finally {
          setSaving(false);
        }
      }}
    >
      <div>
        <p className="admin-page__eyebrow">Editor</p>
        <h2 className="admin-page__title" style={{ fontSize: "2rem" }}>{selectedPost ? "Edit Post" : "Create Post"}</h2>
      </div>

      <div className="admin-form__grid">
        {[
          ["id", "ID"],
          ["slug", "Slug"],
          ["title", "Title"],
          ["category", "Category"],
          ["displayOrder", "Display Order"],
          ["excerpt", "Excerpt", true],
          ["status", "Status"],
          ["readingTime", "Reading Time"],
          ["publishedAt", "Publish Date"],
          ["relatedBookIds", "Related Book IDs", true],
          ["contentSectionsJson", "Content Sections JSON", true],
          ["visualJson", "Visual JSON", true],
          ["seoTitle", "SEO Title", true],
          ["seoDescription", "Meta Description", true],
        ].map(([key, label, isFull]) => (
          <div key={key} className={`admin-form__field ${isFull ? "admin-form__field--full" : ""}`.trim()}>
            <label htmlFor={`blog-${key}`}>{label}</label>
            {key === "status" ? (
              <select id={`blog-${key}`} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            ) : isFull
              ? <textarea id={`blog-${key}`} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
              : <input id={`blog-${key}`} value={form[key]} onChange={(event) => {
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
        <div className="admin-form__field admin-form__field--full">
          <RichTextEditor
            label="Body"
            value={form.bodyHtml}
            onChange={(nextValue) => setForm((current) => ({ ...current, bodyHtml: nextValue }))}
            helperText="Use the editor for the article body. Legacy content sections remain available below if you still want structured fallback content."
          />
        </div>
        <div className="admin-form__field">
          <label htmlFor="blog-featured">Featured</label>
          <select id="blog-featured" value={form.featured ? "yes" : "no"} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.value === "yes" }))}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <div className="admin-form__actions">
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Post"}</Button>
        <Button type="button" variant="outline" onClick={onReset}>Reset</Button>
      </div>
    </form>
  );
}

function AdminBlog() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isCreating = window.location.pathname.endsWith("/new");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [revisionDraft, setRevisionDraft] = useState(null);

  useEffect(() => {
    fetchAdminBlogPosts().then(setPosts).catch((nextError) => setError(nextError.message));
  }, []);

  const selectedPost = useMemo(() => posts.find((item) => item.id === postId || item.slug === postId) || null, [postId, posts]);
  const activeRevisionDraft = useMemo(() => {
    if (!revisionDraft || !selectedPost || revisionDraft.sourceId !== selectedPost.id) {
      return null;
    }

    return revisionDraft;
  }, [revisionDraft, selectedPost]);
  const initialForm = useMemo(() => {
    if (activeRevisionDraft) {
      return activeRevisionDraft.form;
    }

    return buildBlogForm(selectedPost);
  }, [activeRevisionDraft, selectedPost]);
  const formKey = isCreating
    ? "blog-new"
    : `${selectedPost?.id || postId || "blog-default"}-${activeRevisionDraft?.key || "live"}`;

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Blog</p>
          <h1 className="admin-page__title">Publish without code changes</h1>
          <p className="admin-page__description">Manage article metadata, content, SEO, and related books from one editor.</p>
        </div>
        <Link to="/admin/blog/new" className="admin-link-button">Create Post</Link>
      </header>

      {error ? <p className="admin-auth__error">{error}</p> : null}

      <div className="admin-grid">
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <strong>{post.title}</strong>
                    <div>{post.excerpt}</div>
                  </td>
                  <td>{post.category}</td>
                  <td><span className={`admin-status-pill admin-status-pill--${String(post.status || "draft").toLowerCase().replace(/\s+/g, "_")}`}>{post.status}</span></td>
                  <td>{post.publishedAt || "—"}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Link to={`/admin/blog/${post.id}`} className="admin-link-button">Edit</Link>
                      <button
                        type="button"
                        className="admin-inline-button admin-inline-button--danger"
                        onClick={async () => {
                          if (!window.confirm(`Delete ${post.title}?`)) {
                            return;
                          }

                          await deleteAdminBlogPost(post.id);
                          setPosts((current) => current.filter((item) => item.id !== post.id));
                          if (postId === post.id) {
                            navigate("/admin/blog");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <BlogEditorForm
          key={formKey}
          initialForm={initialForm}
          selectedPost={selectedPost}
          onError={setError}
          onSaved={async () => {
            setRevisionDraft(null);
            setPosts(await fetchAdminBlogPosts());
          }}
          onReset={() => navigate("/admin/blog")}
        />

        {selectedPost?.revisionHistory?.length ? (
          <article className="admin-card admin-revisions">
            <div className="admin-revisions__header">
              <div>
                <p className="admin-card__label">Revision History</p>
                <h2 className="admin-revisions__title">Previous snapshots</h2>
              </div>
              <p className="admin-meta-note">Loading a revision updates the editor only. Save the post to publish or preserve the restored version.</p>
            </div>

            <div className="admin-revisions__list">
              {[...selectedPost.revisionHistory].reverse().map((revision, index) => {
                const nextForm = {
                  ...buildBlogForm(selectedPost),
                  title: revision.title || selectedPost.title || "",
                  excerpt: revision.excerpt || "",
                  bodyHtml: revision.body_html || "",
                };

                return (
                  <section key={`${revision.edited_at || "revision"}-${index}`} className="admin-revision">
                    <div className="admin-revision__content">
                      <p className="admin-revision__time">{revision.edited_at ? new Date(revision.edited_at).toLocaleString() : "Unknown edit time"}</p>
                      <h3>{revision.title || "Untitled revision"}</h3>
                      <p>{revision.excerpt || "No excerpt captured for this revision."}</p>
                    </div>
                    <button
                      type="button"
                      className="admin-inline-button"
                      onClick={() => {
                        setRevisionDraft({
                          sourceId: selectedPost.id,
                          key: `${revision.edited_at || "revision"}-${index}`,
                          form: nextForm,
                        });
                        setError("");
                      }}
                    >
                      Load Revision
                    </button>
                  </section>
                );
              })}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}

export default AdminBlog;