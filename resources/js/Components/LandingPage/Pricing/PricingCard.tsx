import React from "react";
import PlanFeatureListItem from "./PlanFeatureListItem";
import { trackButtonClick } from "../../../utils/gtmUtils";

interface PricingCardProps {
    planName: string;
    price: string;
    pricePeriod: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
    isPopular?: boolean;
    popularText?: string;
    aosDelay?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
    planName,
    price,
    pricePeriod,
    features,
    buttonText,
    buttonLink,
    isPopular = false,
    popularText = "Most Popular",
    aosDelay = "",
}) => {
    const actualButtonLink = `/subscribe/whop/${buttonLink}`;

    return (
        <div
            className={`border-[3px] p-8 relative ${
                isPopular
                    ? "border-yellow-600 bg-stone-900"
                    : "border-stone-700 bg-stone-900 hover:border-stone-600"
            }`}
            data-aos="fade-up"
            data-aos-delay={aosDelay}
        >
            {isPopular && (
                <div className="absolute top-0 right-0 bg-yellow-600 text-stone-950 px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold">
                    {popularText}
                </div>
            )}

            <div className="text-center mb-8">
                <h3 className="font-serif text-2xl font-bold text-stone-50 mb-4">
                    {planName}
                </h3>
                <div className="mb-2">
                    <span className="font-serif text-5xl font-bold text-yellow-600">
                        {price}
                    </span>
                </div>
                <span className="text-stone-500 font-mono text-xs uppercase tracking-wider">
                    {pricePeriod}
                </span>
            </div>

            <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                    <PlanFeatureListItem key={index} featureText={feature} />
                ))}
            </ul>

            <a
                href={actualButtonLink}
                className={`block w-full py-3 text-center font-bold font-mono text-sm uppercase tracking-wider cursor-pointer ${
                    isPopular
                        ? "bg-yellow-600 text-stone-950 hover:bg-yellow-500"
                        : "border-[2px] border-stone-600 text-stone-300 hover:border-yellow-600 hover:text-yellow-600"
                }`}
                onClick={() => {
                    trackButtonClick(
                        `select_plan_${planName
                            .toLowerCase()
                            .replace(/\s+/g, "_")}`,
                        {
                            button_location: "pricing",
                            plan_name: planName,
                            plan_price: price,
                        }
                    );
                }}
            >
                {buttonText}
            </a>
        </div>
    );
};

export default PricingCard;
