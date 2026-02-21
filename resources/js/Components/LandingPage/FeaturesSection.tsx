import React from "react";
import SectionHeading from "./Shared/SectionHeading";
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
    aosDelay: string;
}

const FeaturesSection: React.FC = () => {
    const services: Service[] = [
        {
            icon: Shield,
            title: "Oppositional Year Prep",
            description:
                "Prepare, protect, and thrive during your enemy year. Includes a 45-minute call with Chris.",
            price: "$170",
            aosDelay: "0",
        },
        {
            icon: Compass,
            title: "Strategic Guidance",
            description:
                "Personal development, decision making, accountability, and pattern recognition with Chris.",
            price: "$280",
            aosDelay: "100",
        },
        {
            icon: Clock,
            title: "2.5 Hour Coaching",
            description:
                "Extended session for in-depth personal guidance. Our best hourly rate available.",
            price: "$440",
            aosDelay: "200",
        },
        {
            icon: AlertTriangle,
            title: "Emergency Services",
            description:
                "Need help as soon as possible? Chris will make himself available within 28 hours of your order.",
            price: "$800",
            aosDelay: "300",
        },
        {
            icon: Heart,
            title: "Soul Mate & Beneficial Dates",
            description:
                "Discover your soul mate date, the best days to take action, and which days to lay low.",
            price: "$125",
            aosDelay: "400",
        },
        {
            icon: Users,
            title: "Relationship / Compatibility",
            description:
                "30-minute astrology-based relationship insight and healing consultation with Chris.",
            price: "$152",
            aosDelay: "500",
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="border-[3px] border-stone-700 bg-stone-900 p-8 hover:border-yellow-600 cursor-default"
                            data-aos="fade-up"
                            data-aos-delay={service.aosDelay}
                        >
                            <service.icon
                                className="text-yellow-600 mb-4"
                                size={28}
                                strokeWidth={2}
                            />
                            <h3 className="font-serif text-2xl font-bold text-stone-50 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-stone-400 text-sm leading-relaxed mb-4">
                                {service.description}
                            </p>
                            <span className="font-serif text-xl font-bold text-yellow-600">
                                {service.price}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
