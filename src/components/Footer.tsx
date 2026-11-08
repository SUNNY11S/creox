import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreoxLogo } from './CreoxLogo';
import { Mail, Phone, MapPin, ExternalLink, Shield, FileText, RefreshCw, X } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  announcementText?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenLookup,
  onOpenAdmin,
  announcementText,
}) => {
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'refund' | null>(null);

  return (
    <footer id="contact" className="bg-[#050508] border-t border-white/[0.08] text-slate-400 text-xs w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info with whileInView */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 space-y-4"
          >
            <CreoxLogo size="md" showText={true} />
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              CREOX is a premier digital marketplace delivering verified software licenses, UI design systems, fullstack application boilerplates, and developer resources with instantaneous bKash checkout and automated cloud delivery.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                tg
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                yt
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                x
              </a>
            </div>
          </motion.div>

          {/* Quick Links with whileInView */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateSection('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Software & Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Tools & Agents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  UI Design Kits & Tokens
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Developer Boilerplates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Engineering E-books
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Customer Self-Service & Policies with whileInView */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenLookup}
                  className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Track & Retrieve Order</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('refund')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Refund & Replacement Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-[#8B5CF6] hover:text-[#2DD4BF] font-semibold transition-colors flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Control Portal</span>
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Contact Information with whileInView */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact & Support
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>support@creox.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>+880 1700-000000 (WhatsApp)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Plain Text Service & Delivery Note with whileInView */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 pt-6 pb-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block shrink-0" />
            <p className="text-slate-300 font-normal tracking-wide">
              {announcementText || 'Instant bKash Checkout with 100% automated digital delivery active 24/7'}
            </p>
          </div>
          <span className="text-slate-500 text-[11px]">
            Official Merchant Gateway · Cloudflare R2 Private Vault
          </span>
        </motion.div>

        {/* Bottom Bar with whileInView */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500"
        >
          <p>© {new Date().getFullYear()} CREOX Digital Limited. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Powered by official bKash Merchant Checkout & Cloudflare R2</span>
          </p>
        </motion.div>
      </div>

      {/* Legal Policies Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[80vh] flex flex-col rounded-2xl bg-[#0a1120] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-white capitalize">
                {activePolicy === 'terms' && 'Terms and Conditions'}
                {activePolicy === 'privacy' && 'Privacy Policy'}
                {activePolicy === 'refund' && 'Refund & Guarantee Policy'}
              </h3>
              <button
                onClick={() => setActivePolicy(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto text-xs text-slate-300 space-y-3 leading-relaxed">
              {activePolicy === 'terms' && (
                <>
                  <p>1. <strong>Digital Deliveries:</strong> All products distributed on CREOX are digital goods. Upon successful bKash payment verification, delivery is executed automatically via temporary download tokens or license keys.</p>
                  <p>2. <strong>License Use:</strong> Products licensed for single-user or commercial usage may not be redistributed, resold, or repackaged without written authorization.</p>
                  <p>3. <strong>Payment Method:</strong> Payment is processed exclusively through the official bKash Merchant API in Bangladeshi Taka (BDT).</p>
                </>
              )}

              {activePolicy === 'privacy' && (
                <>
                  <p>1. <strong>Data Collection:</strong> We collect only necessary details (Full Name, Email Address, Phone Number) for digital product fulfillment and warranty support.</p>
                  <p>2. <strong>Security:</strong> We do not store or process bKash PIN numbers. All payment authorization occurs securely on bKash merchant servers.</p>
                  <p>3. <strong>Cloud Storage:</strong> Customer files are stored in private Cloudflare R2 object buckets and accessed only via short-lived authenticated tokens.</p>
                </>
              )}

              {activePolicy === 'refund' && (
                <>
                  <p>1. <strong>Replacement Guarantee:</strong> If a license key or digital file is corrupted, non-functional, or misconfigured, we provide an immediate 100% replacement within 24 hours.</p>
                  <p>2. <strong>Refund Window:</strong> Due to the immutable nature of digital goods, refunds are honored if a technical defect cannot be resolved by support within 48 hours of purchase.</p>
                  <p>3. <strong>Support Inquiries:</strong> Contact support@creox.com with your Order Number (e.g. CRX-10491) for priority resolution.</p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => setActivePolicy(null)}
                className="w-full py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:opacity-95 shadow-md cursor-pointer transition-all"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
