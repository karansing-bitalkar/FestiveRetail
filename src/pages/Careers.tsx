import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { toast } from 'sonner';

const OPEN_ROLES = [
  { title: 'Senior Frontend Developer', dept: 'Engineering', location: 'Pune / Remote', type: 'Full-time', exp: '3-5 years', desc: 'Build scalable React.js applications for India\'s fastest-growing festive platform.' },
  { title: 'Product Manager', dept: 'Product', location: 'Pune', type: 'Full-time', exp: '4-6 years', desc: 'Lead product strategy for our marketplace and vendor management platforms.' },
  { title: 'Festive Curator Specialist', dept: 'Merchandising', location: 'Pune / Mumbai', type: 'Full-time', exp: '2-4 years', desc: 'Curate the best festive products and create exclusive combo bundles.' },
  { title: 'Vendor Relations Manager', dept: 'Operations', location: 'Mumbai', type: 'Full-time', exp: '3-5 years', desc: 'Manage and grow our vendor network across India.' },
  { title: 'Digital Marketing Specialist', dept: 'Marketing', location: 'Remote', type: 'Full-time', exp: '2-3 years', desc: 'Drive digital campaigns during festive seasons and grow brand awareness.' },
  { title: 'Customer Success Executive', dept: 'Support', location: 'Pune', type: 'Full-time', exp: '1-2 years', desc: 'Ensure exceptional customer experience across all touchpoints.' },
];

const PERKS = [
  { emoji: '💰', title: 'Competitive Salary', desc: 'Market-leading compensation with annual performance bonuses' },
  { emoji: '🏥', title: 'Health Insurance', desc: 'Comprehensive medical coverage for you and your family' },
  { emoji: '🎁', title: 'Festival Gifting', desc: 'Employee gift hampers for every major festival' },
  { emoji: '🏠', title: 'Remote Flexibility', desc: 'Hybrid work model with flexible hours' },
  { emoji: '📚', title: 'Learning Budget', desc: '₹30,000 annual learning & development budget' },
  { emoji: '🚀', title: 'Stock Options', desc: 'ESOPs for all full-time employees' },
];

const CULTURE_POINTS = [
  { title: 'Fast-paced & Impactful', desc: 'Work on products used by 2 lakh+ customers and make real difference during India\'s most important festivals.' },
  { title: 'Diverse & Inclusive', desc: 'We celebrate diversity as much as we celebrate festivals. 40% women in leadership, 20+ languages spoken.' },
  { title: 'Growth-Focused', desc: 'Every employee has a clear growth path. 60% of our leadership has been promoted internally.' },
];

const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function Careers() {
  const [applied, setApplied] = useState<string | null>(null);
  const handleApply = (role: string) => {
    setApplied(role);
    toast.success(`Application submitted for ${role}!`, { description: 'We\'ll contact you within 3-5 business days.' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-24 fest-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">{[...Array(5)].map((_, i) => <div key={i} className="absolute w-80 h-80 rounded-full border border-white" style={{ right: `${i*20}%`, top: '-30%' }} />)}</div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-5"><HiSparkles /> We're Hiring!</div>
            <h1 className="text-5xl font-black mb-4">Build the Future of<br />Festive Commerce</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">Join our mission to bring joy to millions of Indians during their most special celebrations. Work on impactful products used by lakhs of customers.</p>
            <div className="flex justify-center gap-8">
              {[{ v: '50+', l: 'Team Members' }, { v: '10+', l: 'Open Roles' }, { v: '4.8★', l: 'Glassdoor Rating' }].map(s => (
                <div key={s.l}><div className="text-3xl font-black">{s.v}</div><div className="text-white/70 text-sm">{s.l}</div></div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Life at FestiveRetail</h2>
          <p className="text-gray-500">What makes us a great place to work</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {CULTURE_POINTS.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{c.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
        {/* Team photos */}
        <div className="grid grid-cols-3 gap-3">
          {['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80'].map((img, i) => (
            <div key={i} className="aspect-video rounded-2xl overflow-hidden">
              <img src={img} alt="Team" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Perks & Benefits</h2>
            <p className="text-gray-500">We take care of our people</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {PERKS.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{p.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                <p className="text-gray-500 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Open Positions</h2>
          <p className="text-gray-500">Find your next opportunity</p>
        </motion.div>
        <div className="flex flex-col gap-4">
          {OPEN_ROLES.map((role, i) => (
            <motion.div key={role.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">{role.dept}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><FiMapPin className="text-xs" />{role.location}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><FiClock className="text-xs" />{role.type}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><FiBriefcase className="text-xs" />{role.exp}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{role.title}</h3>
                  <p className="text-gray-500 text-sm">{role.desc}</p>
                </div>
                <button
                  onClick={() => handleApply(role.title)}
                  disabled={applied === role.title}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${applied === role.title ? 'bg-green-100 text-green-600 cursor-not-allowed' : 'fest-gradient text-white hover:opacity-90'}`}
                >
                  {applied === role.title ? '✓ Applied' : <>Apply Now <FiArrowRight /></>}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hiring process */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Our Hiring Process</h2>
            <p className="text-gray-500">Simple, transparent, and fast</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Apply Online', desc: 'Submit your application and resume' },
              { step: '02', title: 'HR Screening', desc: 'Quick 15-min call with HR team' },
              { step: '03', title: 'Technical Round', desc: 'Skills assessment relevant to role' },
              { step: '04', title: 'Offer & Join!', desc: 'Offer letter within 24 hours' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <div className="text-3xl font-black fest-text-gradient mb-2">{s.step}</div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{s.title}</h3>
                <p className="text-gray-500 text-xs">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 fest-gradient text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-black mb-3">Don't see a fit? We'd still love to hear from you!</h2>
            <p className="text-white/80 mb-6">Send your resume to careers@festiveretail.com. We're always looking for talented people.</p>
            <a href="mailto:careers@festiveretail.com" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-500 rounded-2xl font-bold hover:bg-orange-50 transition-all shadow-lg">
              Send Your Resume <FiArrowRight />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
