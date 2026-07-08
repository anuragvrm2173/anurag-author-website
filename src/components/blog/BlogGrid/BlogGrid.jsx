import BlogCard from "../BlogCard/BlogCard";
import "./BlogGrid.css";

function BlogGrid({ posts, compact = false, showReadLink = true }) {
  return (
    <div className={`blog-grid ${compact ? "blog-grid--compact" : ""}`} role="list" aria-label="Blog posts">
      {posts.map((post) => (
        <div key={post.id} role="listitem">
          <BlogCard post={post} showReadLink={showReadLink} />
        </div>
      ))}
    </div>
  );
}

export default BlogGrid;