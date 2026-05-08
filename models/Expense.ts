import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  date: Date;
  category: string;
  amount: number;
  vendor?: mongoose.Types.ObjectId;
  paymentMethod: "cash" | "UPI" | "card" | "bank-transfer";
  receiptUrl?: string;
  notes?: string;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    date: { type: Date, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    paymentMethod: {
      type: String,
      enum: ["cash", "UPI", "card", "bank-transfer"],
      required: true,
    },
    receiptUrl: { type: String },
    notes: { type: String },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);
