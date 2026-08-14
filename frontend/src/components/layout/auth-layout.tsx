import { ShieldCheck, TrendingUp, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { Logo } from '@/components/layout/logo'

const highlights = [
  { icon: Wallet, title: 'Tudo em um lugar', text: 'Entradas e saídas organizadas por categoria.' },
  { icon: TrendingUp, title: 'Saldo em tempo real', text: 'Acompanhe o resultado do mês em um olhar.' },
  { icon: ShieldCheck, title: 'So você ve', text: 'Cada conta enxerga apenas os próprios dados.' },
]

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

/** Tela dividida usada no login e no cadastro. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh bg-white lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Painel de marca */}
      <aside className="relative hidden overflow-hidden bg-ink-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute -top-24 -left-24 size-96 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
        <div
          className="absolute -right-24 -bottom-32 size-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22C55E 0%, transparent 70%)' }}
        />

        <Logo variant="light" className="relative" />

        <div className="relative max-w-md">
          <h2 className="text-3xl leading-tight font-semibold text-white">
            Suas finanças com clareza,
            <br />
            do primeiro real ao último.
          </h2>
          <p className="mt-3 text-sm text-ink-400">
            Registre transações, agrupe por categoria e entenda para onde o seu dinheiro está indo.
          </p>

          <ul className="mt-9 flex flex-col gap-5">
            {highlights.map((highlight) => (
              <li key={highlight.title} className="flex gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-300">
                  <highlight.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{highlight.title}</p>
                  <p className="text-sm text-ink-400">{highlight.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-500">
          Financy — desafio prático da Pós-Graduação Rocketseat.
        </p>
      </aside>

      {/* Formulario */}
      <main className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8">
        <div className="animate-in-up w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink-900 lg:mt-0">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer ? <div className="mt-6 text-center text-sm text-ink-500">{footer}</div> : null}
        </div>
      </main>
    </div>
  )
}
