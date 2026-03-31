"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="relative mb-10">
        <div className="h-28 w-28 rounded-full bg-red-500/10 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-red-500/15 flex items-center justify-center">
            <svg
              className="h-10 w-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-4xl font-bold text-white mb-3 tracking-wide"
        style={{ fontFamily: "var(--font-cinzel), serif" }}
      >
        Reel Broke
      </h1>
      <p className="text-zinc-400 text-lg mb-4 max-w-md leading-relaxed">
        Something went wrong while projecting this page.
      </p>

      {error?.message && (
        <p className="text-zinc-500 text-sm mb-10 max-w-sm font-mono bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-800 break-all">
          {error.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={reset}
          className="px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
