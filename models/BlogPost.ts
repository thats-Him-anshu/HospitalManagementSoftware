import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML from TipTap
  featuredImage: string;
  category: mongoose.Types.ObjectId;
  tags: string[];
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  author: mongoose.Types.ObjectId;
  readTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "BlogCategory" },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    readTime: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
