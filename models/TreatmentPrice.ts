import mongoose, { Schema, Document } from "mongoose";

export interface ITreatmentPrice extends Document {
  treatmentName: string;
  category: string;
  description?: string;
  duration?: number; // in minutes
  price: number;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TreatmentPriceSchema = new Schema<ITreatmentPrice>(
  {
    treatmentName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    duration: { type: Number },
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.TreatmentPrice || mongoose.model<ITreatmentPrice>("TreatmentPrice", TreatmentPriceSchema);
