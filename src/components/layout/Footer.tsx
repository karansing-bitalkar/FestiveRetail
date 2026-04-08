import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { BsWhatsapp } from 'react-icons/bs';

const FOOTER_LINKS = {
  'Quick Links': [
    { label: 'Home', path: '/home' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'Combo Offers', path: '/combos' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ],
  'Festivals': [
    { label: 'Diwali Collection', path: '/shop' },
    { label: 'Holi Special', path: '/shop' },
    { label: 'Wedding Gifts', path: '/shop' },
    { label: 'Birthday', path: '/shop' },
    { label: 'Ganesh Chaturthi', path: '/shop' },
    { label: 'Christmas', path: '/shop' },
  ],
  'Legal & Policies': [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Refund Policy', path: '/refund-policy' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Careers', path: '/careers' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top CTA strip */}
      <div className="fest-gradient py-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated with Festive Deals!</h3>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Subscribe to get exclusive offers, early access to sales, and festive notifications.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60"
            />
            <button type="submit" className="px-6 py-3 bg-white text-orange-500 font-bold rounded-xl hover:bg-orange-50 transition-all whitespace-nowrap">
              Subscribe Now
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 fest-gradient rounded-xl flex items-center justify-center">
                <HiSparkles className="text-white text-lg" />
              </div>
              <span className="font-bold text-xl text-white">FestiveRetail</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              India's #1 festive shopping destination. We bring you curated collections for every occasion — Diwali, Holi, Weddings, Birthdays and more. Experience the joy of gifting with our exclusive combo bundles.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <FiMail className="text-orange-400 flex-shrink-0" />
                <span>support@festiveretail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-orange-400 flex-shrink-0" />
                <span>+91 1800 123 4567 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-orange-400 flex-shrink-0" />
                <span>Pune, Maharashtra, India 411001</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: FiInstagram, color: 'hover:text-pink-400', label: 'Instagram' },
                { icon: FiFacebook, color: 'hover:text-blue-400', label: 'Facebook' },
                { icon: FiTwitter, color: 'hover:text-sky-400', label: 'Twitter' },
                { icon: FiYoutube, color: 'hover:text-red-400', label: 'YouTube' },
                { icon: BsWhatsapp, color: 'hover:text-green-400', label: 'WhatsApp' },
              ].map(({ icon: Icon, color, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 text-gray-400 ${color} transition-all hover:scale-110`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="flex flex-col gap-2">
                {links.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-orange-400 transition-all duration-200 inline-block" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© 2024 FestiveRetail. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>🔒 Secure Payments</span>
            <span>🚚 Free Delivery</span>
            <span>↩️ Easy Returns</span>
            <span>💳 GST Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
