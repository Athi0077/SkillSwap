import Navbar from "./Navbar";
import Skeleton from "./Skeleton";

export default function DashboardSkeleton() {
  return (
    <>
      <Navbar />
      <div className="flex dark-bento-page min-h-screen">
        <main className="flex-1 p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Header Box */}
              <div className="glow-card-wrapper bg-[#120F17]/80 p-8 flex items-center justify-between">
                <div className="space-y-4">
                  <Skeleton className="w-64 h-8" />
                  <Skeleton className="w-48 h-4" />
                </div>
                <Skeleton rounded="rounded-full" className="w-20 h-20" />
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glow-card-wrapper bg-[#120F17]/80 p-5 space-y-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-16 h-8" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                ))}
              </div>

              {/* Activity Chart Box */}
              <div className="glow-card-wrapper bg-[#120F17]/80 p-6 h-80 flex flex-col justify-end gap-2">
                <Skeleton className="w-full h-full" />
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="glow-card-wrapper bg-[#120F17]/80 p-6 space-y-5">
                <Skeleton className="w-48 h-6 mb-4" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton rounded="rounded-full" className="w-12 h-12" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="w-3/4 h-4" />
                      <Skeleton className="w-1/2 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
