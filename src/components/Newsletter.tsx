"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <div className="bg-gray-800 text-white py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Our New Stuff?
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-md text-gray-900 outline-none"
                required
              />
              <button
                type="submit"
                className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Send
              </button>
            </form>
          </div>

          {/* Right Side */}
          <div className="text-gray-300">
            <p className="text-sm font-semibold mb-4 uppercase tracking-wider">
              STUFFUS FOR HOME AND OFFICE
            </p>
            <p className="text-base leading-relaxed">
              We'll listen to your needs, identify the best approach, and then
              create a bespoke smart PV charging solution that's right for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

