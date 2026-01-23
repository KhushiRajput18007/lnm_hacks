import { cn } from "@/lib/utils/cn";

export function SkeletonCard() {
    return (
        <div className="bg-zinc-900 rounded-[16px] p-4 border border-zinc-800 shadow-xl mb-4 animate-pulse">
            <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between mb-4">
                <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
                <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full mb-4"></div>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="h-10 bg-zinc-800 rounded-xl"></div>
                <div className="h-10 bg-zinc-800 rounded-xl"></div>
            </div>
            <div className="h-3 bg-zinc-800 rounded w-1/3 mx-auto"></div>
        </div>
    )
}
