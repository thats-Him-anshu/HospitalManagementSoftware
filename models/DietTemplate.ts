import mongoose, { Schema, Document } from "mongoose";

export interface IMeal {
  mealTime: string;
  items: string[];
  notes?: string;
}

export interface IDietTemplate extends Document {
  name: string;
  description?: string;
  category: "weight-loss" | "diabetes" | "general" | "detox" | "custom";
  meals: IMeal[];
  createdBy?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DietTemplateSchema = new Schema<IDietTemplate>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["weight-loss", "diabetes", "general", "detox", "custom"],
      required: true,
    },
    meals: [
      {
        mealTime: { type: String, required: true },
        items: [{ type: String }],
        notes: { type: String },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.DietTemplate ||
  mongoose.model<IDietTemplate>("DietTemplate", DietTemplateSchema);
