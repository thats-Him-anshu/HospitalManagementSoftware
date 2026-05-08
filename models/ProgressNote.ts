import mongoose, { Schema, Document } from "mongoose";

export interface IVitalSigns {
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  spO2?: number;
}

export interface IProgressNote extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  date: Date;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  vitals: IVitalSigns;
  createdAt: Date;
  updatedAt: Date;
}

const VitalSignsSchema = new Schema<IVitalSigns>(
  {
    bloodPressure: { type: String },
    pulse: { type: Number },
    temperature: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    spO2: { type: Number },
  },
  { _id: false }
);

const ProgressNoteSchema = new Schema<IProgressNote>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
    date: { type: Date, required: true, default: Date.now },
    subjective: { type: String, default: "" },
    objective: { type: String, default: "" },
    assessment: { type: String, default: "" },
    plan: { type: String, default: "" },
    vitals: VitalSignsSchema,
  },
  { timestamps: true }
);

export default mongoose.models.ProgressNote || mongoose.model<IProgressNote>("ProgressNote", ProgressNoteSchema);
