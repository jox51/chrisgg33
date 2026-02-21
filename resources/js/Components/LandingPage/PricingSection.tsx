import React from "react";
import SectionHeading from "./Shared/SectionHeading";
import PricingCard from "./Pricing/PricingCard";
import StaggerChildren, { StaggerItem } from "./Motion/StaggerChildren";

const PricingSection: React.FC = () => {
    const oppositionFeatures = [
        "Understand Your Enemy Year",
        "Identify Opposition Patterns",
        "Timing & Month-by-Month Guidance",
        "Protective Remedies & Strategies",
        "Turn Opposition into Teachers",
        "45 Minute Call With Chris",
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
        "Direct Access to Chris",
    ];

    const soulMateFeatures = [
        "Your Soul Mate Date Revealed",
        "Beneficial Action Days",
        "Challenging Days to Lay Low",
        "Personalized to Your Birthday",
    ];

    const relationshipFeatures = [
        "Personalized Compatibility Analysis",
        "Recurring Pattern Insights",
        "Timing Advice for Breakthroughs",
        "Remedies & Practical Tools",
        "Follow-up Support & Guidance",
        "30 Minute Call With Chris",
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
                            planName="Oppositional Year Prep"
                            price="$170"
                            pricePeriod="one-time"
                            features={oppositionFeatures}
                            buttonText="Book Now"
                            buttonLink="opposition"
                        />
                    </StaggerItem>

                    <StaggerItem className="h-full">
                        <PricingCard
                            planName="Strategic Guidance"
                            price="$280"
                            pricePeriod="one-time"
                            features={guidanceFeatures}
                            buttonText="Schedule Now"
                            buttonLink="guidance"
                            isPopular={true}
                            popularText="Most Popular"
                        />
                    </StaggerItem>

                    <StaggerItem className="h-full">
                        <PricingCard
                            planName="2.5 Hour Session"
                            price="$440"
                            pricePeriod="one-time"
                            features={twoHourFeatures}
                            buttonText="Book 2.5 Hours"
                            buttonLink="two-hour"
                        />
                    </StaggerItem>

                    <StaggerItem className="h-full">
                        <PricingCard
                            planName="Emergency Services"
                            price="$800"
                            pricePeriod="one-time"
                            features={emergencyFeatures}
                            buttonText="Book Emergency"
                            buttonLink="emergency"
                        />
                    </StaggerItem>

                    <StaggerItem className="h-full">
                        <PricingCard
                            planName="Soul Mate & Dates"
                            price="$125"
                            pricePeriod="one-time"
                            features={soulMateFeatures}
                            buttonText="Find Your Soul Mate"
                            buttonLink="soulmate"
                        />
                    </StaggerItem>

                    <StaggerItem className="h-full">
                        <PricingCard
                            planName="Relationship / Compatibility"
                            price="$152"
                            pricePeriod="one-time"
                            features={relationshipFeatures}
                            buttonText="Get Insights"
                            buttonLink="relationship"
                        />
                    </StaggerItem>
                </StaggerChildren>
            </div>
        </section>
    );
};

export default PricingSection;
