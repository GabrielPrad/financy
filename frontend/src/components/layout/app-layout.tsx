import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ArrowLeftRight, LayoutDashboard, LogOut, Menu, Tags, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '@/components/layout/logo'
import { UserAvatar } from '@/components/layout/user-avatar'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transacoes', label: 'Transações', icon: ArrowLeftRight, end: false },
  { to: '/categorias', label: 'Categorias', icon: Tags, end: false },
  { to: '/perfil', label: 'Perfil', icon: User, end: false },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-ink-300 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <item.icon className="size-4.5 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

/** Layout das telas autenticadas: sidebar fixa no desktop, drawer no mobile. */
export function AppLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Fecha o menu mobile ao trocar de rota.
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  if (!user) return null

  return (
    <div className="min-h-dvh lg:flex">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-ink-950 p-5 lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <Link to="/" className="px-1">
          <Logo variant="light" />
        </Link>

        <div className="mt-8 flex-1">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-ink-500 uppercase">
            Menu
          </p>
          <NavItems />
        </div>

        <div className="rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-ink-400">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-xs font-medium text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-3.5" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Topo — mobile */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger aria-label="Abrir menu do usuário" className="rounded-full">
              <UserAvatar user={user} className="size-8" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 w-56 rounded-xl border border-ink-200 bg-white p-1.5 shadow-pop"
              >
                <div className="px-2.5 py-2">
                  <p className="truncate text-sm font-medium text-ink-900">{user.name}</p>
                  <p className="truncate text-xs text-ink-500">{user.email}</p>
                </div>

                <DropdownMenu.Separator className="my-1 h-px bg-ink-100" />

                <DropdownMenu.Item asChild>
                  <Link
                    to="/perfil"
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink-700 outline-none data-[highlighted]:bg-ink-100"
                  >
                    <User className="size-4" />
                    Meu perfil
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={signOut}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-expense outline-none data-[highlighted]:bg-expense-soft"
                >
                  <LogOut className="size-4" />
                  Sair da conta
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-ink-600 transition-colors hover:bg-ink-100"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Drawer — mobile */}
      {isMenuOpen ? (
        <div className="fixed inset-0 top-[57px] z-30 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-ink-950/40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="animate-in-up relative bg-ink-950 p-4">
            <NavItems onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
