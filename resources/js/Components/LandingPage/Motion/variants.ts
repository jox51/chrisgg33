import { Variants } from "framer-motion";

// Easing curves
export const EASE_REVEAL = [0.25, 0.1, 0.25, 1.0] as const;
export const EASE_HOVER = [0.4, 0, 0.2, 1] as const;

// Duration constants
export const DURATION_FAST = 0.4;
export const DURATION_DEFAULT = 0.55;
export const DURATION_SLOW = 0.7;

// Stagger constants
export const STAGGER_FAST = 0.06;
export const STAGGER_DEFAULT = 0.08;
export const STAGGER_SLOW = 0.12;

// Scroll reveal (replaces all AOS "fade-up")
export const fadeUp: Variants = {
    hidden: {
        opacity: 0,
        y: 24,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: DURATION_DEFAULT,
            ease: EASE_REVEAL,
        },
    },
};

// Reduced-motion variant (instant, no transform)
export const fadeUpReduced: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.01 },
    },
};

// Stagger container (parent wrapping staggered children)
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: STAGGER_DEFAULT,
            delayChildren: 0.1,
        },
    },
};

// Stagger container with custom stagger
export const createStaggerContainer = (
    stagger: number = STAGGER_DEFAULT,
    delayChildren: number = 0.1
): Variants => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren: stagger,
            delayChildren,
        },
    },
});

// Card hover (brutalist: border color shift + subtle lift)
export const cardHover = {
    borderColor: "#CA8A04",
    y: -2,
    transition: {
        duration: 0.2,
        ease: EASE_HOVER,
    },
};

// CTA button hover
export const ctaButtonHover = {
    scale: 1.02,
    transition: {
        duration: 0.15,
        ease: EASE_HOVER,
    },
};

export const ctaButtonTap = {
    scale: 0.98,
    transition: {
        duration: 0.1,
    },
};

// Promo banner slide-down / slide-up
export const bannerSlide: Variants = {
    hidden: {
        opacity: 0,
        y: -40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: DURATION_FAST,
            ease: EASE_REVEAL,
        },
    },
    exit: {
        opacity: 0,
        y: -40,
        transition: {
            duration: 0.3,
            ease: EASE_HOVER,
        },
    },
};

// FAQ accordion content
export const accordionContent: Variants = {
    collapsed: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.3, ease: EASE_HOVER },
            opacity: { duration: 0.2, ease: EASE_HOVER },
        },
    },
    expanded: {
        height: "auto",
        opacity: 1,
        transition: {
            height: { duration: 0.3, ease: EASE_HOVER },
            opacity: { duration: 0.25, delay: 0.05, ease: EASE_HOVER },
        },
    },
};

// Mobile menu slide
export const mobileMenuSlide: Variants = {
    hidden: {
        opacity: 0,
        height: 0,
    },
    visible: {
        opacity: 1,
        height: "auto",
        transition: {
            height: { duration: 0.3, ease: EASE_HOVER },
            opacity: { duration: 0.2, delay: 0.05 },
        },
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: {
            opacity: { duration: 0.15 },
            height: { duration: 0.25, delay: 0.05, ease: EASE_HOVER },
        },
    },
};
