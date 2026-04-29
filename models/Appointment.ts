import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointmentDate: Date;
  timeSlot: string;
  type: "OP" | "IP" | "Follow-up";
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";
  chiefComplaint?: string;
  notes?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    type: { type: String, enum: ["OP", "IP", "Follow-up"], required: true },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    chiefComplaint: { type: String },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);
