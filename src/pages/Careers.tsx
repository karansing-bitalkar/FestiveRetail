import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, ArrowRight, Sparkles, Users, TrendingUp, Heart } from 'lucide-react';

const JOBS = [
  { id: 1, title: 'Senior React Developer', dept: 'Engineering', location: 'Pune (Hybrid)', type: 'Full-Time', exp: '3-5 years', desc: 'Build and maintain our customer-facing web application with React, TypeScript, and modern tooling.' },
  { id: 2, title: 'Product Manager', dept: 'Product', location: 'Mumbai (Onsite)', type: 'Full-Time', exp: '4-6 years', desc: 'Drive product strategy for our marketplace platform, working with engineering and design teams.' },
  { id: 3, title: 'UX Designer', dept: 'Design', location: 'Remote', type: 'Full-Time', exp: '2-4 years', desc: 'Design intuitive and beautiful user experiences for our festive shopping platform.' },
  { id: 4, title: 'Vendor Relations Manager', dept: 'Operations', location: 'Delhi (Onsite)', type: 'Full-Time', exp: '2-3 years', desc: 'Onboard and manage vendor relationships, ensuring quality and timely fulfillment.' },
  { id: 5, title: 'Digital Marketing Specialist', dept: 'Marketing', location: 'Pune (Hybrid)', type: 'Full-Time', exp: '1-3 years', desc: 'Plan and execute digital marketing campaigns for festive seasons and product launches.' },
  { id: 6, title: 'Customer Support Lead', dept: 'Support', location: 'Remote', type: 'Full-Time', exp: '2+ years', desc: 'Lead a team of support agents to deliver exceptional customer experiences.' },
];

const PERKS = [
  { icon: TrendingUp, label: 'Growth Opportunities', desc: 'Fast-track career growth in a high-growth startup' },
  { icon: Heart, label: 'Health Benefits', desc: 'Comprehensive health insurance for you and family' },
  { icon: Users, label: 'Great Culture', desc: 'Collaborative, inclusive, and festive work culture' },
  { icon: Sparkles, label: 'Festive Bonuses', desc: 'Special bonuses during major festival seasons' },
];

export default function Careers() {
  return (
    <div>
      <section className="py-20 fest-gradient text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-5"><Sparkles size={14} /> Join Our Team</div>
          <h1 className="text-5xl font-black mb-4">Build the Future of Festive Shopping</h1>
          <p className="text-xl text-white/80">Join a passionate team building India's most loved festive e-commerce platform</p>
        </motion.div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {PERKS.map((p, i) => (
            <motion.div key={p.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-11 h-11 fest-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                <p.icon size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{p.label}</h3>
              <p className="text-xs text-gray-500">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">Open Positions</h2>
        <p className="text-gray-500 mb-8">{JOBS.length} positions available across teams</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {JOBS.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full mb-2 inline-block">{job.dept}</span>
                  <h3 className="font-black text-gray-900 group-hover:text-orange-500 transition-colors">{job.title}</h3>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{job.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{job.location}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><Clock size={11} />{job.type}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><Briefcase size={11} />{job.exp}</span>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                Apply Now <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-orange-50 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h3 className="text-2xl font-black text-gray-900 mb-2">Don't see a perfect fit?</h3>
          <p className="text-gray-500 mb-5">We're always looking for talented people. Send us your resume.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-all">
            Contact Us <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
