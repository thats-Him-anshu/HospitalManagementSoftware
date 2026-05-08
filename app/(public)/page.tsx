import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import TreatmentPrice from "@/models/TreatmentPrice";
import User from "@/models/User";
import BlogPost from "@/models/BlogPost";
import Link from "next/link";
import { Leaf, Heart, Shield, Star, Clock, ArrowRight, Phone, MapPin, Mail, ChevronRight, Sparkles, Users, Award, Stethoscope } from "lucide-react";
import Image from "next/image";
import TestimonialsCarousel from "@/components/public/TestimonialsCarousel";

const iconMap: Record<string, any> = { Leaf, Heart, Shield, Star, Clock, Sparkles, Users, Award, Stethoscope };

async function getData() {
  await dbConnect();
  const [settings, treatments, doctors, posts] = await Promise.all([
    SiteSettings.findOne().lean(),
    TreatmentPrice.find({ isActive: true }).limit(6).lean(),
    User.find({ role: "doctor", isActive: true }).select("name speciality qualification profileImage bio").lean(),
    BlogPost.find({ status: "published" }).populate("category", "name slug").sort({ createdAt: -1 }).limit(3).lean(),
  ]);
  if (!settings) {
    const s = await SiteSettings.create({});
    return { settings: JSON.parse(JSON.stringify(s)), treatments: JSON.parse(JSON.stringify(treatments)), doctors: JSON.parse(JSON.stringify(doctors)), posts: JSON.parse(JSON.stringify(posts)) };
  }
  return { settings: JSON.parse(JSON.stringify(settings)), treatments: JSON.parse(JSON.stringify(treatments)), doctors: JSON.parse(JSON.stringify(doctors)), posts: JSON.parse(JSON.stringify(posts)) };
}

export default async function HomePage() {
  const { settings, treatments, doctors, posts } = await getData();
  const hero = settings.hero || {};
  const about = settings.aboutSnapshot || {};
  const wcu = settings.whyChooseUs || [];
  const testimonials = settings.testimonials || [];
  const cta = settings.ctaBanner || {};
  const contact = settings.contact || {};

  const stats = [
    { label: "Years of Experience", value: about.yearsOfExperience || 15, icon: Award },
    { label: "Patients Treated", value: (about.patientsTreated || 10000).toLocaleString()+"+", icon: Users },
    { label: "Treatments", value: about.treatments || 50, icon: Stethoscope },
    { label: "Doctors", value: about.doctors || 10, icon: Heart },
  ];

  return (
    <>
      {/* ────── HERO ────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-dark via-primary to-bg-dark" />
        {hero.backgroundImage && <Image src={hero.backgroundImage} alt="" fill className="object-cover opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-bg-dark/40" />
        {/* Leaf pattern */}
        <div className="absolute inset-0 bg-leaf-pattern opacity-30" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-32">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-xs text-white/80 uppercase tracking-widest mb-8 animate-fadeInDown">
            <Leaf className="h-3.5 w-3.5 text-accent" />Natural Healing Center
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white leading-tight animate-fadeInUp">
            {hero.headline || "Natural Healing. Real Results."}
          </h1>
          <p className="text-lg sm:text-xl text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed animate-fadeInUp delay-200">
            {hero.subheadline || "Experience the power of naturopathy at NIDARSANAM HEALTH CARE"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fadeInUp delay-300">
            <Link href={hero.ctaLink || "/appointments"} className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-bg-dark font-semibold rounded-full hover:bg-accent/90 transition-all hover:scale-105 shadow-lg">
              {hero.ctaText || "Book an Appointment"}<ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:9952338765" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-full hover:bg-white/20 transition-all border border-white/20">
              <Phone className="h-4 w-4" />Call Now
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"><div className="w-1 h-3 bg-white/50 rounded-full" /></div>
        </div>
      </section>

      {/* ────── ABOUT SNAPSHOT + STATS ────── */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Who We Are</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mt-3">About NIDARSANAM HEALTH CARE</h2>
            <p className="text-text-muted mt-4 leading-relaxed">{about.paragraph || "We provide holistic healthcare solutions."}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-surface/50 border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4"><s.icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-3xl font-display font-bold text-primary">{s.value}</h3>
                <p className="text-sm text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── TREATMENTS ────── */}
      <section className="py-20 bg-bg relative bg-leaf-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mt-3">Treatments & Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {treatments.map((t: any) => (
              <div key={t._id} className="group bg-white rounded-2xl p-6 border border-border/50 hover:border-primary/30 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"><Leaf className="h-6 w-6 text-primary" /></div>
                <h3 className="text-xl font-display font-bold text-text mt-4">{t.treatmentName}</h3>
                <p className="text-sm text-text-muted mt-2 line-clamp-2">{t.description || t.category}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  {t.duration && <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration} min</span>}
                  <span className="text-primary font-bold">₹{t.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── WHY CHOOSE US ────── */}
      {wcu.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Why Us</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mt-3">Why Choose NIDARSANAM</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {wcu.map((item: any, i: number) => {
                const Icon = iconMap[item.icon] || Leaf;
                return (
                  <div key={i} className="text-center p-8 rounded-2xl bg-surface/30 border border-border/30 hover:bg-surface/60 transition-all duration-300">
                    <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4"><Icon className="h-7 w-7 text-accent" /></div>
                    <h3 className="text-lg font-display font-bold text-text">{item.title}</h3>
                    <p className="text-sm text-text-muted mt-2 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ────── DOCTORS ────── */}
      {doctors.length > 0 && (
        <section className="py-20 bg-bg-dark text-white relative">
          <div className="absolute inset-0 bg-leaf-pattern opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Our Team</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3">Expert Doctors</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {doctors.map((doc: any) => (
                <div key={doc._id} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-accent/40 transition-all duration-300 group">
                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-white/10 mb-4">
                    {doc.profileImage ? (
                      <Image src={doc.profileImage} alt={doc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl font-display font-bold text-white/20">{doc.name.charAt(0)}</div>
                    )}
                  </div>
                  <h3 className="text-lg font-display font-bold text-white">{doc.name}</h3>
                  <p className="text-sm text-accent mt-1">{doc.speciality || "General"}</p>
                  {doc.qualification && <p className="text-xs text-white/50 mt-1">{doc.qualification}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ────── TESTIMONIALS ────── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Patient Stories</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mt-3">What Our Patients Say</h2>
            </div>
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* ────── LATEST BLOG ────── */}
      {posts.length > 0 && (
        <section className="py-20 bg-bg bg-leaf-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-accent text-sm font-semibold uppercase tracking-widest">Health Blog</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mt-3">Latest Articles</h2>
              </div>
              <Link href="/blog" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors">View All<ChevronRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-48 bg-surface">
                    {post.featuredImage ? <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex items-center justify-center h-full text-text-muted"><Leaf className="h-12 w-12 opacity-20" /></div>}
                    {post.category && <span className="absolute top-3 left-3 bg-primary/90 text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">{post.category.name}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-text group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-text-muted mt-2 line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-text-muted mt-3">{post.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ────── CTA BANNER ────── */}
      <section className="py-20 bg-gradient-to-r from-primary via-bg-dark to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-leaf-pattern opacity-20" />
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">{cta.headline || "Ready to Start Your Healing Journey?"}</h2>
          <Link href={cta.buttonLink || "/appointments"} className="inline-flex items-center gap-2 mt-8 px-10 py-4 bg-accent text-bg-dark font-semibold rounded-full hover:bg-accent/90 transition-all hover:scale-105 shadow-lg text-lg">
            {cta.buttonText || "Make an Appointment"}<ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ────── CONTACT SNIPPET ────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Get in Touch</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mt-3">Contact Us</h2>
              <div className="space-y-4 mt-8">
                {contact.address && <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" /><p className="text-text-muted">{contact.address}</p></div>}
                <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary shrink-0" /><a href={`tel:${contact.phone || "9952338765"}`} className="text-text-muted hover:text-primary transition-colors">{contact.phone || "9952338765"}</a></div>
                <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary shrink-0" /><a href={`mailto:${contact.email}`} className="text-text-muted hover:text-primary transition-colors">{contact.email || "nidarsanamhealthcare@gmail.com"}</a></div>
                {contact.businessHours && <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary shrink-0" /><p className="text-text-muted">{contact.businessHours}</p></div>}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-soft h-[300px] lg:h-[400px]">
              {contact.mapEmbedUrl ? (
                <iframe src={contact.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              ) : (
                <div className="h-full bg-surface flex items-center justify-center text-text-muted">Map will appear here once configured in CMS</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
