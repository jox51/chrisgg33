import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { bannerSlide } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";

interface PromoBannerProps {
    message?: string;
    code?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({
    message = "Chinese New Year Special \u2014 25% Off",
    code = "HORSE2026",
}) => {
    const [dismissed, setDismissed] = useState(true);
    const prefersReduced = useReducedMotion();

    useEffect(() => {
        const wasDismissed = sessionStorage.getItem("promo-banner-dismissed");
        if (!wasDismissed) {
            setDismissed(false);
        }
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem("promo-banner-dismissed", "true");
    };

    return (
        <AnimatePresence>
            {!dismissed && (
                <motion.div
                    key="promo-banner"
                    variants={prefersReduced ? undefined : bannerSlide}
                    initial={prefersReduced ? undefined : "hidden"}
                    animate="visible"
                    exit={prefersReduced ? undefined : "exit"}
                    className="bg-yellow-600 text-stone-950 py-2.5 px-4 relative"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-center">
                        <p className="font-mono text-xs sm:text-sm uppercase tracking-wider font-bold text-center">
                            {message} &mdash; Code:{" "}
                            <span className="border-b-2 border-stone-950">{code}</span>
                        </p>
                        <button
                            onClick={handleDismiss}
                            className="absolute right-4 text-stone-950 hover:text-stone-700 cursor-pointer"
                            aria-label="Dismiss promotion"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PromoBanner;
