import mongoose, { Schema, Document } from "mongoose";

export interface ITreatmentPlanItem {
  treatment: mongoose.Types.ObjectId;
  treatmentName: string;
  sessions: number;
  completedSessions: number;
  pricePerSession: number;
  notes?: string;
}

export interface ITreatmentPlan extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  title: string;
  items: ITreatmentPlanItem[];
  startDate: Date;
  endDate?: Date;
  status: "active" | "completed" | "cancelled";
  totalEstimatedCost: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TreatmentPlanItemSchema = new Schema<ITreatmentPlanItem>(
  {
    treatment: { type: Schema.Types.ObjectId, ref: "TreatmentPrice" },
    treatmentName: { type: String, required: true },
    sessions: { type: Number, required: true },
    completedSessions: { type: Number, default: 0 },
    pricePerSession: { type: Number, required: true },
    notes: { type: String },
  },
  { _id: false }
);

const TreatmentPlanSchema = new Schema<ITreatmentPlan>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    items: [TreatmentPlanItemSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
    totalEstimatedCost: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.TreatmentPlan || mongoose.model<ITreatmentPlan>("TreatmentPlan", TreatmentPlanSchema);
