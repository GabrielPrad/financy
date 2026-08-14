import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
  showWordmark?: boolean
}

export function Logo({ className, variant = 'dark', showWordmark = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-brand-600 shadow-sm">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
          <path d="M11 24V9.8A1.8 1.8 0 0 1 12.8 8H22v3.6h-6.9v4.1H21v3.6h-5.9V24z" fill="#fff" />
        </svg>
        <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-emerald-400" />
      </span>

      {showWordmark ? (
        <span
          className={cn(
            'text-lg font-semibold tracking-tight',
            variant === 'light' ? 'text-white' : 'text-ink-900',
          )}
        >
          Financy
        </span>
      ) : null}
    </span>
  )
}
