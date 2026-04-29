import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User";
import TreatmentPrice from "../models/TreatmentPrice";
import Room from "../models/Room";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const treatments = [
  { treatmentName: "Consultation", price: 500, category: "Consultation", notes: "Per session" },
  { treatmentName: "Diet Chart", price: 2000, category: "Diet", notes: "Per month" },
  { treatmentName: "Therapeutical Yoga", price: 2000, category: "Yoga", notes: "Per 15 days" },
  { treatmentName: "Acupuncture", price: 300, category: "Therapy", notes: "Per session" },
  { treatmentName: "Special Treatments (if required)", price: 0, category: "Therapy", notes: "Price to be set per case" },
  { treatmentName: "Plantain Leaf Bath", price: 1000, category: "Therapy", notes: "Per session" },
  { treatmentName: "Moxibustion", price: 300, category: "Therapy", notes: "Per session" },
  { treatmentName: "Pranic Healing", price: 500, category: "Therapy", notes: "Per session" },
  { treatmentName: "Psychological Counselling", price: 1000, category: "Consultation", notes: "Per session" },
];

const rooms = [
  { roomNumber: "G-101", roomType: "general", floor: "Ground", totalBeds: 4, pricePerDay: 500 },
  { roomNumber: "P-201", roomType: "private", floor: "1st Floor", totalBeds: 1, pricePerDay: 2000 },
  { roomNumber: "S-202", roomType: "semi-private", floor: "1st Floor", totalBeds: 2, pricePerDay: 1200 },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing collections
    await User.deleteMany({});
    await TreatmentPrice.deleteMany({});
    await Room.deleteMany({});

    console.log("Cleared existing data.");

    // Create Admin
    const adminPassword = await bcrypt.hash("Nidar@Admin123", 10);
    await User.create({
      name: "Admin User",
      email: "nidarsanamhealthcare@gmail.com",
      password: adminPassword,
      role: "admin",
      isActive: true,
    });

    // Create Doctor (Dr. Nidarsin)
    const doctorPassword = await bcrypt.hash("Doctor@123", 10);
    await User.create({
      name: "Dr. Nidarsin",
      email: "doctor@hospital.com",
      password: doctorPassword,
      role: "doctor",
      qualification: "BNYS (Bachelor of Naturopathy & Yogic Sciences)",
      speciality: "Naturopathy Doctor", // Mapped designation to speciality/tagline
      tagline: "The Path to Real Health",
      bio: "A passionate BNYS doctor trained under experienced naturopaths, nationally award-winning, and widely recognized for delivering 15+ impactful debate sessions. With a strong belief in natural healing, helps patients reverse lifestyle disorders and manage health effectively through personalized diet, yoga, and acupuncture — achieving results without side effects.",
      profileImage: "/assets/doctor-nidarsin.jpg",
      isActive: true,
    });

    // Create Receptionist
    const receptionPassword = await bcrypt.hash("Reception@123", 10);
    await User.create({
      name: "Receptionist User",
      email: "reception@hospital.com",
      password: receptionPassword,
      role: "receptionist",
      isActive: true,
    });

    // Create Therapist
    const therapistPassword = await bcrypt.hash("Therapist@123", 10);
    await User.create({
      name: "Therapist User",
      email: "therapist@hospital.com",
      password: therapistPassword,
      role: "therapist",
      isActive: true,
    });

    console.log("Created users.");

    // Seed Treatments
    for (const treatment of treatments) {
      await TreatmentPrice.create({
        treatmentName: treatment.treatmentName,
        price: treatment.price,
        category: treatment.category,
        description: treatment.notes,
        isActive: true,
      });
    }

    console.log("Created treatment prices.");

    // Seed Rooms
    for (const room of rooms) {
      await Room.create(room);
    }

    console.log("Created rooms.");

    console.log("\n=======================================================");
    console.log("SEEDING SUCCESSFUL!");
    console.log("Default Admin Account:");
    console.log("Email: nidarsanamhealthcare@gmail.com");
    console.log("Password: Nidar@Admin123");
    console.log("IMPORTANT: Please change this admin password immediately after logging in!");
    console.log("=======================================================\n");

  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
