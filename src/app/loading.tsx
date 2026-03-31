export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-zinc-950">
      {/* Animated film reel */}
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Branding */}
      <div className="flex flex-col items-center gap-2">
        <span
          className="font-display text-3xl font-bold tracking-[0.25em] text-white"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          CINE<span className="text-amber-400">TUBE</span>
        </span>
        <span className="text-xs tracking-[0.5em] text-zinc-500 uppercase">
          Loading
        </span>
      </div>

      {/* Bottom dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-amber-400/60 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
