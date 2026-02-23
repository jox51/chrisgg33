import React from "react";
import SectionHeading from "./Shared/SectionHeading";
import PricingCard from "./Pricing/PricingCard";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";

const PricingSection: React.FC = () => {
    const guidanceFeatures = [
        "Numerology & Life Path Analysis",
        "Personal Development & Decision Making",
        "Accountability & Pattern Recognition",
        "One-on-One Session with Chris",
        "Practical Life Guidance & Reflection",
    ];

    const twoHourFeatures = [
        "Extended 2 Hour Coaching",
        "Best Hourly Rate Available",
        "In-Depth Personal Guidance",
        "All Numerology Reading Features",
    ];

    const emergencyFeatures = [
        "Available Within 28 Hours",
        "Priority Scheduling",
        "Immediate Expert Assistance",
        "Direct Access to Chris",
    ];

    return (
        <section id="pricing" className="py-20 bg-stone-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    label="Pricing"
                    title="Book Your Session With Chris"
                    subtitle="Choose the service that fits your needs"
                />

                <StaggerChildren
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                    stagger={0.08}
                    delayChildren={0.1}
                >
                    <StaggerItem className="h-full">
                        <PricingCard
                            planName="Numerology Reading"
                            price="$280"
                            pricePeriod="one-time"
                            features={guidanceFeatures}
                            buttonText="Book Reading"
                            buttonLink="guidance"
                            isPopular={true}
                            popularText="Most Popular"
                        />
                    </StaggerItem>

                    <StaggerItem className="h-full">
                        <PricingCard
                            planName="2 Hour Session"
                            price="$575"
                            pricePeriod="one-time"
                            features={twoHourFeatures}
                            buttonText="Book 2 Hours"
                            buttonLink="two-hour"
                        />
                    </StaggerItem>

                    <StaggerItem className="h-full">
                        <PricingCard
                            planName="Emergency Services"
                            price="$980"
                            pricePeriod="one-time"
                            features={emergencyFeatures}
                            buttonText="Book Emergency"
                            buttonLink="emergency"
                        />
                    </StaggerItem>
                </StaggerChildren>
            </div>
        </section>
    );
};

export default PricingSection;
