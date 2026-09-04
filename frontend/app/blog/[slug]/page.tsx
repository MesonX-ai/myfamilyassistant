"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { MarketingPage } from "@/components/landing/MarketingPage";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog-data";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getBlogPost(slug);
  const allPosts = getAllBlogPosts();

  if (!post) {
    return (
      <MarketingPage title="Post not found">
        <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
          <div className="container" style={{ maxWidth: 780, textAlign: "center" }}>
            <p style={{ color: "var(--muted)", marginBottom: 24 }}>This blog post doesn't exist.</p>
            <Link href="/blog" className="btn btn-primary">
              Back to Blog
            </Link>
          </div>
        </section>
      </MarketingPage>
    );
  }

  // Get related posts (same category, but not this one)
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <MarketingPage
      eyebrow="◆ Blog Post"
      title={post.title}
      subtitle={post.excerpt}
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 780 }}>
          {/* Post Metadata */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 14,
              color: "var(--muted)",
              paddingBottom: 24,
              borderBottom: "1px solid var(--border)",
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon
                icon={
                  post.category === "Guides"
                    ? "lucide:book"
                    : post.category === "Product"
                      ? "lucide:package"
                      : post.category === "Trust"
                        ? "lucide:shield"
                        : post.category === "Stories"
                          ? "lucide:star"
                          : "lucide:lightbulb"
                }
                width={14}
                height={14}
                style={{ color: "var(--cyan)" }}
              />
              <span
                style={{
                  color: "var(--cyan)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {post.category}
              </span>
            </span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} minute read</span>
            <span>·</span>
            <span style={{ color: "var(--text)" }}>By {post.author}</span>
          </div>

          {/* Post Content */}
          <article
            style={{
              color: "var(--text)",
              lineHeight: 1.8,
              fontSize: 16,
              marginBottom: 48,
            }}
            dangerouslySetInnerHTML={{
              __html: post.content
                .split("\n")
                .map((line) => {
                  // Handle Markdown-style formatting
                  if (line.startsWith("# ")) {
                    return `<h1 style="font-family: var(--font-display); font-size: 32px; font-weight: 700; margin: 32px 0 16px; line-height: 1.2;">${line.substring(2)}</h1>`;
                  }
                  if (line.startsWith("## ")) {
                    return `<h2 style="font-family: var(--font-display); font-size: 24px; font-weight: 700; margin: 28px 0 14px; line-height: 1.2;">${line.substring(3)}</h2>`;
                  }
                  if (line.startsWith("### ")) {
                    return `<h3 style="font-family: var(--font-display); font-size: 18px; font-weight: 700; margin: 20px 0 12px;">${line.substring(4)}</h3>`;
                  }
                  if (line.startsWith("- ")) {
                    return `<li style="margin-left: 20px; margin-bottom: 8px;">${line.substring(2)}</li>`;
                  }
                  if (line.startsWith("> ")) {
                    return `<blockquote style="border-left: 3px solid var(--cyan); padding-left: 20px; margin: 20px 0; color: var(--muted); font-style: italic;">${line.substring(2)}</blockquote>`;
                  }
                  if (line.trim() === "") {
                    return "<br />";
                  }
                  if (line.startsWith("```")) {
                    return `<pre style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; margin: 20px 0;"><code>`;
                  }
                  if (line === "```") {
                    return `</code></pre>`;
                  }
                  return `<p style="margin-bottom: 16px;">${line}</p>`;
                })
                .join(""),
            }}
          />

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              paddingBottom: 32,
              borderBottom: "1px solid var(--border)",
              marginBottom: 32,
            }}
          >
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                style={{
                  fontSize: 13,
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "rgba(168, 85, 247, 0.15)",
                  color: "var(--cyan)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div
            className="glass"
            style={{
              padding: 32,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>
              Start building
            </h3>
            <p style={{ color: "var(--muted)", margin: "0 0 20px" }}>
              Ready to apply these ideas? Create your first workflow in the canvas.
            </p>
            <Link href="/canvas" className="btn btn-primary">
              Open Canvas →
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, margin: "0 0 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <Icon icon="lucide:books" width={24} height={24} style={{ color: "var(--violet)" }} />
                Related Articles
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="card"
                    style={{
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                      {relatedPost.date}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 700,
                        margin: "0 0 8px",
                        lineHeight: 1.3,
                      }}
                    >
                      {relatedPost.title}
                    </h3>
                    <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Link */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <Link href="/blog" style={{ color: "var(--cyan)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon icon="lucide:arrow-left" width={16} height={16} />
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
