import React from "react";
import SectionHeading from "./Shared/SectionHeading";
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
    return (
        <section id="credentials" className="py-20 bg-stone-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    label="Credentials"
                    title="Why Chris"
                    subtitle="Trusted by thousands worldwide for strategic guidance through astrology and esoteric knowledge"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {credentials.map((cred, index) => (
                        <div
                            key={cred.text}
                            className="border-[3px] border-stone-700 bg-stone-950 p-6 hover:border-yellow-600 text-center cursor-default"
                            data-aos="fade-up"
                            data-aos-delay={String(index * 80)}
                        >
                            <cred.icon
                                className="text-yellow-600 mx-auto mb-3"
                                size={28}
                                strokeWidth={2}
                            />
                            <p className="font-serif text-xl font-bold text-stone-50">
                                {cred.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div
                    className="border-t-[3px] border-stone-700 pt-8 text-center"
                    data-aos="fade-up"
                >
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
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
