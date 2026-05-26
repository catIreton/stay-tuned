'use client'

import { useShowStore } from '@/store/showStore'
import ShowCard from './ShowCard'
import type { TrackedShow, WatchStatus, SortBy } from '@/types/tvmaze'

function sortShows(shows: TrackedShow[], sortBy: SortBy): TrackedShow[] {
  switch (sortBy) {
    case 'airDate':
      return [...shows].sort((a, b) => {
        if (!a.nextEpDate && !b.nextEpDate) return 0
        if (!a.nextEpDate) return 1
        if (!b.nextEpDate) return -1
        return a.nextEpDate.localeCompare(b.nextEpDate)
      })
    case 'network':
      return [...shows].sort((a, b) => a.network.localeCompare(b.network))
    case 'status': {
      const order: Record<WatchStatus, number> = { watching: 0, waiting: 1, dropped: 2 }
      return [...shows].sort((a, b) => order[a.myStatus] - order[b.myStatus])
    }
    case 'added':
    default:
      return [...shows].sort((a, b) => b.added - a.added)
  }
}

export default function ShowList() {
  const shows = useShowStore((s) => s.shows)
  const currentFilter = useShowStore((s) => s.currentFilter)
  const sortBy = useShowStore((s) => s.sortBy ?? 'added')

  const filtered =
    currentFilter === 'all' ? shows : shows.filter((s) => s.myStatus === currentFilter)
  const sorted = sortShows(filtered, sortBy)

  if (!sorted.length) {
    return (
      <div className="text-center py-10 text-crt-green/30 font-vt323 text-xl tracking-wide">
        {currentFilter === 'all' ? 'NO SHOWS YET — SEARCH TO ADD ONE' : 'NOTHING IN THIS CATEGORY'}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto crt-scroll" role="list">
      {sorted.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  )
}
