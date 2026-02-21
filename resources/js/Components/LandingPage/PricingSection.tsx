import React from "react";
import SectionHeading from "./Shared/SectionHeading";
import PricingCard from "./Pricing/PricingCard";

const PricingSection: React.FC = () => {
    const oppositionFeatures = [
        "Understand Your Enemy Year",
        "Identify Opposition Patterns",
        "Timing & Month-by-Month Guidance",
        "Protective Remedies & Strategies",
        "Turn Opposition into Teachers",
        "45 Minute Call With VK",
    ];

    const guidanceFeatures = [
        "Personal Development & Decision Making",
        "Accountability & Pattern Recognition",
        "Historical & Symbolic Frameworks",
        "One-on-One Mentorship Session",
        "Practical Life Guidance & Reflection",
    ];

    const twoHourFeatures = [
        "Extended 2.5 Hour Coaching",
        "Best Hourly Rate Available",
        "In-Depth Personal Guidance",
        "All Strategic Guidance Features",
    ];

    const emergencyFeatures = [
        "Available Within 28 Hours",
        "Priority Scheduling",
        "Immediate Expert Assistance",
        "Direct Access to VK",
    ];

    return (
        <section id="pricing" className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Book Your Session With VK"
                    subtitle="Choose the service that fits your needs"
                    titleClassName="text-white"
                    subtitleClassName="text-gray-400"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    <PricingCard
                        planName="Oppositional Year Prep"
                        price="$170"
                        pricePeriod="one-time"
                        features={oppositionFeatures}
                        buttonText="Book Now"
                        buttonLink="opposition"
                        aosDelay="100"
                        priceColor="text-blue-400"
                        buttonGradientFrom="from-blue-500"
                        buttonGradientTo="to-blue-600"
                        buttonHoverGradientFrom="from-blue-600"
                        buttonHoverGradientTo="to-blue-700"
                    />

                    <PricingCard
                        planName="Strategic Guidance"
                        price="$280"
                        pricePeriod="one-time"
                        features={guidanceFeatures}
                        buttonText="Schedule Now"
                        buttonLink="guidance"
                        isPopular={true}
                        popularText="Most Popular"
                        aosDelay="200"
                        gradientFrom="from-purple-900/50"
                        gradientTo="to-blue-900/50"
                        priceColor="text-purple-400"
                        buttonGradientFrom="from-purple-500"
                        buttonGradientTo="to-blue-600"
                        buttonHoverGradientFrom="from-purple-600"
                        buttonHoverGradientTo="to-blue-700"
                        hasProfitGlow={true}
                    />

                    <PricingCard
                        planName="2.5 Hour Session"
                        price="$440"
                        pricePeriod="one-time"
                        features={twoHourFeatures}
                        buttonText="Book 2.5 Hours"
                        buttonLink="two-hour"
                        aosDelay="300"
                        priceColor="text-emerald-400"
                        buttonGradientFrom="from-emerald-500"
                        buttonGradientTo="to-teal-600"
                        buttonHoverGradientFrom="from-emerald-600"
                        buttonHoverGradientTo="to-teal-700"
                    />

                    <PricingCard
                        planName="Emergency Services"
                        price="$800"
                        pricePeriod="one-time"
                        features={emergencyFeatures}
                        buttonText="Book Emergency"
                        buttonLink="emergency"
                        aosDelay="400"
                        priceColor="text-red-400"
                        buttonGradientFrom="from-red-500"
                        buttonGradientTo="to-orange-600"
                        buttonHoverGradientFrom="from-red-600"
                        buttonHoverGradientTo="to-orange-700"
                    />
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
