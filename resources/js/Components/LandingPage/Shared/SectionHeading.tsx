import React from 'react';
import { ScrollReveal } from '../Motion';

interface SectionHeadingProps {
    title: string | React.ReactNode;
    subtitle?: string;
    label?: string;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
    title,
    subtitle,
    label,
    className = '',
    titleClassName = '',
    subtitleClassName = '',
}) => {
    return (
        <ScrollReveal className={`text-center mb-16 ${className}`}>
            {label && (
                <span className="section-label mb-4 block">
                    [{label}]
                </span>
            )}
            <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-stone-50 ${titleClassName}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`text-lg max-w-3xl mx-auto text-stone-400 font-sans ${subtitleClassName}`}>
                    {subtitle}
                </p>
            )}
        </ScrollReveal>
    );
};

export default SectionHeading;
