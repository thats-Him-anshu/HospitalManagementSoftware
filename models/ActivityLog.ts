import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  patientId?: mongoose.Types.ObjectId;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
});

ActivityLogSchema.index({ timestamp: -1 });
ActivityLogSchema.index({ userId: 1 });
ActivityLogSchema.index({ module: 1 });

export default mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
