import { SkeletonBlock, SkeletonText, SkeletonCircle } from './Skeleton.jsx'

export default function WarehouseCardSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <SkeletonCircle size="h-8 w-8" />
          <SkeletonText width="w-32" />
        </div>
        <SkeletonText width="w-14" className="h-5 rounded-full" />
      </div>

      <SkeletonText width="w-24" className="mt-4" />
      <SkeletonText width="w-28" className="mt-2" />

      <div className="flex items-center justify-between mt-4 mb-1.5">
        <SkeletonText width="w-28" />
        <SkeletonText width="w-10" />
      </div>
      <SkeletonBlock className="h-1.5 w-full" />

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-line">
        <div className="flex flex-col items-center gap-1.5">
          <SkeletonText width="w-8" />
          <SkeletonText width="w-16" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <SkeletonText width="w-8" />
          <SkeletonText width="w-16" />
        </div>
      </div>
    </div>
  )
}