import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { Logo } from '@/components/layout/logo'
import { useAuth } from '@/hooks/use-auth'
import { CategoriesPage } from '@/pages/categories'
import { DashboardPage } from '@/pages/dashboard'
import { LoginPage } from '@/pages/login'
import { NotFoundPage } from '@/pages/not-found'
import { ProfilePage } from '@/pages/profile'
import { SignUpPage } from '@/pages/sign-up'
import { TransactionsPage } from '@/pages/transactions'

function SplashScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <Logo />
      <div className="h-1 w-32 overflow-hidden rounded-full bg-ink-200">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-600" />
      </div>
    </div>
  )
}

/**
 * A rota raiz `/` mostra o login quando deslogado e o dashboard quando logado,
 * exatamente como pede o desafio. As demais rotas só existem autenticado.
 */
export function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <SplashScreen />

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transacoes" element={<TransactionsPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          <Route path="/cadastro" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignUpPage />} />

          {/* Sem sessão, as telas internas voltam para o login */}
          <Route path="/transacoes" element={<Navigate to="/" replace />} />
          <Route path="/categorias" element={<Navigate to="/" replace />} />
          <Route path="/perfil" element={<Navigate to="/" replace />} />
        </>
      )}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
