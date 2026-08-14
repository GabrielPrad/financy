import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-14 text-center', className)}>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 [&_svg]:size-5.5">
        {icon}
      </span>

      <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
