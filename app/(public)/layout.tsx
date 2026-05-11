import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "NIDARSANAM HEALTH CARE | Natural Healing. Real Results.",
    template: "%s | NIDARSANAM HEALTH CARE",
  },
  description: "Experience holistic naturopathy treatments at NIDARSANAM HEALTH CARE. We offer Naturopathy, Panchakarma, Yoga Therapy, Acupuncture, and more.",
  keywords: ["naturopathy", "health care", "ayurveda", "yoga therapy", "panchakarma", "acupuncture", "NIDARSANAM", "natural healing"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "NIDARSANAM HEALTH CARE",
  },
  robots: { index: true, follow: true },
};

import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-earth-50 text-gray-900 min-h-screen flex flex-col font-sans antialiased">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
