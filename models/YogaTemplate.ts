import mongoose, { Schema, Document } from "mongoose";

export interface IPose {
  name: string;
  duration?: number;
  repetitions?: number;
  notes?: string;
}

export interface IYogaTemplate extends Document {
  name: string;
  description?: string;
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  poses: IPose[];
  createdBy?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const YogaTemplateSchema = new Schema<IYogaTemplate>(
  {
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    poses: [
      {
        name: { type: String, required: true },
        duration: { type: Number },
        repetitions: { type: Number },
        notes: { type: String },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.YogaTemplate ||
  mongoose.model<IYogaTemplate>("YogaTemplate", YogaTemplateSchema);
