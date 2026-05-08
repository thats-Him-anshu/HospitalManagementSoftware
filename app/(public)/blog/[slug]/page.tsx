import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, Leaf } from "lucide-react";
import { format } from "date-fns";
import ShareButtons from "@/components/public/ShareButtons";

async function getData(slug: string) {
  await dbConnect();
  const post = await BlogPost.findOne({ slug, status: "published" }).populate("category", "name slug").populate("author", "name").lean();
  if (!post) return null;

  const related = await BlogPost.find({
    _id: { $ne: (post as any)._id },
    status: "published",
    category: (post as any).category?._id,
  }).limit(3).lean();

  return { post: JSON.parse(JSON.stringify(post)), related: JSON.parse(JSON.stringify(related)) };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);
  if (!data) notFound();

  const { post, related } = data;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-dark via-primary to-bg-dark" />
        {post.featuredImage && <Image src={post.featuredImage} alt={post.title} fill className="object-cover opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-bg-dark/50" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 pb-12 pt-32">
          {post.category && <span className="inline-block bg-accent text-bg-dark text-xs uppercase tracking-wider px-3 py-1 rounded-full font-semibold mb-4">{post.category.name}</span>}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-6 text-sm text-white/60">
            <span>{format(new Date(post.createdAt), "dd MMMM yyyy")}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime} min read</span>
            {post.author && <span>By {post.author.name}</span>}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="blog-content text-text leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-surface rounded-full text-xs text-text-muted font-medium">#{tag}</span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm font-medium text-text mb-3">Share this article</p>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          <Link href="/blog" className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-primary hover:text-accent transition-colors"><ArrowLeft className="h-4 w-4" />Back to Blog</Link>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-bg bg-leaf-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display font-bold text-text mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r: any) => (
                <Link key={r._id} href={`/blog/${r.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all">
                  <div className="relative h-40 bg-surface">{r.featuredImage ? <Image src={r.featuredImage} alt={r.title} fill className="object-cover" /> : <div className="flex items-center justify-center h-full"><Leaf className="h-8 w-8 text-text-muted/20" /></div>}</div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-text group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                    <p className="text-xs text-text-muted mt-2">{r.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
