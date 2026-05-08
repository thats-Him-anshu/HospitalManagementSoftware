import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    // Create lead
    const lead = await Lead.create({
      name: body.fullName,
      phone: body.phone,
      email: body.email || "",
      source: "website",
      status: "new",
      interestedTreatment: body.treatmentInterest || "",
      notes: `Preferred Date: ${body.preferredDate || "N/A"}, Preferred Time: ${body.preferredTime || "N/A"}. Message: ${body.message || "N/A"}`,
    });

    // Send emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Confirmation to patient
    if (body.email) {
      await transporter.sendMail({
        from: `"NIDARSANAM HEALTH CARE" <${process.env.EMAIL_USER}>`,
        to: body.email,
        subject: "Appointment Request Received — NIDARSANAM HEALTH CARE",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#4A6741;">Thank You, ${body.fullName}!</h2>
            <p>We have received your appointment request. Our team will contact you within <strong>24 hours</strong> to confirm your appointment.</p>
            <p><strong>Preferred Date:</strong> ${body.preferredDate || "N/A"}<br/>
            <strong>Preferred Time:</strong> ${body.preferredTime || "N/A"}<br/>
            <strong>Treatment Interest:</strong> ${body.treatmentInterest || "N/A"}</p>
            <hr/>
            <p style="color:#6B6560;font-size:12px;">NIDARSANAM HEALTH CARE | ☎ 9952338765 | Natural Healing. Real Results.</p>
          </div>
        `,
      });
    }

    // Notification to admin
    await transporter.sendMail({
      from: `"NIDARSANAM Website" <${process.env.EMAIL_USER}>`,
      to: "nidarsanamhealthcare@gmail.com",
      subject: `New Appointment Request — ${body.fullName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#4A6741;">New Appointment Request</h2>
          <p><strong>Name:</strong> ${body.fullName}</p>
          <p><strong>Phone:</strong> ${body.phone}</p>
          <p><strong>Email:</strong> ${body.email || "N/A"}</p>
          <p><strong>Preferred Date:</strong> ${body.preferredDate || "N/A"}</p>
          <p><strong>Preferred Time:</strong> ${body.preferredTime || "N/A"}</p>
          <p><strong>Treatment:</strong> ${body.treatmentInterest || "N/A"}</p>
          <p><strong>Message:</strong> ${body.message || "N/A"}</p>
          <hr/>
          <p style="color:#6B6560;font-size:12px;">Source: Website Appointment Form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error: any) {
    // Still return success if lead created but email failed
    console.error("Appointment API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
