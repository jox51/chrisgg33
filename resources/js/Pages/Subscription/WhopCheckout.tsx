import { useEffect, useState, useRef, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface WhopCheckoutProps {
    planId: string;
    planType: string;
    planName: string;
    paymentId: number;
}

export default function WhopCheckout({ planId, planType, planName, paymentId }: WhopCheckoutProps) {
    const [phone, setPhone] = useState('');
    const [phoneSaved, setPhoneSaved] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const savedPhoneRef = useRef('');
    const debounceRef = useRef<NodeJS.Timeout>();

    // Poll server for payment completion (webhook updates the Payment record)
    useEffect(() => {
        let pollInterval: NodeJS.Timeout;

        const checkPaymentStatus = async () => {
            try {
                const response = await fetch(`/whop/payment-status/${paymentId}`);

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (data.status === 'paid') {
                    clearInterval(pollInterval);
                    window.location.href = `/whop/subscription-success?receipt_id=${data.whop_payment_id || ''}&plan_id=${data.plan_id}`;
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        };

        // Start polling after 5 seconds, then every 3 seconds
        const startTimeout = setTimeout(() => {
            pollInterval = setInterval(checkPaymentStatus, 3000);
        }, 5000);

        return () => {
            clearTimeout(startTimeout);
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [paymentId]);

    const savePhone = useCallback(async (value: string) => {
        const cleaned = value.trim();
        if (!cleaned || cleaned === savedPhoneRef.current) return;

        if (!/^[\d\s\+\-\(\)]{7,20}$/.test(cleaned)) {
            setPhoneError('Please enter a valid phone number.');
            setPhoneSaved(false);
            return;
        }

        setPhoneError('');

        try {
            const response = await fetch(`/whop/payment/${paymentId}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ phone: cleaned }),
            });

            if (response.ok) {
                savedPhoneRef.current = cleaned;
                setPhoneSaved(true);
            }
        } catch (error) {
            // Silent fail — webhook will still work, just without phone
        }
    }, [paymentId]);

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        setPhoneSaved(false);

        // Debounce auto-save: save 1s after user stops typing
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => savePhone(value), 1000);
    };

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    if (!planId) {
        return (
            <>
                <Head title="Checkout Error" />
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div className="max-w-md mx-auto bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                        <p className="text-lg font-semibold text-red-400 mb-4">Configuration Error</p>
                        <p className="text-gray-300">Plan is not configured. Please contact support.</p>
                        <a
                            href="/#pricing"
                            className="inline-block mt-6 text-blue-400 hover:text-blue-300 underline transition-colors"
                        >
                            Return to pricing
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`${planName} - Checkout`} />
            <div className="min-h-screen bg-gray-900">
                <div className="py-12">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-xl rounded-lg">
                            <div className="p-8">
                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold text-white mb-3">
                                        Complete Your Purchase — {planName}
                                    </h3>
                                    <p className="text-gray-400">
                                        Secure checkout powered by Whop
                                    </p>
                                </div>

                                <div className="mb-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        Phone Number <span className="text-red-400">*</span>
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => handlePhoneChange(e.target.value)}
                                            onBlur={() => savePhone(phone)}
                                            placeholder="+1 (555) 000-0000"
                                            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        />
                                        {phoneSaved && (
                                            <span className="text-green-400 text-sm whitespace-nowrap">Saved</span>
                                        )}
                                    </div>
                                    {phoneError && (
                                        <p className="mt-2 text-sm text-red-400" role="alert">{phoneError}</p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        So Chris can contact you to schedule your session.
                                    </p>
                                </div>

                                <div className="relative bg-gray-900 rounded-lg p-6 border border-gray-700">
                                    <style dangerouslySetInnerHTML={{ __html: `
                                        .whop-checkout-wrapper,
                                        .whop-checkout-wrapper iframe,
                                        .whop-checkout-wrapper > div,
                                        [data-whop-checkout],
                                        [data-whop-checkout] > div,
                                        [data-whop-checkout] iframe {
                                            background-color: #111827 !important;
                                        }
                                        .whop-checkout-wrapper * {
                                            background-color: transparent !important;
                                        }
                                        .whop-checkout-wrapper {
                                            color: white !important;
                                        }
                                    ` }} />

                                    <div className="whop-checkout-wrapper min-h-[500px]">
                                        <WhopCheckoutEmbed
                                            planId={planId}
                                            theme="dark"
                                            skipRedirect={true}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <a
                                        href="/#pricing"
                                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
                                    >
                                        Cancel and return to pricing
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
