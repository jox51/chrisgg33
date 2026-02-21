import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

export const useReducedMotion = (): boolean => {
    const prefersReduced = useFramerReducedMotion();
    return prefersReduced ?? false;
};
