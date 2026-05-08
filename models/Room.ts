import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  roomNumber: string;
  roomType: "general" | "semi-private" | "private" | "ICU" | "therapy";
  type?: string;
  floor: string;
  totalBeds: number;
  capacity?: number;
  occupiedBeds: number;
  beds?: Array<{ bedNumber: string; isOccupied: boolean }>;
  pricePerDay: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: { type: String, required: true, unique: true },
    roomType: {
      type: String,
      enum: ["general", "semi-private", "private", "ICU", "therapy"],
      required: true,
    },
    type: { type: String }, // For new UI
    floor: { type: String, required: true },
    totalBeds: { type: Number, required: true },
    capacity: { type: Number }, // For new UI
    occupiedBeds: { type: Number, default: 0 },
    beds: [{
      bedNumber: String,
      isOccupied: { type: Boolean, default: false }
    }],
    pricePerDay: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);
