export function ShimmerRow({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl w-full flex items-center justify-between px-6 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-300 dark:bg-slate-700 shrink-0" />
            <div className="space-y-1.5">
              <div className="w-36 h-3.5 bg-slate-300 dark:bg-slate-700 rounded-md" />
              <div className="w-24 h-2.5 bg-slate-300/70 dark:bg-slate-700/70 rounded-md" />
            </div>
          </div>
          <div className="w-28 h-4 bg-slate-300 dark:bg-slate-700 rounded-md hidden sm:block" />
          <div className="w-16 h-6 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ShimmerCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-300 dark:bg-slate-700" />
          <div className="space-y-2">
            <div className="w-3/4 h-4 bg-slate-300 dark:bg-slate-700 rounded-md" />
            <div className="w-1/2 h-3 bg-slate-300/70 dark:bg-slate-700/70 rounded-md" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="w-16 h-4 bg-slate-300 dark:bg-slate-700 rounded-md" />
            <div className="w-14 h-6 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
