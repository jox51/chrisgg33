import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./Shared/SectionHeading";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";
import { cardHover } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";
import {
    Compass,
    Clock,
    Zap,
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
            icon: Compass,
            title: "Numerology Reading",
            description:
                "Personal development, decision making, accountability, and pattern recognition with Chris.",
            price: "$280",
        },
        {
            icon: Clock,
            title: "2 Hour Coaching",
            description:
                "Extended session for in-depth personal guidance. Our best hourly rate available.",
            price: "$575",
        },
        {
            icon: Zap,
            title: "Emergency Services",
            description:
                "Need help as soon as possible? Chris will make himself available within 28 hours of your order.",
            price: "$980",
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
                                whileHover={prefersReduced ? undefined : cardHover}
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
