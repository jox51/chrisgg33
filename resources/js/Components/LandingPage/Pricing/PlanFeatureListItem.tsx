import React from "react";
import { Check } from "lucide-react";

interface PlanFeatureListItemProps {
    featureText: string;
}

const PlanFeatureListItem: React.FC<PlanFeatureListItemProps> = ({
    featureText,
}) => {
    return (
        <li className="flex items-center">
            <Check className="text-yellow-600 mr-3 flex-shrink-0" size={16} strokeWidth={3} />
            <span className="text-stone-300 text-sm">{featureText}</span>
        </li>
    );
};

export default PlanFeatureListItem;
