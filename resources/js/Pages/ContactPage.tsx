import React from "react";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import Layout from "../Components/LandingPage/Layout";
import {
    ScrollReveal,
    StaggerChildren,
    StaggerItem,
} from "@/Components/LandingPage/Motion";
import {
    ctaButtonHover,
    ctaButtonTap,
} from "@/Components/LandingPage/Motion/variants";
import { useReducedMotion } from "@/Components/LandingPage/Motion/useReducedMotion";

function ContactFormInternal({ formspreeId }: { formspreeId: string }) {
    const [state, handleSubmit] = useForm(formspreeId);
    const prefersReduced = useReducedMotion();

    if (state.succeeded) {
        return (
            <div className="border-[3px] border-yellow-600 bg-stone-900 px-8 py-10 text-center">
                <span className="section-label mb-4 block">
                    [Message Sent]
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-50 mb-3">
                    Thank You for Reaching Out
                </h3>
                <p className="text-stone-400">
                    We'll get back to you as soon as possible.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <StaggerChildren className="space-y-6" stagger={0.08}>
                <StaggerItem>
                    <label
                        htmlFor="email"
                        className="block text-stone-300 font-mono text-xs uppercase tracking-wider mb-2"
                    >
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="mt-1 block w-full px-4 py-3 bg-stone-900 border-[2px] border-stone-700 placeholder-stone-600 focus:outline-none focus:ring-0 focus:border-yellow-600 text-sm text-stone-50 transition-colors duration-200"
                        placeholder="your.email@example.com"
                        required
                    />
                    <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                        className="mt-2 text-sm text-red-400"
                    />
                </StaggerItem>

                <StaggerItem>
                    <label
                        htmlFor="message"
                        className="block text-stone-300 font-mono text-xs uppercase tracking-wider mb-2"
                    >
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="mt-1 block w-full px-4 py-3 bg-stone-900 border-[2px] border-stone-700 placeholder-stone-600 focus:outline-none focus:ring-0 focus:border-yellow-600 text-sm text-stone-50 transition-colors duration-200 resize-vertical"
                        placeholder="Tell us how we can help you..."
                        required
                    />
                    <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        className="mt-2 text-sm text-red-400"
                    />
                </StaggerItem>

                <StaggerItem>
                    <motion.button
                        type="submit"
                        disabled={state.submitting}
                        className="w-full flex justify-center bg-yellow-600 text-stone-950 px-10 py-4 font-bold font-mono text-sm uppercase tracking-widest hover:bg-yellow-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={
                            prefersReduced ? undefined : ctaButtonHover
                        }
                        whileTap={prefersReduced ? undefined : ctaButtonTap}
                    >
                        {state.submitting ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-stone-950"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Submitting...
                            </div>
                        ) : (
                            "Send Message"
                        )}
                    </motion.button>
                </StaggerItem>
            </StaggerChildren>
        </form>
    );
}

export default function ContactPage({ formspreeId }: { formspreeId: string }) {
    return (
        <Layout>
            <Head title="Contact Us" />
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <ScrollReveal className="text-center mb-16">
                        <span className="section-label mb-4 block">
                            [Contact]
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-stone-50">
                            Get in Touch
                        </h1>
                        <p className="text-stone-400 text-lg max-w-2xl mx-auto">
                            Have questions about Chris's services? Need guidance
                            on booking a session? We'd love to hear from you.
                        </p>
                    </ScrollReveal>

                    {/* Contact Form Card */}
                    <ScrollReveal delay={0.15}>
                        <div className="border-[3px] border-stone-700 bg-stone-900 px-8 py-10 sm:px-12 sm:py-12 max-w-2xl mx-auto">
                            <div className="mb-8">
                                <h2 className="font-serif text-2xl font-bold text-stone-50 mb-2">
                                    Send Us a Message
                                </h2>
                                <p className="text-stone-400 text-sm">
                                    Fill out the form below and we'll get back
                                    to you as soon as possible.
                                </p>
                            </div>

                            <ContactFormInternal formspreeId={formspreeId} />
                        </div>
                    </ScrollReveal>

                    {/* Response Time Note */}
                    <ScrollReveal delay={0.25}>
                        <p className="text-stone-500 font-mono text-xs uppercase tracking-wider text-center mt-6">
                            We typically respond within 24 hours
                        </p>
                    </ScrollReveal>
                </div>
            </section>
        </Layout>
    );
}
