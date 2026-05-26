'use client'

type NavKey = 'ArrowDown' | 'ArrowUp' | 'Escape' | 'Enter'
const NAV_KEYS = new Set<string>(['ArrowDown', 'ArrowUp', 'Escape', 'Enter'])

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onKeyboardNav: (key: NavKey) => void
  isLoading: boolean
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onKeyboardNav,
  isLoading,
}: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (NAV_KEYS.has(e.key)) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault()
            onKeyboardNav(e.key as NavKey)
          }
        }}
        placeholder="SEARCH FOR A SHOW..."
        autoComplete="off"
        aria-label="Search for a TV show"
        aria-autocomplete="list"
        aria-controls="search-results"
        className="flex-1 bg-[#050f05] border border-crt-green/45 text-crt-green font-vt323 text-xl px-2.5 py-1.5 rounded focus:outline-none focus:border-crt-green focus:shadow-[0_0_6px_rgba(57,255,20,0.45)] placeholder:text-crt-green/30 tracking-wide"
      />
      <button
        onClick={onSubmit}
        aria-label="Search"
        className="bg-transparent border border-crt-green text-crt-green font-vt323 text-lg px-3.5 py-1.5 rounded tracking-wide cursor-pointer hover:bg-crt-green/10 active:bg-crt-green/20 transition-colors whitespace-nowrap"
      >
        {isLoading ? '[ ... ]' : '[ SCAN ]'}
      </button>
    </div>
  )
}
