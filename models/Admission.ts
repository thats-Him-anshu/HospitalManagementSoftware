import mongoose, { Schema, Document } from "mongoose";

export interface IAdmission extends Document {
  patient: mongoose.Types.ObjectId;
  admissionType: "IP" | "OP";
  admissionDate: Date;
  dischargeDate?: Date;
  room?: mongoose.Types.ObjectId;
  bed?: string;
  admittingDoctor: mongoose.Types.ObjectId;
  diagnosisOnAdmission?: string;
  diagnosisOnDischarge?: string;
  treatmentSummary?: string;
  totalAmount?: number;
  amountPaid?: number;
  balance?: number;
  paymentStatus: "paid" | "partial" | "pending";
  status: "active" | "discharged";
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema = new Schema<IAdmission>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    admissionType: { type: String, enum: ["IP", "OP"], required: true },
    admissionDate: { type: Date, required: true },
    dischargeDate: { type: Date },
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    bed: { type: String },
    admittingDoctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    diagnosisOnAdmission: { type: String },
    diagnosisOnDischarge: { type: String },
    treatmentSummary: { type: String },
    totalAmount: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["paid", "partial", "pending"],
      default: "pending",
    },
    status: { type: String, enum: ["active", "discharged"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Admission || mongoose.model<IAdmission>("Admission", AdmissionSchema);
