import { LucideIcon } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, delta }: { icon: LucideIcon; label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-sm border border-border/60 bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <Icon className="h-5 w-5 text-primary-glow" strokeWidth={1.4} />
        {delta && <span className="text-xs text-accent">{delta}</span>}
      </div>
      <p className="mt-6 font-display text-4xl text-foreground">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
