import { createContext, useContext, useState, type ReactNode } from 'react'

export type Currency = 'INR' | 'USD'
const KEY = 'mahindra-currency'

function initial(): Currency {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'INR' || saved === 'USD') return saved
  } catch { /* storage blocked */ }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' ? 'INR' : 'USD'
  } catch {
    return 'INR'
  }
}

const Ctx = createContext<{ cur: Currency; setCur: (c: Currency) => void }>({ cur: 'INR', setCur: () => {} })

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [cur, set] = useState<Currency>(initial)
  const setCur = (c: Currency) => {
    set(c)
    try { localStorage.setItem(KEY, c) } catch { /* fine */ }
  }
  return <Ctx.Provider value={{ cur, setCur }}>{children}</Ctx.Provider>
}

export const useCurrency = () => useContext(Ctx)

export function money(cur: Currency, inr: number | null, usd: number | null) {
  const v = cur === 'INR' ? inr : usd
  if (v == null) return null
  return cur === 'INR' ? `₹${v.toLocaleString('en-IN')}` : `$${v.toLocaleString('en-US')}`
}

export function CurrencyToggle() {
  const { cur, setCur } = useCurrency()
  return (
    <div className="inline-flex rounded-full border border-line p-0.5 text-xs" role="group" aria-label="Currency">
      {(['INR', 'USD'] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCur(c)}
          aria-pressed={cur === c}
          className={`rounded-full px-3 py-1 font-semibold transition-colors ${cur === c ? 'bg-bone text-black' : 'text-mist hover:text-bone'}`}
        >
          {c === 'INR' ? '₹ INR' : '$ USD'}
        </button>
      ))}
    </div>
  )
}
