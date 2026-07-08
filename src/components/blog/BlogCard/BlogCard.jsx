import { Link } from "react-router-dom";

import { getBlogPostPath, getBlogVisual } from "../../../data/blog";
import "./BlogCard.css";

function BlogCard({ post, showReadLink = true }) {
	const visual = getBlogVisual(post);

  return (
    <article className="blog-card" aria-label={post.title}>
      <div className="blog-card__visual" style={{ background: visual.background }} aria-hidden="true">
        <p className="blog-card__visual-eyebrow">{visual.eyebrow}</p>
        <p className="blog-card__visual-motif">{visual.motif}</p>
      </div>
      <p className="blog-card__meta">
        <span>{post.category}</span>
        <span>•</span>
        <span>{post.publishedAt}</span>
        <span>•</span>
        <span>{post.readingTime}</span>
      </p>
      <h3 className="blog-card__title">{post.title}</h3>
      <p className="blog-card__excerpt">{post.excerpt}</p>
      {showReadLink ? (
        <Link to={getBlogPostPath(post.id)} className="blog-card__link">
          Read article
        </Link>
      ) : null}
    </article>
  );
}

export default BlogCard;