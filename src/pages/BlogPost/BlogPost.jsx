import "./BlogPost.css";

import { HelmetProvider } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import SEO from "../../components/seo/SEO";
import Container from "../../components/ui/Container/Container";
import useSiteSettings from "../../hooks/useSiteSettings";
import { getBlogPostPath, getBlogVisual } from "../../data/blog";
import usePublicContent from "../../hooks/usePublicContent";
import { getBlogPostByIdFromList, getBookByIdFromList } from "../../services/publicContentService";

function BlogPost() {
	const { postId } = useParams();
	const { books, blogPosts, loading } = usePublicContent({ includeBooks: true, includeBlogPosts: true });
	const { siteConfig } = useSiteSettings();
	const post = getBlogPostByIdFromList(blogPosts, postId);

	if (!post && loading) {
		return (
			<HelmetProvider>
				<main className="blog-post-page">
					<Container>
						<section className="blog-post-page__missing">
							<p className="blog-post-page__eyebrow">Blog</p>
							<h1 className="blog-post-page__title">Loading article…</h1>
						</section>
					</Container>
				</main>
			</HelmetProvider>
		);
	}

	if (!post) {
		return (
			<HelmetProvider>
				<SEO
					title="Article Not Found | Anurag Verma"
					description="The requested article could not be found."
					canonicalUrl={`${siteConfig.url}/blog/${postId}`}
					noindex
				/>
				<main className="blog-post-page">
					<Container>
						<section className="blog-post-page__missing">
							<p className="blog-post-page__eyebrow">Blog</p>
							<h1 className="blog-post-page__title">This article is not available.</h1>
							<p className="blog-post-page__lead">Try another entry from the journal archive.</p>
							<Link to="/blog" className="blog-post-page__back-link">Return to Blog</Link>
						</section>
					</Container>
				</main>
			</HelmetProvider>
		);
	}

	const visual = getBlogVisual(post);
	const contentSections = post.contentSections || [];
	const relatedBooks = (post.relatedBookIds || []).map((bookId) => getBookByIdFromList(books, bookId)).filter(Boolean);
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.excerpt,
		datePublished: post.publishedAt,
		author: {
			"@type": "Person",
			name: "Anurag Verma",
		},
		mainEntityOfPage: `${siteConfig.url}${getBlogPostPath(post.id)}`,
	};

	return (
		<HelmetProvider>
			<SEO
				title={`${post.title} | Anurag Verma`}
				description={post.excerpt}
				canonicalUrl={`${siteConfig.url}${getBlogPostPath(post.id)}`}
				openGraph={{
					title: `${post.title} | Anurag Verma`,
					description: post.excerpt,
					type: "article",
					url: `${siteConfig.url}${getBlogPostPath(post.id)}`,
					image: `${siteConfig.url}/og/blog.svg`,
				}}
				structuredData={structuredData}
			/>

			<main className="blog-post-page">
				<Container>
					<p className="blog-post-page__breadcrumb">
						<Link to="/">Home</Link>
						<span>/</span>
						<Link to="/blog">Blog</Link>
						<span>/</span>
						<span>{post.title}</span>
					</p>

					<section className="blog-post-page__hero">
						<div className="blog-post-page__visual" style={{ background: visual.background }} aria-hidden="true">
							<p className="blog-post-page__visual-eyebrow">{visual.eyebrow}</p>
							<p className="blog-post-page__visual-motif">{visual.motif}</p>
						</div>

						<div className="blog-post-page__intro">
							<p className="blog-post-page__eyebrow">{post.category}</p>
							<h1 className="blog-post-page__title">{post.title}</h1>
							<p className="blog-post-page__meta">{post.publishedAt} • {post.readingTime}</p>
							<p className="blog-post-page__lead">{post.excerpt}</p>

							{relatedBooks.length > 0 ? (
								<div className="blog-post-page__related-books" aria-label="Related books">
									{relatedBooks.map((book) => (
										<Link key={book.id} to={`/library/${book.id}`} className="blog-post-page__related-link">
											{book.title}
										</Link>
									))}
								</div>
							) : null}
						</div>
					</section>

					<article className="blog-post-page__article">
						{contentSections.length > 0
							? contentSections.map((section) => (
								<section key={section.heading} className="blog-post-page__section">
									<h2 className="blog-post-page__section-title">{section.heading}</h2>
									<div className="blog-post-page__divider" aria-hidden="true" />
									{section.paragraphs?.map((paragraph) => (
										<p key={paragraph} className="blog-post-page__paragraph">{paragraph}</p>
									))}
								</section>
							))
							: (post.content || []).map((paragraph) => (
								<p key={paragraph} className="blog-post-page__paragraph">{paragraph}</p>
							))}
					</article>

					<div className="blog-post-page__footer">
						<Link to="/blog" className="blog-post-page__back-link">Back to all articles</Link>
					</div>
				</Container>
			</main>
		</HelmetProvider>
	);
}

export default BlogPost;