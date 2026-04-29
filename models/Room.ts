import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  roomNumber: string;
  roomType: "general" | "semi-private" | "private" | "ICU" | "therapy";
  floor: string;
  totalBeds: number;
  occupiedBeds: number;
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
    floor: { type: String, required: true },
    totalBeds: { type: Number, required: true },
    occupiedBeds: { type: Number, default: 0 },
    pricePerDay: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);
