import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./Shared/SectionHeading";
import { ScrollReveal } from "./Motion";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";
import { cardHoverSubtle } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";
import {
    Compass,
    Clock,
    Zap,
    TrendingUp,
    Brain,
    Target,
    Search,
    BookOpen,
    Award,
    Phone,
    ShieldCheck,
} from "lucide-react";

interface ServiceHighlight {
    icon: React.ElementType;
    text: string;
    detail: string;
}

interface ServiceDetail {
    icon: React.ElementType;
    name: string;
    tagline: string;
    description: string;
    highlights: ServiceHighlight[];
}

const services: ServiceDetail[] = [
    {
        icon: Compass,
        name: "Numerology Reading",
        tagline: "Decode your numbers. Sharpen your decisions.",
        description:
            "A one-on-one session with Chris to break down your personal numerology, uncover recurring life patterns, and build a framework for making better decisions. This isn't a generic reading — it's a practical conversation about your life.",
        highlights: [
            {
                icon: TrendingUp,
                text: "Personal Development",
                detail: "Identify where you are, where you're headed, and what's holding you back.",
            },
            {
                icon: Brain,
                text: "Decision Making",
                detail: "Use numerology and symbolic frameworks to cut through confusion.",
            },
            {
                icon: Target,
                text: "Accountability",
                detail: "Walk away with clear action steps — not just insights.",
            },
            {
                icon: Search,
                text: "Pattern Recognition",
                detail: "Spot the cycles that keep repeating so you can finally break them.",
            },
        ],
    },
    {
        icon: Clock,
        name: "2 Hour Session",
        tagline: "Go deeper. Cover more ground.",
        description:
            "An extended deep-dive for those who want comprehensive guidance in a single sitting. This session gives Chris enough time to address multiple areas of your life without rushing.",
        highlights: [
            {
                icon: BookOpen,
                text: "Extended Coaching",
                detail: "Two full hours of focused, uninterrupted mentorship.",
            },
            {
                icon: Compass,
                text: "In-Depth Guidance",
                detail: "Cover multiple topics — career, relationships, timing, and more.",
            },
            {
                icon: Award,
                text: "Best Value",
                detail: "Our best hourly rate for those ready to go all in.",
            },
        ],
    },
    {
        icon: Zap,
        name: "Emergency Services",
        tagline: "When you can't wait. Chris shows up fast.",
        description:
            "Life doesn't always give you time to plan. When you need urgent guidance, Chris will make himself available within 28 hours of your order — no waiting weeks for an opening.",
        highlights: [
            {
                icon: Clock,
                text: "Within 28 Hours",
                detail: "From order to session — Chris prioritizes you immediately.",
            },
            {
                icon: ShieldCheck,
                text: "Priority Scheduling",
                detail: "Jump ahead of the regular calendar for time-sensitive situations.",
            },
            {
                icon: Phone,
                text: "Direct Access",
                detail: "A direct line to Chris when you need answers now.",
            },
        ],
    },
];

const HowItWorksSection: React.FC = () => {
    const prefersReduced = useReducedMotion();

    return (
        <section id="services-detail" className="py-20 bg-stone-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    label="Explore"
                    title="A Deeper Look at Each Service"
                    subtitle="Every session is one-on-one with Chris — focused on practical life guidance, reflection, and application informed by historical, cultural, and symbolic frameworks."
                />

                <StaggerChildren
                    className="space-y-10"
                    stagger={0.12}
                    delayChildren={0.1}
                >
                    {services.map((service) => (
                        <StaggerItem key={service.name}>
                            <motion.div
                                className="border-[2px] border-stone-700 bg-stone-950 p-6 sm:p-8"
                                whileHover={
                                    prefersReduced
                                        ? undefined
                                        : cardHoverSubtle
                                }
                            >
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="bg-yellow-600/10 p-3 flex-shrink-0">
                                        <service.icon
                                            className="text-yellow-600"
                                            size={28}
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold text-stone-50">
                                            {service.name}
                                        </h3>
                                        <p className="font-mono text-xs uppercase tracking-wider text-yellow-600 mt-1">
                                            {service.tagline}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                                    {service.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {service.highlights.map((highlight) => (
                                        <div
                                            key={highlight.text}
                                            className="flex items-start gap-3"
                                        >
                                            <highlight.icon
                                                className="text-yellow-600 flex-shrink-0 mt-0.5"
                                                size={16}
                                                strokeWidth={2.5}
                                            />
                                            <div>
                                                <span className="text-stone-200 text-sm font-bold block">
                                                    {highlight.text}
                                                </span>
                                                <span className="text-stone-500 text-xs leading-relaxed">
                                                    {highlight.detail}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </div>
        </section>
    );
};

export default HowItWorksSection;
