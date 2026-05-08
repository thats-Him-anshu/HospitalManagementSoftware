import mongoose, { Schema, Document } from "mongoose";

interface HeroSection {
  headline: string;
  subheadline: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

interface AboutSnapshot {
  paragraph: string;
  yearsOfExperience: number;
  patientsTreated: number;
  treatments: number;
  doctors: number;
}

interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  photo: string;
}

interface CTABanner {
  headline: string;
  buttonText: string;
  buttonLink: string;
}

interface ContactSnippet {
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  businessHours: string;
}

interface AboutPage {
  heroImage: string;
  heroTitle: string;
  story: string; // rich text HTML
  mission: string;
  vision: string;
  coreValues: { title: string; description: string }[];
}

interface GalleryItem {
  imageUrl: string;
  caption: string;
}

interface SocialLinks {
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

interface SiteSettingsBase {
  hospitalName: string;
  tagline: string;
  logo: string;
  favicon: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
}

export interface ISiteSettings extends Document {
  hero: HeroSection;
  aboutSnapshot: AboutSnapshot;
  whyChooseUs: WhyChooseUsItem[];
  testimonials: Testimonial[];
  ctaBanner: CTABanner;
  contact: ContactSnippet;
  aboutPage: AboutPage;
  gallery: GalleryItem[];
  socialLinks: SocialLinks;
  site: SiteSettingsBase;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    hero: {
      headline: { type: String, default: "Natural Healing. Real Results." },
      subheadline: { type: String, default: "Experience the power of naturopathy at NIDARSANAM HEALTH CARE" },
      backgroundImage: { type: String, default: "" },
      ctaText: { type: String, default: "Book an Appointment" },
      ctaLink: { type: String, default: "/appointments" },
    },
    aboutSnapshot: {
      paragraph: { type: String, default: "We provide holistic healthcare solutions through the power of naturopathy, Ayurveda and traditional healing practices." },
      yearsOfExperience: { type: Number, default: 15 },
      patientsTreated: { type: Number, default: 10000 },
      treatments: { type: Number, default: 50 },
      doctors: { type: Number, default: 10 },
    },
    whyChooseUs: [
      {
        icon: { type: String, default: "Leaf" },
        title: { type: String },
        description: { type: String },
        _id: false,
      },
    ],
    testimonials: [
      {
        name: { type: String },
        location: { type: String },
        text: { type: String },
        rating: { type: Number, default: 5 },
        photo: { type: String },
        _id: false,
      },
    ],
    ctaBanner: {
      headline: { type: String, default: "Ready to Start Your Healing Journey?" },
      buttonText: { type: String, default: "Make an Appointment" },
      buttonLink: { type: String, default: "/appointments" },
    },
    contact: {
      address: { type: String, default: "" },
      phone: { type: String, default: "9952338765" },
      email: { type: String, default: "nidarsanamhealthcare@gmail.com" },
      mapEmbedUrl: { type: String, default: "" },
      businessHours: { type: String, default: "Mon-Sat: 9:00 AM - 7:00 PM" },
    },
    aboutPage: {
      heroImage: { type: String, default: "" },
      heroTitle: { type: String, default: "About NIDARSANAM HEALTH CARE" },
      story: { type: String, default: "" },
      mission: { type: String, default: "" },
      vision: { type: String, default: "" },
      coreValues: [{ title: { type: String }, description: { type: String }, _id: false }],
    },
    gallery: [{ imageUrl: { type: String }, caption: { type: String }, _id: false }],
    socialLinks: {
      whatsapp: { type: String, default: "https://wa.me/919952338765" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    site: {
      hospitalName: { type: String, default: "NIDARSANAM HEALTH CARE" },
      tagline: { type: String, default: "Natural Healing. Real Results." },
      logo: { type: String, default: "" },
      favicon: { type: String, default: "" },
      footerText: { type: String, default: "© 2026 NIDARSANAM HEALTH CARE. All rights reserved." },
      seoTitle: { type: String, default: "NIDARSANAM HEALTH CARE | Natural Healing. Real Results." },
      seoDescription: { type: String, default: "Experience holistic naturopathy treatments at NIDARSANAM HEALTH CARE." },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
