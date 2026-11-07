import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CustomerReview } from '../types';
import { Star, CheckCircle2, Plus, X, Loader2 } from 'lucide-react';

interface TestimonialsSectionProps {
  reviews: CustomerReview[];
  onReviewAdded: (newReview: CustomerReview) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  reviews,
  onReviewAdded,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'general',
          customerName: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        onReviewAdded(data);
        setModalOpen(false);
        setName('');
        setComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 border-b border-white/[0.06] bg-[#050508] relative overflow-hidden">
      {/* Subtle ambient light */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-bl from-[#8B5CF6]/20 via-[#FF2E93]/15 to-transparent rounded-full blur-[140px] pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs font-bold text-[#FF6B4A] uppercase tracking-widest inline-block"
            >
              Social Proof & Trust
            </motion.span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1 tracking-tight">
              What Customers Say
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              Real reviews from developers, designers, and founders who trust CREOX for their digital assets.
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-full transition-all flex items-center gap-2 cursor-pointer shrink-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 text-[#2DD4BF]" />
            <span>Leave a Review</span>
          </motion.button>
        </motion.div>

        {/* Reviews Cards with whileInView reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                delay: idx * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-6 rounded-2xl bg-[#090b12] border border-white/[0.07] flex flex-col justify-between space-y-4 hover:border-[#8B5CF6]/40 transition-all shadow-lg hover:shadow-purple-950/20"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-slate-700'}`}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.customerName}</h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate max-w-[180px]">
                    {rev.productName}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#2DD4BF] font-semibold shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0a1120] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Share Your Feedback</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mahfuz Rahman"
                  className="w-full bg-[#070d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${s <= rating ? 'text-amber-400 fill-current' : 'text-slate-700'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Review / Experience *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell other buyers about product delivery speed and quality..."
                  className="w-full bg-[#070d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
