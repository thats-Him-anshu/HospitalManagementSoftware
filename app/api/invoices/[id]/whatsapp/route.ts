import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { phone } = body;

    if (!phone) return NextResponse.json({ error: "Phone number is required" }, { status: 400 });

    await dbConnect();
    const invoice = await Invoice.findById(params.id).populate("patient", "firstName lastName");
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

    if (!accountSid || !authToken) {
      return NextResponse.json({ error: "Twilio credentials not configured. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env.local" }, { status: 500 });
    }

    // Format phone number for WhatsApp
    let formattedPhone = phone.replace(/[^0-9]/g, "");
    if (formattedPhone.length === 10) formattedPhone = "91" + formattedPhone;
    if (!formattedPhone.startsWith("+")) formattedPhone = "+" + formattedPhone;

    const patientName = invoice.patient ? `${(invoice.patient as any).firstName} ${(invoice.patient as any).lastName}` : "Patient";
    const balance = invoice.balance > 0 ? `\n\n💳 *Outstanding Balance:* ₹${invoice.balance.toLocaleString("en-IN")}\nPlease clear the balance at your next visit.` : "";

    const messageBody = `🏥 *NIDARSANAM HEALTH CARE*\n_Invoice Receipt_\n\n📋 *Invoice:* ${invoice.invoiceNumber}\n👤 *Patient:* ${patientName}\n📅 *Date:* ${new Date(invoice.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}\n\n💰 *Total Amount:* ₹${invoice.totalAmount.toLocaleString("en-IN")}\n✅ *Amount Paid:* ₹${invoice.amountPaid.toLocaleString("en-IN")}\n📝 *Payment Method:* ${invoice.paymentMethod.toUpperCase()}${balance}\n\n🙏 Thank you for choosing NIDARSANAM HEALTH CARE.\n📞 For queries: 9952338765\n🌐 Natural Healing. Real Results.`;

    // Send via Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const formData = new URLSearchParams();
    formData.append("From", fromWhatsApp.startsWith("whatsapp:") ? fromWhatsApp : `whatsapp:${fromWhatsApp}`);
    formData.append("To", `whatsapp:${formattedPhone}`);
    formData.append("Body", messageBody);

    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const twilioData = await twilioRes.json();

    if (!twilioRes.ok) {
      console.error("Twilio Error:", twilioData);
      return NextResponse.json({ success: false, error: twilioData.message || "Failed to send WhatsApp message" }, { status: 500 });
    }

    // Update invoice
    invoice.whatsappSent = true;
    await invoice.save();

    return NextResponse.json({ success: true, message: "WhatsApp message sent successfully", sid: twilioData.sid });
  } catch (error: any) {
    console.error("WhatsApp Send Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
