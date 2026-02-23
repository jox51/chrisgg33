import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./Shared/SectionHeading";
import { ScrollReveal } from "./Motion";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";
import { cardHover } from "./Motion/variants";
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
        text: "GG33 Capo",
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

const pressOutlets = [
    {
        name: "Billboard",
        url: "https://twitter.com/billboard?t=ggj0MhUcx91ooC-YbioJ1A&s=09",
    },
    {
        name: "HuffPost",
        url: "https://twitter.com/HuffPost?t=TwR0NvMQrhSOkCj0QOKWBg&s=09",
    },
    {
        name: "Newsweek",
        url: "https://twitter.com/Newsweek?t=tb889ae-XchitjNkEqbbVg&s=09",
    },
];

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
                                whileHover={
                                    prefersReduced ? undefined : cardHover
                                }
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
                        <Newspaper
                            className="text-yellow-600"
                            size={20}
                            strokeWidth={2}
                        />
                        <span className="font-mono text-xs uppercase tracking-wider text-stone-400">
                            As Seen On
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                        {pressOutlets.map((outlet) => (
                            <a
                                key={outlet.name}
                                href={outlet.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-serif text-2xl md:text-3xl font-bold text-stone-600 hover:text-yellow-600 transition-colors duration-200"
                            >
                                {outlet.name}
                            </a>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default TestimonialsSection;
