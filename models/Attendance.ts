import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  status: "Present" | "Absent" | "Leave" | "Half-Day";
  checkIn?: Date;
  checkOut?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Half-Day"],
      required: true,
    },
    checkIn: { type: Date },
    checkOut: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound index to ensure a user has only one attendance record per day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
