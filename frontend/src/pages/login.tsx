import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage } from '@/lib/errors'
import { signInSchema, type SignInValues } from '@/lib/validation'

/** Tela exibida na rota `/` quando o usuário está deslogado. */
export function LoginPage() {
  const { signIn } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: SignInValues) {
    setFormError(null)

    try {
      await signIn(values)
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      title="Entrar na sua conta"
      subtitle="Acesse o Financy e continue organizando as suas finanças."
      footer={
        <>
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="font-medium text-brand-600 hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {formError ? (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-expense-soft px-3.5 py-2.5 text-sm text-expense"
          >
            {formError}
          </p>
        ) : null}

        <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="voce@email.com"
            autoComplete="email"
            icon={<Mail />}
            hasError={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <Field label="Senha" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              autoComplete="current-password"
              icon={<Lock />}
              className="pr-11"
              hasError={Boolean(errors.password)}
              {...register('password')}
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-600"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        <Button type="submit" size="lg" block isLoading={isSubmitting} className="mt-2">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  )
}
