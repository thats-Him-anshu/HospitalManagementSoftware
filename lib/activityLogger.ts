import dbConnect from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";

interface LogParams {
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  patientId?: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(params: LogParams) {
  try {
    await dbConnect();
    await ActivityLog.create({
      userId: params.userId,
      userName: params.userName,
      userRole: params.userRole,
      action: params.action,
      module: params.module,
      patientId: params.patientId || undefined,
      metadata: params.metadata || {},
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
}
