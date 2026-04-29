import { LucideIcon } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, delta }: { icon: LucideIcon; label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-xl border border-emerald-200 dark:border-slate-700 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-900 p-6 shadow-lg hover:shadow-xl transition-shadow hover:border-emerald-300 dark:hover:border-emerald-600">
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
          <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.4} />
        </div>
        {delta && <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">{delta}</span>}
      </div>
      <p className="mt-6 font-display text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 font-semibold">{label}</p>
    </div>
  );
}
