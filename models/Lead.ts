import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  source: "website" | "walkin" | "referral" | "google" | "facebook" | "instagram" | "other";
  interest?: string;
  status: "new" | "contacted" | "follow-up" | "converted" | "lost";
  notes: string[];
  followUpDate?: Date;
  assignedTo?: mongoose.Types.ObjectId;
  convertedToPatient?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    source: {
      type: String,
      enum: ["website", "walkin", "referral", "google", "facebook", "instagram", "other"],
      required: true,
    },
    interest: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "follow-up", "converted", "lost"],
      default: "new",
    },
    notes: [{ type: String }],
    followUpDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    convertedToPatient: { type: Schema.Types.ObjectId, ref: "Patient" },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
