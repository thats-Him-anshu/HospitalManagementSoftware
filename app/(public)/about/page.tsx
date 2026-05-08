import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import User from "@/models/User";
import Image from "next/image";
import { Leaf, Target, Eye, Heart } from "lucide-react";

async function getData() {
  await dbConnect();
  const [settings, doctors] = await Promise.all([
    SiteSettings.findOne().lean(),
    User.find({ role: "doctor", isActive: true }).select("name speciality qualification profileImage bio").lean(),
  ]);
  const s = settings || (await SiteSettings.create({}));
  return { settings: JSON.parse(JSON.stringify(s)), doctors: JSON.parse(JSON.stringify(doctors)) };
}

export default async function AboutPage() {
  const { settings, doctors } = await getData();
  const about = settings.aboutPage || {};
  const values = about.coreValues || [];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-dark via-primary to-bg-dark" />
        {about.heroImage && <Image src={about.heroImage} alt="" fill className="object-cover opacity-25" />}
        <div className="absolute inset-0 bg-leaf-pattern opacity-20" />
        <div className="relative z-10 text-center px-4 py-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white animate-fadeInUp">{about.heroTitle || "About NIDARSANAM HEALTH CARE"}</h1>
          <p className="text-white/60 mt-4 text-lg animate-fadeInUp delay-200">Natural Healing. Real Results.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">Our Story</span>
          <h2 className="text-3xl font-display font-bold text-text mt-3">The NIDARSANAM Journey</h2>
          {about.story ? (
            <div className="mt-6 text-text-muted leading-relaxed blog-content" dangerouslySetInnerHTML={{ __html: about.story }} />
          ) : (
            <p className="mt-6 text-text-muted leading-relaxed">NIDARSANAM HEALTH CARE is dedicated to providing the highest quality naturopathy treatments. Our journey began with a simple vision: to make natural healing accessible and effective for everyone.</p>
          )}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-bg bg-leaf-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-soft">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4"><Target className="h-6 w-6 text-primary" /></div>
              <h3 className="text-2xl font-display font-bold text-text">Our Mission</h3>
              <p className="text-text-muted mt-3 leading-relaxed">{about.mission || "To provide holistic healthcare that addresses the root cause of illness through natural therapies, empowering patients to achieve optimal health and wellbeing."}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-soft">
              <div className="inline-flex p-3 rounded-full bg-accent/10 mb-4"><Eye className="h-6 w-6 text-accent" /></div>
              <h3 className="text-2xl font-display font-bold text-text">Our Vision</h3>
              <p className="text-text-muted mt-3 leading-relaxed">{about.vision || "To be a leading center of excellence in naturopathy and traditional medicine, setting new standards in holistic healthcare delivery."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {values.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Our Values</span>
              <h2 className="text-3xl font-display font-bold text-text mt-3">Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {values.map((v: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-surface/50 border border-border/30 hover:shadow-md transition-all">
                  <div className="inline-flex p-2 rounded-full bg-primary/10 mb-3"><Heart className="h-5 w-5 text-primary" /></div>
                  <h3 className="text-lg font-display font-bold text-text">{v.title}</h3>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Doctors */}
      {doctors.length > 0 && (
        <section className="py-20 bg-bg-dark text-white relative">
          <div className="absolute inset-0 bg-leaf-pattern opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Our Team</span>
              <h2 className="text-3xl font-display font-bold text-white mt-3">Meet Our Doctors</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {doctors.map((doc: any) => (
                <div key={doc._id} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <div className="relative h-52 rounded-xl overflow-hidden bg-white/10 mb-4">
                    {doc.profileImage ? <Image src={doc.profileImage} alt={doc.name} fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-4xl font-display font-bold text-white/20">{doc.name.charAt(0)}</div>}
                  </div>
                  <h3 className="text-lg font-display font-bold text-white">{doc.name}</h3>
                  <p className="text-sm text-accent mt-1">{doc.speciality || "General"}</p>
                  {doc.qualification && <p className="text-xs text-white/50 mt-1">{doc.qualification}</p>}
                  {doc.bio && <p className="text-sm text-white/60 mt-3 line-clamp-3">{doc.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
