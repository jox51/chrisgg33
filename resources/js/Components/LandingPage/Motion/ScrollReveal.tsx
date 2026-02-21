import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUpReduced, EASE_REVEAL, DURATION_DEFAULT } from "./variants";
import { useReducedMotion } from "./useReducedMotion";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
    viewportMargin?: string;
    once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    className = "",
    delay = 0,
    duration,
    yOffset,
    viewportMargin = "-80px",
    once = true,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once,
        margin: viewportMargin as `${number}px ${number}px ${number}px ${number}px`,
    });
    const prefersReduced = useReducedMotion();

    const variants = prefersReduced
        ? fadeUpReduced
        : {
              hidden: {
                  opacity: 0,
                  y: yOffset ?? 24,
              },
              visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                      duration: duration ?? DURATION_DEFAULT,
                      ease: EASE_REVEAL,
                      delay,
                  },
              },
          };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
