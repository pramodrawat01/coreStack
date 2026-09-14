import { SkeletonText } from './Skeleton.jsx'

export default function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-4">
      <SkeletonText width="w-20" />
      <SkeletonText width="w-36" className=" mt-1" />
      <SkeletonText width="w-16" className=" mt-1" />
    </div>
  )
}