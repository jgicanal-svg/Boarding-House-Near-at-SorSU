import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the boarding house verification process work?",
      answer: "Every boarding house listed on our platform undergoes a rigorous physical inspection by official SSU Bulan Campus verifiers. We inspect room dimensions, ventilation, sanitary facilities, electrical safety, owner credentials, and pricing fairness before issuing an official 'Verified' badge."
    },
    {
      question: "What should I know about lease agreements and monthly rental payments?",
      answer: "Most Bulan boarding houses operate on a month-to-month lease agreement or academic semester contract. Standard deposits are typically 1 month advance and 1 month deposit. You can discuss exact terms, utility splitting (electricity/water), and house rules directly with the owner via our integrated student messenger."
    },
    {
      question: "Are the boarding houses safe and secure for students?",
      answer: "Yes! Verified listings feature security measures such as secure perimeter gates, well-lit hallways, and optional CCTV monitoring. All properties are situated within safe, student-friendly Bulan barangays: Zone VIII Poblacion (Barangay 8 - Loyo), Santa Remedios, Obrero, ManagaNaga, and Libertad."
    },
    {
      question: "How close are the boarding houses to the SSU Bulan Campus gate?",
      answer: "Many verified accommodations are located within a 500-meter walking radius (~5 minutes walk) to the SSU Bulan Campus gate. You can click on any listing and view the interactive 'Nearby' map tab to see the exact walking route and distance in meters."
    },
    {
      question: "Can parents reserve a room in advance before moving to Bulan?",
      answer: "Yes. Students and parents can contact owners directly to discuss reservations or schedule physical viewings. Once agreed, properties can be marked as 'Reserved' to hold your room for the upcoming semester."
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-100 text-[#800000] text-xs font-bold border border-amber-300 shadow-sm">
            <HelpCircle className="w-4 h-4 text-[#800000]" />
            Student FAQ & Guide
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-zinc-600 max-w-xl mx-auto">Everything you need to know about boarding house verification, lease terms, safety, and living near SSU Bulan Campus.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="bg-zinc-50 border border-zinc-200/80 rounded-2xl overflow-hidden transition-all shadow-sm hover:border-zinc-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 hover:bg-zinc-100/80 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#800000] text-amber-300 text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {index + 1}
                    </span>
                    {faq.question}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#800000] shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />}
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 pt-2 text-xs text-zinc-600 leading-relaxed border-t border-zinc-200/60 bg-white">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
