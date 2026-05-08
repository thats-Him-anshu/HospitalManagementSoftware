import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import BlogCategory from "@/models/BlogCategory";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Clock, Search } from "lucide-react";
import BlogSearch from "@/components/public/BlogSearch";
import { format } from "date-fns";

async function getData(searchParams: { page?: string; category?: string; search?: string }) {
  await dbConnect();
  const page = parseInt(searchParams.page || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  const query: any = { status: "published" };
  if (searchParams.category) {
    const cat = await BlogCategory.findOne({ slug: searchParams.category }).lean();
    if (cat) query.category = (cat as any)._id;
  }
  if (searchParams.search) {
    query.$or = [
      { title: { $regex: searchParams.search, $options: "i" } },
      { excerpt: { $regex: searchParams.search, $options: "i" } },
    ];
  }

  const [posts, total, categories] = await Promise.all([
    BlogPost.find(query).populate("category", "name slug").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(query),
    BlogCategory.find().sort({ name: 1 }).lean(),
  ]);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    total,
    page,
    pages: Math.ceil(total / limit),
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export default async function BlogPage({ searchParams }: { searchParams: { page?: string; category?: string; search?: string } }) {
  const { posts, total, page, pages, categories } = await getData(searchParams);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-dark via-primary to-bg-dark" />
        <div className="absolute inset-0 bg-leaf-pattern opacity-20" />
        <div className="relative z-10 text-center px-4 py-28">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white animate-fadeInUp">Health & Wellness Blog</h1>
          <p className="text-white/60 mt-4 text-lg animate-fadeInUp delay-200">Insights on naturopathy, healing, and holistic living</p>
        </div>
      </section>

      <section className="py-16 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Category filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              <Link href="/blog" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!searchParams.category ? "bg-primary text-white" : "bg-white text-text-muted border border-border hover:border-primary"}`}>All</Link>
              {categories.map((cat: any) => (
                <Link key={cat._id} href={`/blog?category=${cat.slug}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${searchParams.category === cat.slug ? "bg-primary text-white" : "bg-white text-text-muted border border-border hover:border-primary"}`}>{cat.name}</Link>
              ))}
            </div>
            <BlogSearch />
          </div>

          {/* Posts grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20"><Leaf className="h-12 w-12 text-text-muted/30 mx-auto mb-4" /><p className="text-text-muted">No blog posts found.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-48 bg-surface">
                    {post.featuredImage ? <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex items-center justify-center h-full"><Leaf className="h-12 w-12 text-text-muted/20" /></div>}
                    {post.category && <span className="absolute top-3 left-3 bg-primary/90 text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">{post.category.name}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-display font-bold text-text group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-text-muted mt-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
                      <span>{format(new Date(post.createdAt), "dd MMM yyyy")}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pages }).map((_, i) => (
                <Link key={i} href={`/blog?page=${i + 1}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.search ? `&search=${searchParams.search}` : ""}`} className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${page === i + 1 ? "bg-primary text-white" : "bg-white text-text-muted border border-border hover:border-primary"}`}>
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
