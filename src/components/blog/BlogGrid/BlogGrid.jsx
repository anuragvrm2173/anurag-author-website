import BlogCard from "../BlogCard/BlogCard";
import "./BlogGrid.css";

function BlogGrid({ posts }) {
  return (
    <div className="blog-grid" role="list" aria-label="Blog posts">
      {posts.map((post) => (
        <div key={post.id} role="listitem">
          <BlogCard post={post} />
        </div>
      ))}
    </div>
  );
}

export default BlogGrid;