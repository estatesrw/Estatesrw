import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog - Real Estate Tips & Insights | EstatesRW</title>
        <meta name="description" content="Stay updated with the latest real estate news, property investment tips, and market insights from Rwanda's property market on EstatesRW Blog." />
        <link rel="canonical" href="https://estatesrw.lovable.app/blog" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">EstatesRW Blog</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Stay updated with the latest real estate news, property investment tips, and market insights from Rwanda.</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No blog posts yet. Stay tuned!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts.map((post) => (
              <Card key={post.id} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group">
                {post.cover_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {post.excerpt.length > 160 ? post.excerpt.substring(0, 157) + "..." : post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(post.published_at), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                      <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-sm">
                        Read More <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
