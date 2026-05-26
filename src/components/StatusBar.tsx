'use client'

import { useShowStore } from '@/store/showStore'

export default function StatusBar() {
  const statusMessage = useShowStore((s) => s.statusMessage)
  const shows = useShowStore((s) => s.shows)

  const watching = shows.filter((s) => s.myStatus === 'watching').length
  const waiting = shows.filter((s) => s.myStatus === 'waiting').length
  const dropped = shows.filter((s) => s.myStatus === 'dropped').length

  return (
    <div className="mt-2.5 pt-2 border-t border-crt-green/45 flex justify-between items-center">
      <div className="font-vt323 text-base text-crt-green/50 tracking-wide">
        {statusMessage}
        <span className="blink">_</span>
      </div>
      <div className="flex gap-3 font-vt323 text-base">
        <span className="text-crt-green/50">
          W:<span className="text-crt-green">{watching}</span>
        </span>
        <span className="text-crt-amber/50">
          &#9670;:<span className="text-crt-amber">{waiting}</span>
        </span>
        <span className="text-crt-red/40">
          X:<span className="text-crt-red">{dropped}</span>
        </span>
      </div>
    </div>
  )
}
