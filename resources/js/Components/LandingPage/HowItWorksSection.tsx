import React from "react";
import SectionHeading from "./Shared/SectionHeading";
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
    return (
        <section id="opposition" className="py-20 bg-stone-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    label="Year of the Horse \u2014 2026"
                    title="Oppositional Year Consultation"
                    subtitle="2026 brings the Year of the Horse \u2014 the direct opposition of those born in the Year of the Rat. In Chinese astrology, this marks an Enemy Year: a cycle when challenges, conflicts, and hidden rivals often come to the surface."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={benefit.title}
                            className="flex items-start gap-4 p-5 border-[2px] border-stone-700 bg-stone-950 hover:border-yellow-600"
                            data-aos="fade-up"
                            data-aos-delay={String(index * 80)}
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
                        </div>
                    ))}
                </div>

                <div
                    className="brutalist-border-gold p-6 text-center mb-8"
                    data-aos="fade-up"
                >
                    <p className="font-mono text-xs uppercase tracking-wider text-yellow-600 mb-2">
                        For Those Born in Rat Years
                    </p>
                    <p className="font-serif text-lg text-stone-300">
                        {ratYears.join(" \u00b7 ")}
                    </p>
                </div>

                <div className="text-center" data-aos="fade-up">
                    <a
                        href="/subscribe/whop/opposition"
                        className="inline-block bg-yellow-600 text-stone-950 px-10 py-4 font-bold font-mono text-sm uppercase tracking-widest hover:bg-yellow-500 cursor-pointer mb-4"
                    >
                        Prepare Now &mdash; $170
                    </a>
                    <p className="text-stone-500 text-xs font-mono max-w-lg mx-auto">
                        Not year of the rat? Feel free to schedule &mdash; next enemy sign up
                        will be the Year of the Ox in 2027.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
