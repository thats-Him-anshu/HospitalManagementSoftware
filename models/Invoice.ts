import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  patient: mongoose.Types.ObjectId;
  admission?: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentMethod: "cash" | "UPI" | "card" | "insurance" | "bank-transfer";
  paymentStatus: "paid" | "partial" | "pending";
  issuedBy: mongoose.Types.ObjectId;
  pdfUrl?: string;
  whatsappSent: boolean;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    admission: { type: Schema.Types.ObjectId, ref: "Admission" },
    items: [InvoiceItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "UPI", "card", "insurance", "bank-transfer"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "partial", "pending"],
      default: "pending",
    },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pdfUrl: { type: String },
    whatsappSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
