export function LogoMark() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] border border-cyan-300/24 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(7,12,22,0.98))] shadow-[0_24px_54px_rgba(2,6,23,0.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_44%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_40%)]" />
      <span className="absolute inset-y-2 left-3 w-px rounded-full bg-cyan-300/90" />
      <span className="absolute inset-y-3 left-6 w-px rounded-full bg-emerald-300/85" />
      <span className="absolute inset-y-1.5 left-9 w-px rounded-full bg-amber-300/80" />
      <span className="absolute left-2 right-2 top-2 h-px bg-white/8" />
    </div>
  );
}
