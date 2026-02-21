import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { ScrollReveal } from "./Motion";
import Logo from "../../../images/logo.png";

interface FooterProps {
    laravelVersion?: string;
    phpVersion?: string;
    appName: string;
}

const Footer: React.FC<FooterProps> = ({
    appName,
}) => {
    const { socialLinks } = usePage<PageProps>().props;

    return (
        <footer className="bg-stone-950 border-t-[3px] border-stone-700">
            <ScrollReveal
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
                duration={0.7}
                yOffset={16}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src={Logo}
                                alt="ChrisGG33"
                                className="w-10 h-10 object-contain"
                            />
                            <span className="font-serif text-2xl font-bold text-yellow-600 tracking-wide">
                                CHRISGG33
                            </span>
                        </div>
                        <p className="text-stone-400 mb-4 max-w-md font-sans text-sm leading-relaxed">
                            Strategic guidance through astrology, numerology, and
                            esoteric knowledge. Personal development, decision making,
                            and pattern recognition informed by historical, cultural,
                            and symbolic frameworks.
                        </p>
                        <a
                            href={socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-500 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider"
                        >
                            @ChrisGG33 on X
                        </a>
                    </div>
                    <div className="md:text-right">
                        <div className="mb-4 space-x-4">
                            <Link
                                href={route("terms")}
                                className="text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider"
                            >
                                Terms
                            </Link>
                            <Link
                                href={route("privacy.policy")}
                                className="text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider"
                            >
                                Privacy
                            </Link>
                            <Link
                                href={route("contact.show")}
                                className="text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider"
                            >
                                Contact
                            </Link>
                        </div>
                        <div className="text-stone-600 font-mono text-xs">
                            &copy; 2019&ndash;2026 CheckMate Visions LLC. All rights reserved.
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </footer>
    );
};

export default Footer;
