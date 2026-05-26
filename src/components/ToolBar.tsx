'use client'

import { useRef } from 'react'
import { useShowStore } from '@/store/showStore'
import { fetchShowWithNext } from '@/lib/tvmaze'
import { exportShowsAsJson, parseImportedShows } from '@/lib/export'
import type { SortBy } from '@/types/tvmaze'

const SORT_CYCLE: SortBy[] = ['added', 'airDate', 'network', 'status']
const SORT_LABELS: Record<SortBy, string> = {
  added: 'ADDED',
  airDate: 'AIR DATE',
  network: 'NETWORK',
  status: 'STATUS',
}

export default function ToolBar() {
  const fileRef = useRef<HTMLInputElement>(null)
  const shows = useShowStore((s) => s.shows)
  const sortBy = useShowStore((s) => s.sortBy)
  const setSortBy = useShowStore((s) => s.setSortBy)
  const addShow = useShowStore((s) => s.addShow)
  const updateShow = useShowStore((s) => s.updateShow)
  const setStatus = useShowStore((s) => s.setStatus)

  const cycleSortBy = () => {
    const next = SORT_CYCLE[(SORT_CYCLE.indexOf(sortBy) + 1) % SORT_CYCLE.length]
    setSortBy(next)
  }

  const handleBulkRefresh = async () => {
    if (!shows.length) return
    setStatus(`REFRESHING ${shows.length} SHOWS...`)
    const results = await Promise.allSettled(
      shows.map(async (show) => {
        const data = await fetchShowWithNext(show.id)
        const nextEp = data._embedded?.nextepisode
        updateShow(show.id, {
          status: data.status,
          nextEpDate: nextEp?.airdate ?? null,
          nextEpName: nextEp?.name ?? null,
          nextEpSeason: nextEp?.season ?? null,
          nextEpNum: nextEp?.number ?? null,
          image: data.image?.medium ?? show.image,
          lastRefreshed: Date.now(),
        })
      })
    )
    const ok = results.filter((r) => r.status === 'fulfilled').length
    setStatus(`REFRESHED ${ok}/${shows.length}`)
  }

  const handleExport = () => {
    exportShowsAsJson(shows)
    setStatus('EXPORTED')
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const imported = parseImportedShows(evt.target?.result as string)
      if (!imported) {
        setStatus('IMPORT FAILED — INVALID FILE')
        return
      }
      const existingIds = new Set(shows.map((s) => s.id))
      const newShows = imported.filter((s) => !existingIds.has(s.id))
      newShows.forEach((s) => addShow(s))
      setStatus(`IMPORTED ${newShows.length} SHOW${newShows.length !== 1 ? 'S' : ''}`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const btn =
    'font-vt323 text-sm border px-2 py-0.5 rounded bg-transparent cursor-pointer transition-colors tracking-wide'

  return (
    <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
      <button
        onClick={cycleSortBy}
        title="Cycle sort order"
        className={`${btn} border-crt-green/30 text-crt-green/60 hover:border-crt-green hover:text-crt-green`}
      >
        &#8597; {SORT_LABELS[sortBy ?? 'added']}
      </button>
      <button
        onClick={handleBulkRefresh}
        title="Refresh all shows"
        className={`${btn} border-crt-blue/30 text-crt-blue/60 hover:border-crt-blue hover:text-crt-blue`}
      >
        &#8627; ALL
      </button>
      <div className="flex-1" />
      <button
        onClick={handleExport}
        title="Export list as JSON"
        className={`${btn} border-crt-green/30 text-crt-green/60 hover:border-crt-green hover:text-crt-green`}
      >
        &#8595; EXPORT
      </button>
      <label
        title="Import JSON"
        className={`${btn} border-crt-green/30 text-crt-green/60 hover:border-crt-green hover:text-crt-green`}
      >
        &#8593; IMPORT
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>
    </div>
  )
}
