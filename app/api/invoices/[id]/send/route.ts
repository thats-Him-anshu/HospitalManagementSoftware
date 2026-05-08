import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import nodemailer from "nodemailer";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { pdfBase64, emailTo } = body;

    if (!pdfBase64 || !emailTo) {
      return NextResponse.json({ error: "Missing PDF data or recipient email" }, { status: 400 });
    }

    await dbConnect();
    const invoice = await Invoice.findById(params.id);
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Nidarsanam Health Care" <${process.env.EMAIL_USER}>`,
      to: emailTo,
      subject: `Invoice ${invoice.invoiceNumber} from Nidarsanam Health Care`,
      text: `Dear Patient,\n\nPlease find attached your invoice (${invoice.invoiceNumber}) from Nidarsanam Health Care.\n\nThank you for choosing us!\n\nBest Regards,\nNidarsanam Health Care\n9952338765`,
      attachments: [
        {
          filename: `Invoice_${invoice.invoiceNumber}.pdf`,
          content: pdfBase64.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // Update invoice record
    invoice.emailSent = true;
    await invoice.save();

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email. Please check your EMAIL_USER and EMAIL_PASS configuration." }, { status: 500 });
  }
}
