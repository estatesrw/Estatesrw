import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Plus, Pencil, Trash2, Loader2, Image, Bold, Italic, Heading2, Heading3,
  List, ListOrdered, Quote, Link2, Video, ImagePlus, Code, Undo2, Redo2, Eye, EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import DOMPurify from "dompurify";

const BlogManagementPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const inlineFileRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "", cover_image: "", status: "draft",
  });

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setForm({ title: "", slug: "", content: "", excerpt: "", cover_image: "", status: "draft" });
    setEditingId(null);
    setShowPreview(false);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); }
    else {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setForm((f) => ({ ...f, cover_image: data.publicUrl }));
    }
    setUploading(false);
  };

  // Insert text at cursor position in the content textarea
  const insertAtCursor = useCallback((text: string) => {
    const textarea = contentRef.current;
    if (!textarea) {
      setForm((f) => ({ ...f, content: f.content + text }));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    const newContent = before + text + after;
    setForm((f) => ({ ...f, content: newContent }));
    // Restore cursor position after React re-render
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }, [form.content]);

  // Wrap selected text with tags
  const wrapSelection = useCallback((before: string, after: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.substring(start, end);
    const newText = before + (selected || "text here") + after;
    const contentBefore = form.content.substring(0, start);
    const contentAfter = form.content.substring(end);
    setForm((f) => ({ ...f, content: contentBefore + newText + contentAfter }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || "text here").length);
    }, 0);
  }, [form.content]);

  // Upload inline image for content
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setInsertingImage(true);
    const ext = file.name.split(".").pop();
    const isVideo = file.type.startsWith("video/");
    const path = `${user.id}/blog-content/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      if (isVideo) {
        insertAtCursor(`\n<video controls class="w-full rounded-xl my-4" src="${data.publicUrl}"></video>\n`);
      } else {
        insertAtCursor(`\n<img src="${data.publicUrl}" alt="Blog image" class="w-full rounded-xl my-4" loading="lazy" />\n`);
      }
    }
    setInsertingImage(false);
    if (inlineFileRef.current) inlineFileRef.current.value = "";
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (!url) return;
    const text = prompt("Enter link text:", "Click here") || "Click here";
    insertAtCursor(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
  };

  const insertVideo = () => {
    const url = prompt("Enter YouTube or video URL:");
    if (!url) return;
    // Convert YouTube URL to embed
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      insertAtCursor(`\n<div class="aspect-video my-6"><iframe src="https://www.youtube.com/embed/${youtubeMatch[1]}" frameborder="0" allowfullscreen class="w-full h-full rounded-xl"></iframe></div>\n`);
    } else {
      insertAtCursor(`\n<video controls class="w-full rounded-xl my-4" src="${url}"></video>\n`);
    }
  };

  const insertImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (!url) return;
    const alt = prompt("Enter alt text:", "Image") || "Image";
    insertAtCursor(`\n<img src="${url}" alt="${alt}" class="w-full rounded-xl my-4" loading="lazy" />\n`);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => wrapSelection("<strong>", "</strong>"), title: "Bold" },
    { icon: Italic, action: () => wrapSelection("<em>", "</em>"), title: "Italic" },
    { icon: Heading2, action: () => wrapSelection("<h2>", "</h2>"), title: "Heading 2" },
    { icon: Heading3, action: () => wrapSelection("<h3>", "</h3>"), title: "Heading 3" },
    "separator",
    { icon: List, action: () => insertAtCursor("\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n"), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertAtCursor("\n<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ol>\n"), title: "Numbered List" },
    { icon: Quote, action: () => wrapSelection("<blockquote>", "</blockquote>"), title: "Quote" },
    "separator",
    { icon: Link2, action: insertLink, title: "Insert Link" },
    { icon: Image, action: insertImageUrl, title: "Insert Image URL" },
    { icon: ImagePlus, action: () => inlineFileRef.current?.click(), title: "Upload Image/Video" },
    { icon: Video, action: insertVideo, title: "Embed YouTube Video" },
    "separator",
    { icon: Code, action: () => wrapSelection("<code>", "</code>"), title: "Code" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || generateSlug(form.title);
    const payload = {
      ...form, slug, author_id: user!.id,
      published_at: form.status === "published" ? new Date().toISOString() : null,
    };

    const { error } = editingId
      ? await supabase.from("blog_posts").update(payload).eq("id", editingId)
      : await supabase.from("blog_posts").insert(payload);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editingId ? "Post updated" : "Post created" }); setDialogOpen(false); resetForm(); fetchPosts(); }
  };

  const handleEdit = (p: any) => {
    setForm({ title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt || "", cover_image: p.cover_image || "", status: p.status });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Post deleted" }); fetchPosts(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Blog Management</h2>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editingId ? "Edit Post" : "New Blog Post"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short summary of the post..." />
              </div>

              {/* Rich Content Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Content</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-1.5 text-xs"
                  >
                    {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPreview ? "Edit" : "Preview"}
                  </Button>
                </div>

                {/* Toolbar */}
                {!showPreview && (
                  <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-muted rounded-t-lg border border-b-0 border-border">
                    {toolbarButtons.map((btn, i) =>
                      btn === "separator" ? (
                        <Separator key={i} orientation="vertical" className="h-6 mx-1" />
                      ) : (
                        <Button
                          key={i}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-background"
                          onClick={(btn as any).action}
                          title={(btn as any).title}
                        >
                          {(() => { const Icon = (btn as any).icon; return <Icon className="w-4 h-4" />; })()}
                        </Button>
                      )
                    )}
                    {insertingImage && <Loader2 className="w-4 h-4 animate-spin ml-2 text-muted-foreground" />}
                  </div>
                )}

                {showPreview ? (
                  <div
                    className="min-h-[300px] p-4 border border-border rounded-lg bg-background prose prose-sm max-w-none
                      prose-headings:font-display prose-headings:text-foreground
                      prose-p:text-muted-foreground prose-a:text-primary
                      prose-img:rounded-xl prose-blockquote:border-l-primary"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(form.content, {
                        ALLOWED_TAGS: ['p','h2','h3','h4','h5','h6','ul','ol','li','strong','em','a','blockquote','img','div','br','span','code','pre','video','iframe'],
                        ALLOWED_ATTR: ['href','src','alt','class','style','target','rel','loading','controls','frameborder','allowfullscreen','width','height']
                      })
                    }}
                  />
                ) : (
                  <Textarea
                    ref={contentRef}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={14}
                    required
                    className={`font-mono text-sm ${!showPreview ? 'rounded-t-none' : ''}`}
                    placeholder="Write your blog content here. Use the toolbar above to format text, add images, videos, and links..."
                  />
                )}

                {/* Hidden file input for inline media */}
                <input
                  ref={inlineFileRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleInlineImageUpload}
                />

                <p className="text-xs text-muted-foreground">
                  💡 Tip: Use the toolbar to add <strong>images</strong>, <strong>YouTube videos</strong>, and <strong>links</strong> directly into your content. You can also write HTML directly.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                {form.cover_image && <img src={form.cover_image} alt="Cover" className="w-full aspect-video object-cover rounded-lg border border-border" />}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Image className="w-4 h-4 mr-2" />}
                  {uploading ? "Uploading..." : "Upload Cover"}
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">{editingId ? "Update" : "Create"} Post</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No blog posts yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="shadow-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {p.cover_image && <img src={p.cover_image} alt="" className="w-16 h-12 rounded object-cover shrink-0" />}
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground truncate">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {p.status === "published" ? `Published ${p.published_at ? format(new Date(p.published_at), "MMM d, yyyy") : ""}` : "Draft"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(p)}><Pencil className="w-3 h-3" /></Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManagementPage;
