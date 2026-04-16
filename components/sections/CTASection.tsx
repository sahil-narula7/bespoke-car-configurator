"use client";

import { FormEvent, useState } from "react";

type CTASectionProps = {
  title: string;
  description: string;
};

export default function CTASection({ title, description }: CTASectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      desiredCar: String(formData.get("desiredCar") ?? ""),
      investmentRange: String(formData.get("investmentRange") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/commission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Unable to submit your request. Please try again.");
      }

      setSubmitted(true);
      form.reset();

      window.setTimeout(() => {
        setSubmitted(false);
      }, 4200);
    } catch (error) {
      setSubmitted(false);
      setErrorMessage(error instanceof Error ? error.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-6 pb-24 pt-24 lg:px-12" id="contact">
      <div className="relative mx-auto grid max-w-7xl gap-12 overflow-hidden rounded-3xl border border-[#2f241d]/20 bg-[linear-gradient(130deg,#f8efe0,#efe2d0)] p-8 panel-glow lg:grid-cols-2 lg:p-14">
        <div className="pointer-events-none absolute inset-0 bg-[url('/gallery/car.jpg')] bg-cover bg-center opacity-50" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(160,61,46,0.18),transparent_32%),linear-gradient(180deg,rgba(255,244,230,0.25),rgba(34,24,19,0.64))]" />

        <div data-reveal className="relative z-10 space-y-5">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-[#f0c7b0]">Private Commission</p>
          <h2 className="font-display text-4xl text-[#fff1e6] sm:text-5xl">{title}</h2>
          <p className="max-w-xl text-base leading-relaxed text-[#f4e0d0]">{description}</p>
          <p className="max-w-xl text-sm leading-relaxed text-[#e7c6b1]">
            Our atelier will review your submission with discretion. Selected clients will be contacted to continue the commissioning process.
          </p>
        </div>

        <form data-reveal onSubmit={handleSubmit} className="relative z-10 grid gap-4 rounded-2xl border border-[#ffd8c2]/25 bg-[#110d0a]/45 p-5 backdrop-blur-md">
          <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-[#edc9b1]">
            Your Name
            <input
              required
              type="text"
              name="name"
              className="rounded-xl border border-[#ffd8c2]/25 bg-[#fdf6ee]/95 px-4 py-3 text-sm text-[#241712] outline-none transition duration-500 focus:border-[#d1705c]"
              placeholder="Your full name"
            />
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-[#edc9b1]">
            Private Email Address
            <input
              required
              type="email"
              name="email"
              className="rounded-xl border border-[#ffd8c2]/25 bg-[#fdf6ee]/95 px-4 py-3 text-sm text-[#241712] outline-none transition duration-500 focus:border-[#d1705c]"
              placeholder="name@private-domain.com"
            />
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-[#edc9b1]">
            Contact Number
            <input
              required
              type="tel"
              name="phone"
              className="rounded-xl border border-[#ffd8c2]/25 bg-[#fdf6ee]/95 px-4 py-3 text-sm text-[#241712] outline-none transition duration-500 focus:border-[#d1705c]"
              placeholder="+44 20 7946 0000"
            />
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-[#edc9b1]">
            Desired Motor Car
            <select
              required
              name="desiredCar"
              defaultValue=""
              className="rounded-xl border border-[#ffd8c2]/25 bg-[#fdf6ee]/95 px-4 py-3 text-sm text-[#241712] outline-none transition duration-500 focus:border-[#d1705c]"
            >
              <option value="" disabled>Select your preferred commission</option>
              <option value="coachbuilt-coupe">Coachbuilt Coupe</option>
              <option value="grand-tourer">Grand Tourer</option>
              <option value="bespoke-suv">Bespoke SUV</option>
              <option value="atelier-edition">Atelier Edition One-Off</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-[#edc9b1]">
            Investment Range
            <select
              required
              name="investmentRange"
              defaultValue=""
              className="rounded-xl border border-[#ffd8c2]/25 bg-[#fdf6ee]/95 px-4 py-3 text-sm text-[#241712] outline-none transition duration-500 focus:border-[#d1705c]"
            >
              <option value="" disabled>Select your range</option>
              <option value="250-500">USD 250,000 - 500,000</option>
              <option value="500-1m">USD 500,000 - 1,000,000</option>
              <option value="1m-2m">USD 1,000,000 - 2,000,000</option>
              <option value="2m-plus">USD 2,000,000+</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-[#edc9b1]">
            Describe Your Vision
            <textarea
              required
              name="message"
              rows={4}
              className="rounded-xl border border-[#ffd8c2]/25 bg-[#fdf6ee]/95 px-4 py-3 text-sm text-[#241712] outline-none transition duration-500 focus:border-[#d1705c]"
              placeholder="Share your desired motor car, preferred investment range, and personal commissioning vision."
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-xl border border-[#f1c2a9]/45 bg-[#a03d2e] px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-[#fff3e8] transition duration-500 hover:bg-[#8a3427]"
          >
            {isSubmitting ? "Sending Request..." : "Request Commission Review"}
          </button>

          {errorMessage ? (
            <p className="text-sm text-rose-300" aria-live="polite">
              {errorMessage}
            </p>
          ) : null}

          <p
            className={`text-sm text-[#ffe8da] transition duration-700 ${submitted ? "opacity-100" : "opacity-0"}`}
            aria-live="polite"
          >
            Your request has been received by the atelier.
          </p>
        </form>
      </div>
    </section>
  );
}
