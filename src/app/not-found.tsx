import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
      {/* Giant 404 watermark */}
      <div
        className="text-[11rem] sm:text-[14rem] font-black leading-none text-zinc-900 select-none tracking-tighter mb-2"
        style={{ fontFamily: "var(--font-cinzel), serif" }}
        aria-hidden="true"
      >
        404
      </div>

      {/* Divider line */}
      <div className="w-16 h-px bg-amber-400/60 mb-8" />

      {/* Message */}
      <h2
        className="text-3xl font-bold text-white mb-4 tracking-wide"
        style={{ fontFamily: "var(--font-cinzel), serif" }}
      >
        Scene Not Found
      </h2>
      <p className="text-zinc-400 text-base mb-10 max-w-sm leading-relaxed">
        This scene was cut from our library. The page you&apos;re looking for
        doesn&apos;t exist or has been moved.
      </p>

      {/* Action */}
      <Link
        href="/"
        className="px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
