import "./BlogCard.css";

function BlogCard({ post }) {
  return (
    <article className="blog-card" aria-label={post.title}>
      <p className="blog-card__meta">
        <span>{post.category}</span>
        <span>•</span>
        <span>{post.publishedAt}</span>
        <span>•</span>
        <span>{post.readingTime}</span>
      </p>
      <h3 className="blog-card__title">{post.title}</h3>
      <p className="blog-card__excerpt">{post.excerpt}</p>
      {post.content?.length ? (
        <div className="blog-card__content">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default BlogCard;