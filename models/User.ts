import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "doctor" | "receptionist" | "therapist";
  phone?: string;
  profileImage?: string;
  speciality?: string;
  qualification?: string;
  experience?: string;
  bio?: string;
  tagline?: string;
  joiningDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for future OAuth or cases where it's set later
    role: {
      type: String,
      enum: ["admin", "doctor", "receptionist", "therapist"],
      required: true,
    },
    phone: { type: String },
    profileImage: { type: String },
    speciality: { type: String },
    qualification: { type: String },
    experience: { type: String },
    bio: { type: String },
    tagline: { type: String },
    joiningDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
