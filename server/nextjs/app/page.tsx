"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/get-oauth-link");
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      setError("Failed to get OAuth link");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">
          Onboard a Standard account with OAuth
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
          )}

          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-stripe-purple text-white py-3 rounded-md font-semibold hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Connect with Stripe"}
          </button>
        </div>
      </div>
    </main>
  );
}
