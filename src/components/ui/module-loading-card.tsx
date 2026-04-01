import { SurfaceCard } from "@/components/ui/surface-card";

type ModuleLoadingCardProps = {
  title: string;
  description: string;
};

export function ModuleLoadingCard({
  title,
  description,
}: ModuleLoadingCardProps) {
  return (
    <SurfaceCard title={title} description={description}>
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <span className="animate-float-slow inline-flex h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.55)]" />
        Hydrating interactive controls and playback state.
      </div>
    </SurfaceCard>
  );
}
