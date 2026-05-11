import mongoose, { Schema, Document } from "mongoose";

export interface ICheckInLog extends Document {
  patient: mongoose.Types.ObjectId;
  action: "check-in" | "check-out";
  timestamp: Date;
  staff: mongoose.Types.ObjectId;
}

const CheckInLogSchema = new Schema<ICheckInLog>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    action: { type: String, enum: ["check-in", "check-out"], required: true },
    timestamp: { type: Date, default: Date.now },
    staff: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CheckInLog || mongoose.model<ICheckInLog>("CheckInLog", CheckInLogSchema);
