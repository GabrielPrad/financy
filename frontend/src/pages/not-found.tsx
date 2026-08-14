import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />

      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass className="size-6" />
      </span>

      <div>
        <p className="text-sm font-semibold text-brand-600">Erro 404</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">Página não encontrada</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-500">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
      </div>

      <Button asChild>
        <Link to="/">Voltar para o início</Link>
      </Button>
    </div>
  )
}
