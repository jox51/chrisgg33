import React from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "./Motion";
import { ctaButtonHover, ctaButtonTap } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";

const FinalCTASection: React.FC = () => {
    const prefersReduced = useReducedMotion();

    return (
        <section className="py-20 bg-stone-900 border-t-[3px] border-yellow-600">
            <ScrollReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="section-label mb-4 block">
                    [Get Started]
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-stone-50">
                    Ready to Get Strategic Guidance?
                </h2>
                <p className="text-stone-400 text-lg mb-10 max-w-2xl mx-auto">
                    Sessions focus on practical life guidance, reflection, and
                    application — informed by Chris's experience and study of
                    historical, cultural, and symbolic frameworks.
                </p>
                <motion.a
                    href="#pricing"
                    className="inline-block bg-yellow-600 text-stone-950 px-12 py-4 font-bold font-mono text-sm uppercase tracking-widest hover:bg-yellow-500 cursor-pointer"
                    whileHover={prefersReduced ? undefined : ctaButtonHover}
                    whileTap={prefersReduced ? undefined : ctaButtonTap}
                >
                    Book Your Session
                </motion.a>
            </ScrollReveal>
        </section>
    );
};

export default FinalCTASection;
