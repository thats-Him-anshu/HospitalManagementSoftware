import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  description?: string;
  unit: "tablet" | "ml" | "piece" | "bottle";
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  reorderLevel: number;
  manufacturer?: string;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    unit: {
      type: String,
      enum: ["tablet", "ml", "piece", "bottle"],
      required: true,
    },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true, default: 10 },
    manufacturer: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
