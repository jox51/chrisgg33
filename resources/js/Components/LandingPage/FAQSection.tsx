import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./Shared/SectionHeading";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";
import { accordionContent } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";

interface FAQItem {
    question: string;
    answer: string;
}

const FAQSection: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const prefersReduced = useReducedMotion();

    const faqs: FAQItem[] = [
        {
            question: "What is an Oppositional Year consultation?",
            answer: "In Chinese astrology, every 12 years your sign faces its direct opposition — your Enemy Year. The Oppositional Year consultation helps you understand the specific challenges, timing, and remedies to navigate this cycle. For 2026, this applies to those born in the Year of the Rat facing the Year of the Horse.",
        },
        {
            question: "How do I know my Chinese zodiac animal?",
            answer: "Your Chinese zodiac animal is determined by your birth year. The cycle repeats every 12 years: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. During your session, Chris will confirm your exact sign and any relevant details based on your full birthday.",
        },
        {
            question: "What happens during a Strategic Guidance session?",
            answer: "Strategic Guidance sessions focus on personal development, decision making, accountability, and pattern recognition. They are one-on-one mentorship conversations informed by Chris's experience and study of historical, cultural, and symbolic frameworks. These are not instructional courses — they are practical life guidance conversations.",
        },
        {
            question: "How quickly can I book an Emergency session?",
            answer: "Chris will make himself available within 28 hours of your Emergency Services order. This is our priority scheduling option for when you need help as soon as possible.",
        },
        {
            question: "What do I get with the Soul Mate & Dates service?",
            answer: "You receive three specific dates personalized to your birthday: your Soul Mate date (who your ideal match is), your Beneficial dates (days when things typically go your way and you should take action), and your Challenging dates (days to lay low and not push too hard).",
        },
        {
            question: "Can I book if I'm not born in the Year of the Rat?",
            answer: "Absolutely. While the Oppositional Year Prep is specifically designed for Rats facing the 2026 Horse year, anyone can schedule a consultation. If you want to start preparing for your next enemy year, feel free to book — the next opposition after Rat will be the Year of the Ox in 2027.",
        },
        {
            question: "How are sessions conducted?",
            answer: "All sessions are conducted via phone or video call. After booking through our secure checkout, you will receive scheduling instructions to pick a time that works for you. Chris personally handles every session.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 bg-stone-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    label="FAQ"
                    title="Frequently Asked Questions"
                    subtitle="Everything you need to know about Chris's services"
                />

                <StaggerChildren className="space-y-3" stagger={0.06}>
                    {faqs.map((faq, index) => (
                        <StaggerItem key={index}>
                            <div className="border-[2px] border-stone-700 bg-stone-900 overflow-hidden hover:border-stone-600">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between cursor-pointer"
                                    aria-expanded={openFAQ === index}
                                >
                                    <h3 className="font-serif text-lg font-bold text-stone-50 pr-4">
                                        {faq.question}
                                    </h3>
                                    <motion.span
                                        className="font-mono text-xl text-yellow-600 flex-shrink-0 leading-none"
                                        animate={{ rotate: openFAQ === index ? 45 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        +
                                    </motion.span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openFAQ === index && (
                                        <motion.div
                                            key="faq-content"
                                            variants={prefersReduced ? undefined : accordionContent}
                                            initial="collapsed"
                                            animate="expanded"
                                            exit="collapsed"
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div className="px-6 pb-5">
                                                <div className="h-px bg-stone-700 mb-4"></div>
                                                <p className="text-stone-400 text-sm leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </div>
        </section>
    );
};

export default FAQSection;
