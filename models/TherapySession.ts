import mongoose, { Schema, Document } from "mongoose";

export interface ITherapySession extends Document {
  patient: mongoose.Types.ObjectId;
  therapist: mongoose.Types.ObjectId;
  treatmentPlan?: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  treatmentType: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
  sessionNotes?: string;
  completionNotes?: string;
  duration?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

const TherapySessionSchema = new Schema<ITherapySession>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    therapist: { type: Schema.Types.ObjectId, ref: "User", required: true },
    treatmentPlan: { type: Schema.Types.ObjectId, ref: "TreatmentPlan" },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    treatmentType: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    sessionNotes: { type: String },
    completionNotes: { type: String },
    duration: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.TherapySession || mongoose.model<ITherapySession>("TherapySession", TherapySessionSchema);
