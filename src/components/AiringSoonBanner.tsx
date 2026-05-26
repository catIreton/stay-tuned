'use client'

import { useShowStore } from '@/store/showStore'
import { daysUntil } from '@/lib/format'

export default function AiringSoonBanner() {
  const shows = useShowStore((s) => s.shows)

  const soon = shows.filter((s) => {
    if (!s.nextEpDate) return false
    const diff = daysUntil(s.nextEpDate)
    return diff >= 0 && diff <= 3
  })

  if (!soon.length) return null

  return (
    <div className="bg-crt-blue/10 border border-crt-blue/30 rounded px-2.5 py-1.5 mb-2.5 font-vt323 text-lg text-crt-blue tracking-wide">
      &#9654; AIRING SOON: {soon.map((s) => s.name.toUpperCase()).join(' · ')}
    </div>
  )
}
