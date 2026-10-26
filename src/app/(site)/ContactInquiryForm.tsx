"use client";

import { FormEvent, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    Headphones,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    User,
} from "lucide-react";
import Image from "next/image";

export default function ContactInquiryForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            name: String(formData.get("name") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            message: String(formData.get("message") || "").trim(),
        };

        try {
            const response = await fetch("/api/inquiries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                const fieldErrors = result?.errors;

                if (fieldErrors) {
                    const firstError = Object.values(fieldErrors)
                        .flat()
                        .find(Boolean);

                    setError(
                        String(
                            firstError ||
                            result?.message ||
                            "Please check your details."
                        )
                    );
                } else {
                    setError(
                        result?.message ||
                        "Failed to submit your inquiry."
                    );
                }

                return;
            }

            setSuccess(
                result?.message ||
                "Your inquiry has been submitted successfully."
            );

            form.reset();
        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full flex justify-center items-center mb-4">
            <div
                className="
        grid
        w-[95%]
        overflow-hidden
        rounded-2xl
        bg-white
        lg:h-full
        md:grid-cols-[0.82fr_1.18fr]
    "
            >
                {/* LEFT SIDE */}
                <div
                    className="
        hidden
        md:relative
        md:block
        overflow-hidden
        bg-[#eefaf8]
        px-5    
        py-6
        sm:px-6
        sm:py-7
        lg:h-full
        lg:px-7
        lg:py-8
    "
                >
                    {/* Decorative circles */}
                    <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#2FC2B0]/10" />

                    <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#2FC2B0]/10" />

                    <div className="relative z-10">

                        {/* Heading */}
                        <div className="mb-2 inline-flex items-center gap-2">
                            <span className="h-px w-5 bg-[#2FC2B0]" />

                            <span className="text-[11px] font-semibold italic text-[#2FC2B0]">
                                Get in Touch
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-[#00383B] sm:text-3xl">
                            Call Us
                        </h2>

                        <h3 className="mt-1 text-sm font-semibold text-[#00383B]">
                            We’re Here to Help You
                        </h3>

                        <p className="mt-1.5 max-w-[80%] text-[11px] leading-4 text-[#587174] md:text-[14px]">
                            Have a question, need assistance or want to
                            plan your next trip? Fill out the form and
                            our travel experts will get back to you
                            shortly.
                        </p>

                        {/* Contact details */}
                        <div className="mt-5 space-y-5">

                            {/* Phone */}
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2FC2B0] text-white">
                                    <Phone size={14} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-[#00383B]">
                                        Call Us
                                    </p>

                                    <a
                                        href="tel:+919876543210"
                                        className="block text-sm font-medium text-[#2FC2B0]"
                                    >
                                        +91 9876543210
                                    </a>

                                    <p className="text-[11px] text-[#789092]">
                                        Mon - Sun, 9 AM - 9 PM
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2FC2B0] text-white">
                                    <Mail size={14} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-[#00383B]">
                                        Email Us
                                    </p>

                                    <a
                                        href="mailto:hello@wander-india.com"
                                        className="block text-sm font-medium text-[#2FC2B0]"
                                    >
                                        hello@wander-india.com
                                    </a>

                                    <p className="text-[11px] text-[#789092]">
                                        We reply within 24 hours
                                    </p>
                                </div>
                            </div>

                            {/* Office */}
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2FC2B0] text-white">
                                    <MapPin size={14} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-[#00383B]">
                                        Our Office
                                    </p>

                                    <p className="max-w-[220px] text-[11px] leading-4 text-[#2FC2B0]">
                                        123 Travel Street, Connaught
                                        Place, New Delhi - 110001
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom visual */}
                        <div className="mt-5 hidden items-end gap-2 lg:flex">
                            <div className="relative h-[72px] w-[100px] rotate-[-6deg] overflow-hidden rounded-xl border-2 border-white shadow-sm">
                                <Image
                                    src="/images/signup.png"
                                    alt="Beautiful travel destination in India"
                                    fill
                                    sizes="100px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="relative h-[72px] w-[100px] rotate-[6deg] overflow-hidden rounded-xl border-2 border-white shadow-sm">
                                <Image
                                    src="/images/behind.png"
                                    alt="Scenic holiday destination"
                                    fill
                                    sizes="100px"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div
                    className="
        bg-white
        px-5
        py-6
        sm:px-6
        sm:py-7
        lg:h-full
        lg:px-7
        lg:py-8
    "
                >
                    {/* Form heading */}
                    <div className="mb-4 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2FC2B0]/15 text-[#2FC2B0]">
                            <Phone size={17} />
                        </div>

                        <div>
                            <p className="text-[11px] font-medium text-[#789092]">
                                Call Request Form
                            </p>

                            <h3 className="text-lg font-bold leading-tight text-[#00383B]">
                                Share Your Details
                            </h3>

                            <p className="text-[11px] leading-3.5 text-[#789092]">
                                Fill in the form and we'll get back to you
                                as soon as possible.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-medium text-[#00383B]"
                            >
                                Full Name{" "}
                                <span className="text-[#2FC2B0]">
                                    *
                                </span>
                            </label>

                            <div className="relative">
                                <User
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FC2B0]"
                                />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    required
                                    maxLength={100}
                                    className="h-9 w-full rounded-lg border border-[#dce8e7] bg-white pl-9 pr-3 text-sm text-[#00383B] outline-none transition placeholder:text-[#a6b5b6] focus:border-[#2FC2B0]"
                                />
                            </div>
                        </div>

                        {/* Phone + Email */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-1 block text-sm font-medium text-[#00383B]"
                                >
                                    Phone Number{" "}
                                    <span className="text-[#2FC2B0]">
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FC2B0]"
                                    />

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+91 9876543210"
                                        required
                                        maxLength={16}
                                        className="h-9 w-full rounded-lg border border-[#dce8e7] bg-white pl-9 pr-2 text-sm text-[#00383B] outline-none transition placeholder:text-[#a6b5b6] focus:border-[#2FC2B0]"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-sm font-medium text-[#00383B]"
                                >
                                    Email Address{" "}
                                    <span className="text-[#2FC2B0]">
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FC2B0]"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        maxLength={254}
                                        className="h-9 w-full rounded-lg border border-[#dce8e7] bg-white pl-9 pr-2 text-sm text-[#00383B] outline-none transition placeholder:text-[#a6b5b6] focus:border-[#2FC2B0]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label
                                htmlFor="message"
                                className="mb-1 block text-sm font-medium text-[#00383B]"
                            >
                                Your Message / Requirement{" "}
                                <span className="text-[#2FC2B0]">
                                    *
                                </span>
                            </label>

                            <div className="relative">
                                <MessageSquare
                                    size={14}
                                    className="absolute left-3 top-2.5 text-[#2FC2B0]"
                                />

                                <textarea
                                    id="message"
                                    name="message"
                                    rows={3}
                                    required
                                    maxLength={2000}
                                    placeholder="Tell us about your travel plans, preferred destinations, and special request etc."
                                    className="h-[72px] w-full resize-none rounded-lg border border-[#dce8e7] bg-white py-2 pl-9 pr-3 text-[12px] leading-4 text-[#00383B] outline-none transition placeholder:text-[#a6b5b6] focus:border-[#2FC2B0]"
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex cursor-pointer items-start gap-1.5 relative bottom-4">
                            <input
                                type="checkbox"
                                required
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#2FC2B0]"
                            />

                            <span className="text-[11px] leading-3.5 text-[#789092]">
                                I agree to the{" "}
                                <a
                                    href="/terms-and-conditions"
                                    className="font-medium text-[#2FC2B0] hover:underline"
                                >
                                    Terms & Conditions
                                </a>{" "}
                                and{" "}
                                <a
                                    href="/privacy-policy"
                                    className="font-medium text-[#2FC2B0] hover:underline"
                                >
                                    Privacy Policy
                                </a>
                                .
                            </span>
                        </label>

                        {/* Error */}
                        {error && (
                            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[10px] text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="flex items-start gap-1.5 rounded-md border border-[#2FC2B0]/20 bg-[#2FC2B0]/10 px-3 py-2 text-[10px] text-[#00383B]">
                                <CheckCircle2
                                    size={14}
                                    className="mt-0.5 shrink-0 text-[#2FC2B0]"
                                />

                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#2FC2B0] px-4 text-[13px] font-semibold text-white transition hover:bg-[#27ad9d] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Request
                                    <Send size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Support */}
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#e4eeee] bg-[#fbfdfd] px-3 py-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#2FC2B0]/30 text-[#2FC2B0]">
                            <Clock3 size={14} />
                        </div>

                        <div>
                            <p className="text-[12px] font-semibold leading-3.5 text-[#00383B]">
                                Our travel experts are available 24/7
                            </p>

                            <p className="text-[10px] leading-3 text-[#789092]">
                                We'll get back to you within a few hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}