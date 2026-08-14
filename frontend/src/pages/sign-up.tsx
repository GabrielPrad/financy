import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage } from '@/lib/errors'
import { signUpSchema, type SignUpValues } from '@/lib/validation'

export function SignUpPage() {
  const { signUp, isAuthenticated } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  if (isAuthenticated) return <Navigate to="/" replace />

  async function onSubmit(values: SignUpValues) {
    setFormError(null)

    try {
      await signUp({ name: values.name, email: values.email, password: values.password })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      title="Criar sua conta"
      subtitle="Leva menos de um minuto e já começa com categorias prontas."
      footer={
        <>
          Já tem uma conta?{' '}
          <Link to="/" className="font-medium text-brand-600 hover:underline">
            Entrar
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

        <Field label="Nome" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            placeholder="Como podemos te chamar?"
            autoComplete="name"
            icon={<User />}
            hasError={Boolean(errors.name)}
            {...register('name')}
          />
        </Field>

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

        <Field
          label="Senha"
          htmlFor="password"
          error={errors.password?.message}
          hint="Mínimo de 6 caracteres."
        >
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Crie uma senha"
              autoComplete="new-password"
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

        <Field label="Confirmar senha" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repita a senha"
            autoComplete="new-password"
            icon={<Lock />}
            hasError={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </Field>

        <Button type="submit" size="lg" block isLoading={isSubmitting} className="mt-2">
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  )
}
