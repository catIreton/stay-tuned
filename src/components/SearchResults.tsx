'use client'

import type { TVMazeSearchResult } from '@/types/tvmaze'

interface SearchResultsProps {
  results: TVMazeSearchResult[]
  isLoading: boolean
  activeIndex: number
  onSelect: (id: number) => void
}

export default function SearchResults({
  results,
  isLoading,
  activeIndex,
  onSelect,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="mb-3 px-2.5 py-2.5 font-vt323 text-lg text-crt-green/40 tracking-wide">
        SCANNING...
      </div>
    )
  }

  if (!results.length) {
    return (
      <div className="mb-3 px-2.5 py-2.5 font-vt323 text-lg text-crt-green/40 tracking-wide">
        NO SIGNAL — TRY ANOTHER TITLE
      </div>
    )
  }

  return (
    <div
      id="search-results"
      className="flex flex-col gap-1 mb-3 max-h-44 overflow-y-auto crt-scroll"
      role="listbox"
      aria-label="Search results"
    >
      {results.slice(0, 6).map(({ show }, index) => {
        const year = show.premiered ? show.premiered.slice(0, 4) : '????'
        const network = show.network?.name ?? show.webChannel?.name ?? ''
        const isActive = index === activeIndex
        return (
          <div
            key={show.id}
            role="option"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => onSelect(show.id)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(show.id)}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 border rounded cursor-pointer transition-colors ${
              isActive
                ? 'border-crt-green bg-crt-green/8'
                : 'border-crt-green/15 hover:border-crt-green hover:bg-crt-green/5'
            }`}
          >
            <span className="font-vt323 text-xl text-crt-green flex-1">{show.name}</span>
            <span className="font-vt323 text-base text-crt-green/50">{year}</span>
            {network && <span className="font-vt323 text-base text-crt-amber">{network}</span>}
          </div>
        )
      })}
    </div>
  )
}
