export function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--td-card)" }}>
      <div className="skeleton h-40 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function FeedItemSkeleton() {
  return (
    <div className="px-4 py-4 flex gap-3" style={{ borderBottom: "1px solid var(--td-separator)" }}>
      <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--td-bg)" }}>
      <div className="flex flex-col items-center pt-12 pb-6 px-6">
        <div className="skeleton w-20 h-20 rounded-full mb-4" />
        <div className="skeleton h-6 w-40 mb-2" />
        <div className="skeleton h-4 w-24 mb-6" />
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-1">
            <div className="skeleton h-5 w-8" />
            <div className="skeleton h-3 w-12" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="skeleton h-5 w-8" />
            <div className="skeleton h-3 w-16" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="skeleton h-5 w-8" />
            <div className="skeleton h-3 w-16" />
          </div>
        </div>
      </div>
      <div className="px-4 space-y-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function TripDetailSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--td-bg)" }}>
      <div className="skeleton h-[320px] w-full" style={{ borderRadius: 0 }} />
      <div className="px-4 -mt-6 relative space-y-4">
        <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: "var(--td-card)" }}>
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="flex gap-2">
            <div className="skeleton h-8 w-24 rounded-full" />
            <div className="skeleton h-8 w-20 rounded-full" />
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl p-4 space-y-2" style={{ backgroundColor: "var(--td-card)" }}>
            <div className="skeleton h-5 w-1/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExploreGridSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4].map(i => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
