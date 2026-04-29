import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  patientId: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  dob?: Date;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  admissionType?: "IP" | "OP";
  assignedDoctor?: mongoose.Types.ObjectId;
  assignedTherapist?: mongoose.Types.ObjectId;
  isActive: boolean;
  registeredBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    patientId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    dob: { type: Date },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
    },
    bloodGroup: { type: String },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    admissionType: { type: String, enum: ["IP", "OP"] },
    assignedDoctor: { type: Schema.Types.ObjectId, ref: "User" },
    assignedTherapist: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    registeredBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
