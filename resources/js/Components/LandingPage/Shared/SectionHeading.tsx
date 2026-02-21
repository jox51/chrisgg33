import React from 'react';

interface SectionHeadingProps {
    title: string | React.ReactNode;
    subtitle?: string;
    label?: string;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    aosDelay?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
    title,
    subtitle,
    label,
    className = '',
    titleClassName = '',
    subtitleClassName = '',
    aosDelay = ''
}) => {
    return (
        <div
            className={`text-center mb-16 ${className}`}
            data-aos="fade-up"
            data-aos-delay={aosDelay}
        >
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
        </div>
    );
};

export default SectionHeading;
