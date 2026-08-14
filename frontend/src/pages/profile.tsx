import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, LogOut, Mail, User as UserIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { UserAvatar } from '@/components/layout/user-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { UPDATE_PROFILE_MUTATION } from '@/graphql/operations'
import type { User } from '@/graphql/types'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage } from '@/lib/errors'
import { formatLongDate } from '@/lib/format'
import {
  passwordSchema,
  profileSchema,
  type PasswordValues,
  type ProfileValues,
} from '@/lib/validation'

export function ProfilePage() {
  const { user, setUser, signOut } = useAuth()
  const [updateProfile] = useMutation<{ updateProfile: User }>(UPDATE_PROFILE_MUTATION)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    },
  })

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  if (!user) return null

  async function onSubmitProfile(values: ProfileValues) {
    try {
      const { data } = await updateProfile({
        variables: {
          input: { name: values.name, email: values.email, avatarUrl: values.avatarUrl || null },
        },
      })

      if (data?.updateProfile) setUser(data.updateProfile)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function onSubmitPassword(values: PasswordValues) {
    try {
      await updateProfile({
        variables: {
          input: { currentPassword: values.currentPassword, newPassword: values.newPassword },
        },
      })

      passwordForm.reset()
      toast.success('Senha alterada com sucesso!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <PageHeader title="Perfil" description="Gerencie os dados da sua conta no Financy." />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <UserAvatar user={user} className="size-20 text-lg" />
            <p className="mt-4 font-semibold text-ink-900">{user.name}</p>
            <p className="text-sm text-ink-500">{user.email}</p>

            <p className="mt-4 rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-500">
              Conta criada em {formatLongDate(user.createdAt)}
            </p>

            <Button variant="secondary" block className="mt-6" onClick={signOut}>
              <LogOut />
              Sair da conta
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-ink-100">
              <div>
                <CardTitle>Dados pessoais</CardTitle>
                <p className="mt-0.5 text-sm text-ink-500">Atualize o seu nome, e-mail e avatar.</p>
              </div>
            </CardHeader>

            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} noValidate>
              <CardContent className="flex flex-col gap-4 pt-5">
                <Field label="Nome" htmlFor="profile-name" error={profileForm.formState.errors.name?.message}>
                  <Input
                    id="profile-name"
                    icon={<UserIcon />}
                    hasError={Boolean(profileForm.formState.errors.name)}
                    {...profileForm.register('name')}
                  />
                </Field>

                <Field label="E-mail" htmlFor="profile-email" error={profileForm.formState.errors.email?.message}>
                  <Input
                    id="profile-email"
                    type="email"
                    icon={<Mail />}
                    hasError={Boolean(profileForm.formState.errors.email)}
                    {...profileForm.register('email')}
                  />
                </Field>

                <Field
                  label="URL do avatar"
                  htmlFor="profile-avatar"
                  error={profileForm.formState.errors.avatarUrl?.message}
                  hint="Opcional — cole o link de uma imagem para usar como foto de perfil."
                >
                  <Input
                    id="profile-avatar"
                    placeholder="https://..."
                    hasError={Boolean(profileForm.formState.errors.avatarUrl)}
                    {...profileForm.register('avatarUrl')}
                  />
                </Field>

                <div className="flex justify-end">
                  <Button type="submit" isLoading={profileForm.formState.isSubmitting}>
                    Salvar alterações
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>

          <Card>
            <CardHeader className="border-b border-ink-100">
              <div>
                <CardTitle>Alterar senha</CardTitle>
                <p className="mt-0.5 text-sm text-ink-500">
                  Informe a senha atual para definir uma nova.
                </p>
              </div>
            </CardHeader>

            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} noValidate>
              <CardContent className="flex flex-col gap-4 pt-5">
                <Field
                  label="Senha atual"
                  htmlFor="current-password"
                  error={passwordForm.formState.errors.currentPassword?.message}
                >
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    icon={<KeyRound />}
                    hasError={Boolean(passwordForm.formState.errors.currentPassword)}
                    {...passwordForm.register('currentPassword')}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Nova senha"
                    htmlFor="new-password"
                    error={passwordForm.formState.errors.newPassword?.message}
                  >
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      hasError={Boolean(passwordForm.formState.errors.newPassword)}
                      {...passwordForm.register('newPassword')}
                    />
                  </Field>

                  <Field
                    label="Confirmar nova senha"
                    htmlFor="confirm-password"
                    error={passwordForm.formState.errors.confirmPassword?.message}
                  >
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      hasError={Boolean(passwordForm.formState.errors.confirmPassword)}
                      {...passwordForm.register('confirmPassword')}
                    />
                  </Field>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" isLoading={passwordForm.formState.isSubmitting}>
                    Alterar senha
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
