'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useShowStore } from '@/store/showStore'
import { fetchShowWithNext } from '@/lib/tvmaze'
import { formatAirDate, padEpisode, daysUntil, timeAgo } from '@/lib/format'
import {
  buildEventTitle,
  googleCalendarUrl,
  outlookCalendarUrl,
  generateIcs,
  downloadIcs,
  mailtoReminderUrl,
} from '@/lib/calendar'
import type { TrackedShow, WatchStatus } from '@/types/tvmaze'
import type { FormattedDate } from '@/lib/format'

const PILL_STYLES: Record<WatchStatus, string> = {
  watching: 'border-crt-green text-crt-green',
  waiting: 'border-crt-amber text-crt-amber',
  dropped: 'border-crt-red text-crt-red',
}

const STATUS_LABELS: Record<WatchStatus, string> = {
  watching: 'WATCHING',
  waiting: 'WAITING',
  dropped: 'DROPPED',
}

function AirDateLine({
  show,
  airInfo,
  epLabel,
}: {
  show: TrackedShow
  airInfo: FormattedDate | null
  epLabel: string
}) {
  if (airInfo) {
    return (
      <p className={`font-vt323 text-sm mt-0.5 ${airInfo.variant === 'airing' ? 'text-crt-blue' : 'text-crt-amber'}`}>
        {airInfo.text}{epLabel}
      </p>
    )
  }
  if (show.status === 'Ended') return <p className="font-vt323 text-sm mt-0.5 text-crt-red">SERIES ENDED</p>
  if (show.status === 'In Development') return <p className="font-vt323 text-sm mt-0.5 text-crt-amber">IN DEVELOPMENT</p>
  return <p className="font-vt323 text-sm mt-0.5 text-crt-green/35">DATE TBD</p>
}

const OPTION_CLS =
  'font-vt323 text-sm border border-crt-green/40 text-crt-green/70 px-2 py-0.5 rounded hover:border-crt-green hover:text-crt-green transition-colors bg-transparent cursor-pointer'

type OpenPanel = 'notes' | 'reminder' | null

interface ShowCardProps {
  show: TrackedShow
}

export default function ShowCard({ show }: ShowCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)

  const cycleStatus = useShowStore((s) => s.cycleStatus)
  const removeShow = useShowStore((s) => s.removeShow)
  const updateShow = useShowStore((s) => s.updateShow)
  const setStatus = useShowStore((s) => s.setStatus)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setStatus('REFRESHING...')
    try {
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
      setStatus('REFRESHED: ' + show.name.toUpperCase())
    } catch {
      setStatus('SIGNAL ERROR')
    } finally {
      setIsRefreshing(false)
    }
  }

  const togglePanel = (panel: NonNullable<OpenPanel>) =>
    setOpenPanel((prev) => (prev === panel ? null : panel))

  const airInfo = formatAirDate(show.nextEpDate)
  const epLabel =
    show.nextEpSeason && show.nextEpNum
      ? ` S${padEpisode(show.nextEpSeason)}E${padEpisode(show.nextEpNum)}`
      : ''

  const metaParts: string[] = [
    show.network,
    show.seasons ? `${show.seasons} SEASONS` : null,
    show.premiered?.slice(0, 4) ?? null,
    show.lastRefreshed ? `↺ ${timeAgo(show.lastRefreshed)}` : null,
  ].filter((x): x is string => Boolean(x))

  const hasFutureDate = !!show.nextEpDate && daysUntil(show.nextEpDate) >= 0

  const eventTitle = hasFutureDate
    ? buildEventTitle(show.name, show.nextEpSeason, show.nextEpNum)
    : ''
  const eventDesc = hasFutureDate
    ? `New episode of ${show.name}${epLabel} airs on ${show.nextEpDate}.`
    : ''

  const handleAppleCalendar = () => {
    downloadIcs(
      `${show.name.toLowerCase().replace(/\s+/g, '-')}-reminder.ics`,
      generateIcs(eventTitle, show.nextEpDate!, eventDesc)
    )
    setOpenPanel(null)
  }

  const handleRating = (star: number) => {
    updateShow(show.id, { rating: show.rating === star ? null : star })
  }

  return (
    <div
      role="listitem"
      className="border border-crt-green/20 rounded bg-crt-green/[0.02] hover:border-crt-green/45 transition-colors"
    >
      {/* Main row */}
      <div className="flex items-start gap-2.5 px-2.5 py-2">
        {/* Poster */}
        {show.image ? (
          <Image
            src={show.image}
            alt={`${show.name} poster`}
            width={38}
            height={52}
            className="rounded shrink-0 border border-crt-green/20 object-cover"
            style={{ filter: 'sepia(1) hue-rotate(80deg) saturate(0.7) brightness(0.85)' }}
            loading="lazy"
          />
        ) : (
          <div className="w-[38px] h-[52px] bg-[#0d1a0d] border border-crt-green/20 rounded shrink-0 flex items-center justify-center text-crt-green/25 text-xl">
            &#9641;
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-vt323 text-xl text-crt-green leading-tight truncate">
            {show.name.toUpperCase()}
          </p>
          {metaParts.length > 0 && (
            <p className="font-vt323 text-sm text-crt-green/50 mt-0.5">
              {metaParts.join(' · ')}
            </p>
          )}
          <AirDateLine show={show} airInfo={airInfo} epLabel={epLabel} />

          {/* Rating stars */}
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                className={`bg-transparent border-none cursor-pointer font-vt323 text-base px-0.5 transition-colors leading-none ${
                  (show.rating ?? 0) >= star
                    ? 'text-crt-amber'
                    : 'text-crt-green/20 hover:text-crt-amber/60'
                }`}
              >
                &#9733;
              </button>
            ))}
          </div>
        </div>

        {/* Status pill */}
        <span
          className={`font-vt323 text-xs px-1.5 py-0.5 border rounded tracking-widest shrink-0 self-start mt-0.5 ${PILL_STYLES[show.myStatus]}`}
        >
          {STATUS_LABELS[show.myStatus]}
        </span>

        {/* Actions */}
        <div className="flex gap-1 items-center shrink-0 self-center">
          <button
            title="Cycle status"
            aria-label={`Cycle status for ${show.name}`}
            onClick={() => cycleStatus(show.id)}
            className="bg-transparent border-none cursor-pointer text-crt-amber/40 font-vt323 text-lg px-1 hover:text-crt-amber transition-colors"
          >
            &#8635;
          </button>
          <button
            title="Refresh data"
            aria-label={`Refresh ${show.name}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-transparent border-none cursor-pointer text-crt-blue/50 font-vt323 text-lg px-1 hover:text-crt-blue transition-colors disabled:opacity-30"
          >
            &#8627;
          </button>
          <button
            title="Notes"
            aria-label={`Notes for ${show.name}`}
            onClick={() => togglePanel('notes')}
            className={`bg-transparent border-none cursor-pointer font-vt323 text-base px-1 transition-colors ${
              openPanel === 'notes' ? 'text-crt-amber' : 'text-crt-green/40 hover:text-crt-green'
            }`}
          >
            &#9830;
          </button>
          {hasFutureDate && (
            <button
              title="Set reminder"
              aria-label={`Set reminder for ${show.name}`}
              onClick={() => togglePanel('reminder')}
              className={`bg-transparent border-none cursor-pointer font-vt323 text-lg px-1 transition-colors ${
                openPanel === 'reminder' ? 'text-crt-green' : 'text-crt-green/40 hover:text-crt-green'
              }`}
            >
              &#9651;
            </button>
          )}
          <button
            title="Remove"
            aria-label={`Remove ${show.name}`}
            onClick={() => removeShow(show.id)}
            className="bg-transparent border-none cursor-pointer text-crt-green/40 font-vt323 text-lg px-1 hover:text-crt-red transition-colors"
          >
            &#10005;
          </button>
        </div>
      </div>

      {/* Notes panel */}
      {openPanel === 'notes' && (
        <div className="px-2.5 pb-2.5 pt-1 border-t border-crt-green/20">
          <textarea
            value={show.notes ?? ''}
            onChange={(e) => updateShow(show.id, { notes: e.target.value })}
            placeholder="ADD NOTES..."
            rows={2}
            className="w-full bg-[#050f05] border border-crt-green/30 text-crt-green font-vt323 text-sm px-2 py-1 rounded resize-none focus:outline-none focus:border-crt-green/60 placeholder:text-crt-green/25 tracking-wide"
          />
        </div>
      )}

      {/* Reminder options */}
      {openPanel === 'reminder' && hasFutureDate && (
        <div className="flex flex-wrap items-center gap-1.5 px-2.5 pb-2 pt-1 border-t border-crt-green/20">
          <span className="font-vt323 text-xs text-crt-green/50 tracking-widest mr-1">
            REMIND ME:
          </span>
          <a
            href={googleCalendarUrl(eventTitle, show.nextEpDate!, eventDesc)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpenPanel(null)}
            className={OPTION_CLS}
          >
            GOOGLE
          </a>
          <button onClick={handleAppleCalendar} className={OPTION_CLS}>
            APPLE
          </button>
          <a
            href={outlookCalendarUrl(eventTitle, show.nextEpDate!, eventDesc)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpenPanel(null)}
            className={OPTION_CLS}
          >
            OUTLOOK
          </a>
          <a
            href={mailtoReminderUrl(show.name, show.nextEpDate!, epLabel.trim())}
            onClick={() => setOpenPanel(null)}
            className={OPTION_CLS}
          >
            EMAIL
          </a>
          <button
            onClick={() => setOpenPanel(null)}
            className="font-vt323 text-sm text-crt-red/50 hover:text-crt-red px-1 bg-transparent border-none cursor-pointer transition-colors"
          >
            CANCEL
          </button>
        </div>
      )}
    </div>
  )
}
