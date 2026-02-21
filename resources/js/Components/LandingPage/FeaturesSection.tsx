import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./Shared/SectionHeading";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";
import { EASE_HOVER } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";
import {
    Shield,
    Compass,
    Clock,
    AlertTriangle,
    Heart,
    Users,
} from "lucide-react";

interface Service {
    icon: React.ElementType;
    title: string;
    description: string;
    price: string;
}

const FeaturesSection: React.FC = () => {
    const prefersReduced = useReducedMotion();

    const services: Service[] = [
        {
            icon: Shield,
            title: "Oppositional Year Prep",
            description:
                "Prepare, protect, and thrive during your enemy year. Includes a 45-minute call with Chris.",
            price: "$170",
        },
        {
            icon: Compass,
            title: "Strategic Guidance",
            description:
                "Personal development, decision making, accountability, and pattern recognition with Chris.",
            price: "$280",
        },
        {
            icon: Clock,
            title: "2.5 Hour Coaching",
            description:
                "Extended session for in-depth personal guidance. Our best hourly rate available.",
            price: "$440",
        },
        {
            icon: AlertTriangle,
            title: "Emergency Services",
            description:
                "Need help as soon as possible? Chris will make himself available within 28 hours of your order.",
            price: "$800",
        },
        {
            icon: Heart,
            title: "Soul Mate & Beneficial Dates",
            description:
                "Discover your soul mate date, the best days to take action, and which days to lay low.",
            price: "$125",
        },
        {
            icon: Users,
            title: "Relationship / Compatibility",
            description:
                "30-minute astrology-based relationship insight and healing consultation with Chris.",
            price: "$152",
        },
    ];

    return (
        <section id="services" className="py-20 bg-stone-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    label="Services"
                    title="What Chris Offers"
                    subtitle="One-on-one mentorship conversations focused on practical life guidance, reflection, and application"
                />

                <StaggerChildren
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    stagger={0.08}
                    delayChildren={0.1}
                >
                    {services.map((service) => (
                        <StaggerItem key={service.title} className="h-full">
                            <motion.div
                                className="border-[3px] border-stone-700 bg-stone-900 p-8 cursor-default h-full flex flex-col"
                                whileHover={prefersReduced ? undefined : {
                                    borderColor: "#CA8A04",
                                    y: -2,
                                    transition: { duration: 0.2, ease: EASE_HOVER },
                                }}
                            >
                                <service.icon
                                    className="text-yellow-600 mb-4"
                                    size={28}
                                    strokeWidth={2}
                                />
                                <h3 className="font-serif text-2xl font-bold text-stone-50 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-stone-400 text-sm leading-relaxed mb-4 flex-grow">
                                    {service.description}
                                </p>
                                <span className="font-serif text-xl font-bold text-yellow-600">
                                    {service.price}
                                </span>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </div>
        </section>
    );
};

export default FeaturesSection;
