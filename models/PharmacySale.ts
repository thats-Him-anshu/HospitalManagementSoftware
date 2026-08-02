import mongoose, { Schema, Document } from "mongoose";

export interface IPharmacySaleItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IPharmacySale extends Document {
  patient?: mongoose.Types.ObjectId;
  soldBy: mongoose.Types.ObjectId;
  items: IPharmacySaleItem[];
  totalAmount: number;
  paymentMethod: "cash" | "UPI" | "card";
  createdAt: Date;
  updatedAt: Date;
}

const PharmacySaleSchema = new Schema<IPharmacySale>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient" },
    soldBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "UPI", "card"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PharmacySale ||
  mongoose.model<IPharmacySale>("PharmacySale", PharmacySaleSchema);
