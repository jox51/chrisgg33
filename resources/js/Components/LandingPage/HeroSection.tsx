import React from "react";
import { Award, Users, Star, Newspaper } from "lucide-react";

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
    const ctaHref = isSubscribed
        ? "/app"
        : "#pricing";

    const ctaText = isSubscribed
        ? "Go to Dashboard"
        : "Book Now";

    return (
        <section className="min-h-screen bg-stone-950 flex items-center justify-center relative pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span
                    className="section-label mb-6 block"
                    data-aos="fade-up"
                >
                    [Chris GG33]
                </span>

                <h1
                    className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-stone-50 mb-6 leading-[1.05]"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    Get Strategic<br />
                    Guidance With{" "}
                    <span className="text-yellow-600">Chris</span>
                </h1>

                <p
                    className="text-stone-400 text-lg md:text-xl font-sans mb-12 max-w-2xl mx-auto"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    I Am Your Favorite Influencer&rsquo;s Influencer
                </p>

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto"
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    {credentials.map((cred) => (
                        <div
                            key={cred.text}
                            className="border-[3px] border-stone-700 p-4 bg-stone-900 hover:border-yellow-600 cursor-default"
                        >
                            <cred.icon
                                className="text-yellow-600 mx-auto mb-2"
                                size={24}
                                strokeWidth={2}
                            />
                            <span className="font-mono text-xs uppercase tracking-wider text-stone-300 block">
                                {cred.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div data-aos="fade-up" data-aos-delay="400">
                    <a
                        href={ctaHref}
                        className="inline-block bg-yellow-600 text-stone-950 px-10 py-4 font-bold font-mono text-sm uppercase tracking-widest hover:bg-yellow-500 cursor-pointer"
                    >
                        {ctaText}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
