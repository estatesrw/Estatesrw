import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, User, ArrowLeft, Facebook, Twitter, Linkedin, Link2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
        if (data) {
          supabase
            .from("blog_posts")
            .select("id, title, slug, excerpt, cover_image, published_at")
            .eq("status", "published")
            .neq("id", data.id)
            .order("published_at", { ascending: false })
            .limit(3)
            .then(({ data: related }) => setRelatedPosts(related || []));
        }
      });
  }, [slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Loading article...</div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button asChild><Link to="/blog">Back to Blog</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const publishedDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);
  const seoTitle = post.title.length > 60 ? post.title.substring(0, 57) + "..." : post.title;
  const seoDesc = post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 160);
  const canonicalUrl = `https://estatesrw.lovable.app/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: seoDesc,
    image: post.cover_image || "https://estatesrw.lovable.app/placeholder.svg",
    datePublished: publishedDate.toISOString(),
    dateModified: new Date(post.updated_at).toISOString(),
    author: { "@type": "Organization", name: "EstatesRW" },
    publisher: {
      "@type": "Organization",
      name: "EstatesRW",
      logo: { "@type": "ImageObject", url: "https://estatesrw.lovable.app/favicon.ico" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  // Split content into paragraphs for ad insertion
  const renderContentWithAds = (content: string) => {
    // If content is HTML, split by closing tags of block elements
    const blocks = content.split(/(<\/(?:p|h[2-6]|ul|ol|blockquote)>)/gi);
    const result: string[] = [];
    let blockCount = 0;

    for (let i = 0; i < blocks.length; i++) {
      result.push(blocks[i]);
      if (blocks[i].match(/^<\/(?:p|h[2-6]|ul|ol|blockquote)>$/i)) {
        blockCount++;
        // Insert ad after 3rd block
        if (blockCount === 3) {
          result.push('<div class="my-8 text-center"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2123974525989512" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins></div>');
        }
      }
    }
    return result.join("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle} | EstatesRW Blog</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />

      <article className="pt-20">
        {/* Hero */}
        {post.cover_image && (
          <div className="w-full max-h-[480px] overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              EstatesRW Team
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(publishedDate, "MMMM d, yyyy")}
            </span>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <button
              onClick={copyLink}
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              title="Copy link"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-foreground
              prose-headings:font-display prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:mb-2
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderContentWithAds(post.content), {
              ALLOWED_TAGS: ['p','h2','h3','h4','h5','h6','ul','ol','li','strong','em','a','blockquote','img','ins','div','br','span','code','pre','video','iframe'],
              ALLOWED_ATTR: ['href','src','alt','class','style','data-ad-client','data-ad-slot','data-ad-format','data-full-width-responsive','target','rel','loading','controls','frameborder','allowfullscreen','width','height']
            }) }}
          />

          {/* End-of-article ad */}
          <div className="my-10 text-center">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-2123974525989512"
              data-ad-slot="auto"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="group">
                    <div className="rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow bg-card">
                      {rp.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img src={rp.cover_image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h3>
                        {rp.published_at && (
                          <p className="text-xs text-muted-foreground mt-2">{format(new Date(rp.published_at), "MMM d, yyyy")}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
