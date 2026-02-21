import React from "react";
import { motion } from "framer-motion";
import { Award, Users, Star, Newspaper } from "lucide-react";
import {
    fadeUp,
    fadeUpReduced,
    createStaggerContainer,
    ctaButtonHover,
    ctaButtonTap,
    STAGGER_SLOW,
    EASE_HOVER,
} from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";

interface HeroSectionProps {
    isSubscribed?: boolean;
    isAuthenticated?: boolean;
}

const credentials = [
    {
        icon: Award,
        text: "Top 10 Astrologist Worldwide",
    },
    {
        icon: Users,
        text: "143K+ on X",
    },
    {
        icon: Star,
        text: "32\u00b0 Freemason",
    },
    {
        icon: Newspaper,
        text: "Billboard \u00b7 HuffPost \u00b7 Newsweek",
    },
];

const HeroSection: React.FC<HeroSectionProps> = ({
    isSubscribed = false,
    isAuthenticated = false,
}) => {
    const prefersReduced = useReducedMotion();

    const ctaHref = isSubscribed
        ? "/app"
        : "#pricing";

    const ctaText = isSubscribed
        ? "Go to Dashboard"
        : "Book Now";

    const variants = prefersReduced ? fadeUpReduced : fadeUp;
    const container = prefersReduced
        ? { hidden: {}, visible: {} }
        : createStaggerContainer(STAGGER_SLOW, 0.2);

    return (
        <section className="min-h-screen bg-stone-950 flex items-center justify-center relative pt-24 pb-16">
            <motion.div
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                initial="hidden"
                animate="visible"
                variants={container}
            >
                <motion.span
                    className="section-label mb-6 block"
                    variants={variants}
                >
                    [Chris GG33]
                </motion.span>

                <motion.h1
                    className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-stone-50 mb-6 leading-[1.05]"
                    variants={variants}
                >
                    Get Strategic<br />
                    Guidance With{" "}
                    <span className="text-yellow-600">Chris</span>
                </motion.h1>

                <motion.p
                    className="text-stone-400 text-lg md:text-xl font-sans mb-12 max-w-2xl mx-auto"
                    variants={variants}
                >
                    I Am Your Favorite Influencer&rsquo;s Influencer
                </motion.p>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto"
                    variants={variants}
                >
                    {credentials.map((cred) => (
                        <motion.div
                            key={cred.text}
                            className="border-[3px] border-stone-700 p-4 bg-stone-900 cursor-default"
                            whileHover={prefersReduced ? undefined : {
                                borderColor: "#CA8A04",
                                y: -2,
                                transition: { duration: 0.2, ease: EASE_HOVER },
                            }}
                        >
                            <cred.icon
                                className="text-yellow-600 mx-auto mb-2"
                                size={24}
                                strokeWidth={2}
                            />
                            <span className="font-mono text-xs uppercase tracking-wider text-stone-300 block">
                                {cred.text}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={variants}>
                    <motion.a
                        href={ctaHref}
                        className="inline-block bg-yellow-600 text-stone-950 px-10 py-4 font-bold font-mono text-sm uppercase tracking-widest hover:bg-yellow-500 cursor-pointer"
                        whileHover={prefersReduced ? undefined : ctaButtonHover}
                        whileTap={prefersReduced ? undefined : ctaButtonTap}
                    >
                        {ctaText}
                    </motion.a>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
