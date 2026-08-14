import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'Informe o seu e-mail.').email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe a sua senha.'),
})

export const signUpSchema = z
  .object({
    name: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres.').max(80),
    email: z.string().trim().min(1, 'Informe o seu e-mail.').email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirme a sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  })

export const transactionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(2, 'A descrição deve ter no mínimo 2 caracteres.')
    .max(100, 'A descrição deve ter no máximo 100 caracteres.'),
  amount: z
    .number({ invalid_type_error: 'Informe um valor válido.' })
    .positive('O valor deve ser maior que zero.'),
  type: z.enum(['INCOME', 'EXPENSE'], { required_error: 'Selecione o tipo.' }),
  date: z.string().min(1, 'Informe a data.'),
  categoryId: z.string().min(1, 'Selecione uma categoria.'),
})

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.')
    .max(40, 'O nome deve ter no máximo 40 caracteres.'),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Selecione uma cor válida.'),
  icon: z.string().min(1, 'Selecione um ícone.'),
})

export const profileSchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres.').max(80),
  email: z.string().trim().min(1, 'Informe o seu e-mail.').email('Informe um e-mail válido.'),
  avatarUrl: z.string().trim().url('Informe uma URL válida.').or(z.literal('')),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual.'),
    newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  })

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
export type TransactionValues = z.infer<typeof transactionSchema>
export type CategoryValues = z.infer<typeof categorySchema>
export type ProfileValues = z.infer<typeof profileSchema>
export type PasswordValues = z.infer<typeof passwordSchema>
