import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-all duration-150 disabled:pointer-events-none disabled:opacity-55 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800',
        secondary: 'bg-white text-ink-800 border border-ink-200 shadow-sm hover:bg-ink-50',
        ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
        danger: 'bg-expense text-white shadow-sm hover:brightness-95',
        'danger-soft': 'bg-expense-soft text-expense hover:bg-rose-100',
        link: 'text-brand-600 hover:text-brand-700 hover:underline underline-offset-4',
      },
      size: {
        sm: 'h-9 px-3 text-sm [&_svg]:size-4',
        md: 'h-11 px-4 text-sm [&_svg]:size-4',
        lg: 'h-12 px-5 text-base [&_svg]:size-5',
        icon: 'size-9 [&_svg]:size-4',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  /** Repassa o estilo para o filho — útil para transformar um <Link> em botao. */
  asChild?: boolean
  children?: ReactNode
}

export function Button({
  className,
  variant,
  size,
  block,
  isLoading = false,
  asChild = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={asChild ? undefined : disabled || isLoading}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {children}
        </>
      )}
    </Component>
  )
}

export { buttonVariants }
