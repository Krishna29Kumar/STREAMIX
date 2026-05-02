export default function SkeletonGrid({ count = 20 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-dark-700">
          <div className="aspect-[2/3] shimmer" />
          <div className="p-3 space-y-2">
            <div className="h-3 rounded shimmer w-4/5" />
            <div className="h-2 rounded shimmer w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
