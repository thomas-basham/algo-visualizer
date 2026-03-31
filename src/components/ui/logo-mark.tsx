export function LogoMark() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/25 bg-[linear-gradient(180deg,rgba(56,189,248,0.22),rgba(16,185,129,0.14))] shadow-[0_18px_40px_rgba(3,8,20,0.55)]">
      <span className="absolute left-3 top-3 h-4 w-1 rounded-full bg-cyan-300" />
      <span className="absolute left-5 top-5 h-3 w-1 rounded-full bg-emerald-300" />
      <span className="absolute left-7 top-2.5 h-5 w-1 rounded-full bg-amber-300" />
    </div>
  );
}

