import React, { useEffect } from "react";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import Layout from "@/Components/LandingPage/Layout";
import HeroSection from "@/Components/LandingPage/HeroSection";
import FeaturesSection from "@/Components/LandingPage/FeaturesSection";
import HowItWorksSection from "@/Components/LandingPage/HowItWorksSection";
import PricingSection from "@/Components/LandingPage/PricingSection";
import TestimonialsSection from "@/Components/LandingPage/TestimonialsSection";
import FAQSection from "@/Components/LandingPage/FAQSection";
import FinalCTASection from "@/Components/LandingPage/FinalCTASection";
import { initSmoothScroll } from "@/utils/landingPageUtils";
import { initializeGTM } from "@/utils/gtmUtils";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    gtmId,
    appName,
}: PageProps<{
    laravelVersion: string;
    phpVersion: string;
    gtmId: string;
    appName: string;
}>) {
    useEffect(() => {
        initSmoothScroll();

        initializeGTM(gtmId, {
            pageType: "welcomePageLoad",
        });
    }, []);

    return (
        <>
            <Head title={appName}>
                <meta
                    name="description"
                    content="ChrisGG33 — Strategic guidance through astrology, numerology, and esoteric knowledge. Personal consultations with Chris for numerology readings, coaching sessions, and life guidance."
                />
                <meta
                    name="keywords"
                    content="astrology, numerology, Chinese astrology, Chris GG33, strategic guidance, esoteric knowledge, numerology reading, coaching, emergency consultation, gg33 capo"
                />
                <meta name="author" content="D28 Services" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
            </Head>
            <Layout laravelVersion={laravelVersion} phpVersion={phpVersion}>
                <div>
                    <HeroSection
                        isSubscribed={
                            auth.user?.has_active_subscription || false
                        }
                        isAuthenticated={!!auth.user}
                    />

                    <FeaturesSection />

                    <HowItWorksSection />

                    <PricingSection />

                    <TestimonialsSection />

                    <FAQSection />

                    <FinalCTASection />
                </div>
            </Layout>
        </>
    );
}
