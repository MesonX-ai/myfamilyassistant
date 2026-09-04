"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { MarketingPage } from "@/components/landing/MarketingPage";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog-data";

type Category = "All" | BlogPost["category"];

const CATEGORIES: Category[] = ["All", "Guides", "Product", "Trust", "Stories", "Tips"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const posts = getAllBlogPosts();

  const filteredPosts =
    selectedCategory === "All" ? posts : posts.filter((p) => p.category === selectedCategory);

  return (
    <MarketingPage
      eyebrow="◆ Blog"
      title="Notes from the studio"
      subtitle="Guides, product updates, and honest perspectives on building agents that work for real families."
    >
      <section className="section" style={{ paddingTop: 24, position: "relative", zIndex: 1 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Category Filter */}
          <div style={{ marginBottom: 48 }}>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    border:
                      selectedCategory === cat
                        ? "1px solid var(--cyan)"
                        : "1px solid var(--border)",
                    background:
                      selectedCategory === cat ? "rgba(34, 211, 238, 0.1)" : "transparent",
                    color: selectedCategory === cat ? "var(--cyan)" : "var(--muted)",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 13,
                      color: "var(--muted)",
                      marginBottom: 12,
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
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 700,
                      margin: "0 0 12px",
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: "0 0 12px" }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 12,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: "rgba(168, 85, 247, 0.15)",
                          color: "var(--cyan)",
                          textTransform: "capitalize",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
                <p>No posts found in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}