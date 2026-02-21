import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./Shared/SectionHeading";
import { ScrollReveal } from "./Motion";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";
import { EASE_HOVER } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";
import {
    Globe,
    TrendingUp,
    Star,
    Crown,
    Mic,
    Users,
    Newspaper,
} from "lucide-react";

interface Credential {
    icon: React.ElementType;
    text: string;
    detail?: string;
}

const credentials: Credential[] = [
    {
        icon: Globe,
        text: "Top 10 Astrologist Worldwide",
    },
    {
        icon: TrendingUp,
        text: "Followed by Billionaires",
    },
    {
        icon: Star,
        text: "32\u00b0 Freemason",
    },
    {
        icon: Crown,
        text: "Relative of Princess Grace Kelly",
    },
    {
        icon: Mic,
        text: "Co-Host To Elon Musk",
    },
    {
        icon: Users,
        text: "Over 143K on X",
    },
];

const pressNames = ["Billboard", "HuffPost", "Newsweek"];

const TestimonialsSection: React.FC = () => {
    const prefersReduced = useReducedMotion();

    return (
        <section id="credentials" className="py-20 bg-stone-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    label="Credentials"
                    title="Why Chris"
                    subtitle="Trusted by thousands worldwide for strategic guidance through astrology and esoteric knowledge"
                />

                <StaggerChildren
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
                    stagger={0.07}
                    delayChildren={0.1}
                >
                    {credentials.map((cred) => (
                        <StaggerItem key={cred.text}>
                            <motion.div
                                className="border-[3px] border-stone-700 bg-stone-950 p-6 text-center cursor-default"
                                whileHover={prefersReduced ? undefined : {
                                    borderColor: "#CA8A04",
                                    y: -2,
                                    transition: { duration: 0.2, ease: EASE_HOVER },
                                }}
                            >
                                <cred.icon
                                    className="text-yellow-600 mx-auto mb-3"
                                    size={28}
                                    strokeWidth={2}
                                />
                                <p className="font-serif text-xl font-bold text-stone-50">
                                    {cred.text}
                                </p>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>

                <ScrollReveal className="border-t-[3px] border-stone-700 pt-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Newspaper className="text-yellow-600" size={20} strokeWidth={2} />
                        <span className="font-mono text-xs uppercase tracking-wider text-stone-400">
                            As Seen On
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                        {pressNames.map((name) => (
                            <span
                                key={name}
                                className="font-serif text-2xl md:text-3xl font-bold text-stone-600"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default TestimonialsSection;
