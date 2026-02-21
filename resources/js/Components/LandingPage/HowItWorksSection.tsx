import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./Shared/SectionHeading";
import { ScrollReveal } from "./Motion";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";
import { ctaButtonHover, ctaButtonTap, cardHoverSubtle } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";
import {
    Swords,
    Search,
    CalendarClock,
    ShieldCheck,
    Flame,
    Phone,
} from "lucide-react";

const benefits = [
    {
        icon: Swords,
        title: "Understand Your Enemy Year",
        description:
            "Why Rat and Horse clash, and how that energy will play out in 2026.",
    },
    {
        icon: Search,
        title: "Identify Opposition Patterns",
        description:
            "Learn where resistance may arise in love, career, health, and finances.",
    },
    {
        icon: CalendarClock,
        title: "Timing Matters",
        description:
            "Pinpoint the months when opposition is strongest, so you can plan wisely.",
    },
    {
        icon: ShieldCheck,
        title: "Protective Remedies",
        description:
            "Practical spiritual, energetic, and lifestyle strategies to neutralize negative influences.",
    },
    {
        icon: Flame,
        title: "Turn Opposition into Teachers",
        description:
            "Discover how to use this energy to grow stronger instead of being derailed.",
    },
    {
        icon: Phone,
        title: "45 Minute Call With Chris",
        description:
            "Ask your own questions about the upcoming oppositional year with the best in the industry.",
    },
];

const ratYears = [1960, 1972, 1984, 1996, 2008, 2020];

const HowItWorksSection: React.FC = () => {
    const prefersReduced = useReducedMotion();

    return (
        <section id="opposition" className="py-20 bg-stone-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    label="Year of the Horse — 2026"
                    title="Oppositional Year Consultation"
                    subtitle="2026 brings the Year of the Horse — the direct opposition of those born in the Year of the Rat. In Chinese astrology, this marks an Enemy Year: a cycle when challenges, conflicts, and hidden rivals often come to the surface."
                />

                <StaggerChildren
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
                    stagger={0.07}
                    delayChildren={0.1}
                >
                    {benefits.map((benefit) => (
                        <StaggerItem key={benefit.title}>
                            <motion.div
                                className="flex items-start gap-4 p-5 border-[2px] border-stone-700 bg-stone-950"
                                whileHover={prefersReduced ? undefined : cardHoverSubtle}
                            >
                                <benefit.icon
                                    className="text-yellow-600 flex-shrink-0 mt-1"
                                    size={22}
                                    strokeWidth={2}
                                />
                                <div>
                                    <h4 className="font-serif text-lg font-bold text-stone-50 mb-1">
                                        {benefit.title}
                                    </h4>
                                    <p className="text-stone-400 text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>

                <ScrollReveal className="brutalist-border-gold p-6 text-center mb-8">
                    <p className="font-mono text-xs uppercase tracking-wider text-yellow-600 mb-2">
                        For Those Born in Rat Years
                    </p>
                    <p className="font-serif text-lg text-stone-300">
                        {ratYears.join(" · ")}
                    </p>
                </ScrollReveal>

                <ScrollReveal className="text-center">
                    <motion.a
                        href="/subscribe/whop/opposition"
                        className="inline-block bg-yellow-600 text-stone-950 px-10 py-4 font-bold font-mono text-sm uppercase tracking-widest hover:bg-yellow-500 cursor-pointer mb-4"
                        whileHover={prefersReduced ? undefined : ctaButtonHover}
                        whileTap={prefersReduced ? undefined : ctaButtonTap}
                    >
                        Prepare Now &mdash; $170
                    </motion.a>
                    <p className="text-stone-500 text-xs font-mono max-w-lg mx-auto">
                        Not year of the rat? Feel free to schedule &mdash; next enemy sign up
                        will be the Year of the Ox in 2027.
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default HowItWorksSection;
