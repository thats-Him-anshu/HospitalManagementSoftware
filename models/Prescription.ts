import mongoose, { Schema, Document } from "mongoose";

export interface IPrescriptionItem {
  name: string;
  type: "medicine" | "supplement" | "dietary";
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface IPrescription extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  items: IPrescriptionItem[];
  dietaryAdvice?: string;
  generalInstructions?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionItemSchema = new Schema<IPrescriptionItem>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["medicine", "supplement", "dietary"], required: true },
    dosage: { type: String },
    frequency: { type: String },
    duration: { type: String },
    instructions: { type: String },
  },
  { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
    items: [PrescriptionItemSchema],
    dietaryAdvice: { type: String },
    generalInstructions: { type: String },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Prescription || mongoose.model<IPrescription>("Prescription", PrescriptionSchema);
