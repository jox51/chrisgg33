import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    createStaggerContainer,
    fadeUp,
    fadeUpReduced,
    STAGGER_DEFAULT,
} from "./variants";
import { useReducedMotion } from "./useReducedMotion";

interface StaggerChildrenProps {
    children: React.ReactNode;
    className?: string;
    stagger?: number;
    delayChildren?: number;
    viewportMargin?: string;
    once?: boolean;
}

const StaggerChildren: React.FC<StaggerChildrenProps> = ({
    children,
    className = "",
    stagger = STAGGER_DEFAULT,
    delayChildren = 0.1,
    viewportMargin = "-80px",
    once = true,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once,
        margin: viewportMargin as `${number}px ${number}px ${number}px ${number}px`,
    });
    const prefersReduced = useReducedMotion();

    const containerVariants = prefersReduced
        ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
        : createStaggerContainer(stagger, delayChildren);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = "" }) => {
    const prefersReduced = useReducedMotion();

    return (
        <motion.div
            variants={prefersReduced ? fadeUpReduced : fadeUp}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default StaggerChildren;
