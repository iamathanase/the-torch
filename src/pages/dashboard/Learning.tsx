import { useData } from "@/context/DataContext";
import { BookOpen } from "lucide-react";

export default function Learning() {
  const { lessons } = useData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Learning Hub</h1>
        <p className="mt-2 text-base text-muted-foreground">Improve your skills with our courses.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <div 
            key={l.id} 
            className="flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all hover:shadow-md hover:border-border cursor-pointer group"
          >
            <div className="overflow-hidden">
              <img 
                src={l.image} 
                alt={l.title} 
                className="h-40 w-full object-cover transition-transform group-hover:scale-105" 
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start gap-2">
                <h3 className="flex-1 font-semibold leading-tight text-foreground line-clamp-2">{l.title}</h3>
                <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary capitalize">
                  {l.level}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{l.category}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-medium">{l.durationMin} minutes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
