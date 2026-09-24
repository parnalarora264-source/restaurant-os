'use client';

import { Clock, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        
        {/* Contact Information */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[.3em] text-[#697552]">
            Come by
          </p>

          <h1 className="serif mt-3 text-6xl font-semibold">
            Let's eat.
          </h1>

          <p className="mt-6 leading-7 text-[#6b6258]">
            For reservations, group enquiries or just to say hello,
            reach out to the team.
          </p>

          <div className="mt-10 grid gap-5">
            <p className="flex gap-4">
              <MapPin className="text-[#697552]" />

              <span>
                Rolly's Pizzeria
                <br />
                New Delhi, India
              </span>
            </p>

            <p className="flex gap-4">
              <Clock className="text-[#697552]" />

              <span>
                Every day
                <br />
                11:00 AM — 11:00 PM
              </span>
            </p>

            <p className="flex gap-4">
              <Phone className="text-[#697552]" />

              <span>
                +91 9999999999
              </span>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          className="rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] p-7"
          onSubmit={handleSubmit}
        >
          <h2 className="serif text-3xl font-semibold">
            Send a message
          </h2>

          <div className="mt-6 grid gap-4">
            <input
              placeholder="Your name"
              className="rounded-2xl bg-[#F5EEDF] p-4 outline-none"
            />

            <input
              placeholder="Email"
              type="email"
              className="rounded-2xl bg-[#F5EEDF] p-4 outline-none"
            />

            <textarea
              placeholder="How can we help?"
              rows={6}
              className="rounded-2xl bg-[#F5EEDF] p-4 outline-none"
            />

            <button
              type="submit"
              className="rounded-full bg-[#3F4A32] px-6 py-3 font-semibold text-white"
            >
              Send enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}