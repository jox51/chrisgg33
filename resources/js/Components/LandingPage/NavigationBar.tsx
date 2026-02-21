import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { PageProps } from "@/types";
import { usePage, Link } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import Logo from "../../../images/logo.png";
import { mobileMenuSlide, ctaButtonHover, ctaButtonTap, EASE_HOVER } from "./Motion/variants";
import { useReducedMotion } from "./Motion/useReducedMotion";

interface NavigationBarProps {
    auth?: PageProps["auth"];
    className?: string;
    appName: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
    className = "",
    auth,
    appName,
}) => {
    const { blog_base_path } = usePage<PageProps>().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const prefersReduced = useReducedMotion();
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 100) {
            setNavHidden(true);
        } else {
            setNavHidden(false);
        }
    });

    const navLinks = [
        { href: "/#services", label: "Services" },
        { href: "/#pricing", label: "Pricing" },
        { href: "/#credentials", label: "Credentials" },
        { href: "/#faq", label: "FAQ" },
        { href: `/${blog_base_path}`, label: "Blog", isLink: true },
    ];

    return (
        <motion.nav
            animate={{ y: navHidden ? "-100%" : "0%" }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.3, ease: EASE_HOVER }}
            className={`fixed top-0 w-full z-50 bg-stone-950 border-b-[3px] border-stone-700 ${className}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-serif text-2xl font-bold text-yellow-600 tracking-wide"
                    >
                        <img
                            src={Logo}
                            alt="ChrisGG33"
                            className="w-10 h-10 object-contain"
                        />
                        CHRISGG33
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) =>
                            link.isLink ? (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider"
                                >
                                    {link.label}
                                </a>
                            )
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {auth?.user ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <span className="text-stone-400 font-mono text-sm">
                                    {auth.user.name}
                                </span>
                                <a
                                    href="/dashboard"
                                    className="text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider"
                                >
                                    Dashboard
                                </a>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    className="border-[2px] border-stone-700 bg-stone-900 px-4 py-1.5 text-stone-300 font-mono text-sm uppercase tracking-wider hover:border-yellow-600 hover:text-yellow-600 cursor-pointer"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <motion.a
                                href="/#pricing"
                                className="hidden md:block bg-yellow-600 text-stone-950 px-6 py-2 font-bold font-mono text-sm uppercase tracking-wider hover:bg-yellow-500 cursor-pointer"
                                whileHover={prefersReduced ? undefined : ctaButtonHover}
                                whileTap={prefersReduced ? undefined : ctaButtonTap}
                            >
                                Book Now
                            </motion.a>
                        )}

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden text-stone-400 hover:text-yellow-600 cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu"
                        variants={prefersReduced ? undefined : mobileMenuSlide}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden bg-stone-950 border-t-[2px] border-stone-700 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {navLinks.map((link) =>
                                link.isLink ? (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="block text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider py-2"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="block text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider py-2"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                )
                            )}
                            {auth?.user ? (
                                <>
                                    <a
                                        href="/dashboard"
                                        className="block text-stone-400 hover:text-yellow-600 font-mono text-sm uppercase tracking-wider py-2"
                                    >
                                        Dashboard
                                    </a>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        className="block border-[2px] border-stone-700 bg-stone-900 px-4 py-2 text-stone-300 font-mono text-sm uppercase tracking-wider text-center hover:border-yellow-600 cursor-pointer"
                                    >
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <a
                                    href="/#pricing"
                                    className="block bg-yellow-600 text-stone-950 px-4 py-2 font-bold font-mono text-sm uppercase tracking-wider text-center hover:bg-yellow-500 cursor-pointer"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Book Now
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default NavigationBar;
