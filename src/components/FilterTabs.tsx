'use client'

import type { WatchStatus } from '@/types/tvmaze'

type Filter = WatchStatus | 'all'

const TABS: { label: string; value: Filter }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'WATCHING', value: 'watching' },
  { label: 'WAITING', value: 'waiting' },
  { label: 'DROPPED', value: 'dropped' },
]

interface FilterTabsProps {
  currentFilter: Filter
  onFilter: (filter: Filter) => void
}

export default function FilterTabs({ currentFilter, onFilter }: FilterTabsProps) {
  return (
    <div className="flex gap-1 mb-2.5" role="tablist">
      {TABS.map(({ label, value }) => {
        const isActive = currentFilter === value
        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilter(value)}
            className={`font-vt323 text-lg px-3 py-1 rounded border tracking-wide transition-colors cursor-pointer ${
              isActive
                ? 'border-crt-green text-crt-green bg-crt-green/10'
                : 'border-crt-green/30 text-crt-green/60 hover:border-crt-green/60'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
