import { z } from 'zod'

const hexColor = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Informe uma cor em hexadecimal (ex.: #8B5CF6).')

const name = z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres.').max(80)
const email = z.string().trim().toLowerCase().email('Informe um e-mail válido.')
const password = z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').max(72)

export const signUpSchema = z.object({ name, email, password })

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Informe a sua senha.'),
})

export const updateProfileSchema = z
  .object({
    name: name.optional(),
    email: email.optional(),
    avatarUrl: z.string().trim().url('Informe uma URL válida.').or(z.literal('')).nullish(),
    currentPassword: z.string().optional(),
    newPassword: password.optional(),
  })
  .refine((data) => !data.newPassword || Boolean(data.currentPassword), {
    message: 'Informe a senha atual para definir uma nova senha.',
    path: ['currentPassword'],
  })

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'O nome da categoria deve ter no mínimo 2 caracteres.').max(40),
  color: hexColor,
  icon: z.string().trim().max(40).nullish(),
})

export const updateCategorySchema = createCategorySchema.partial().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'Informe ao menos um campo para atualizar.' },
)

const amount = z
  .number({ invalid_type_error: 'Informe um valor válido.' })
  .positive('O valor deve ser maior que zero.')
  .max(99_999_999, 'O valor informado e muito alto.')

export const createTransactionSchema = z.object({
  description: z.string().trim().min(2, 'A descrição deve ter no mínimo 2 caracteres.').max(100),
  amount,
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.date({ invalid_type_error: 'Informe uma data válida.' }),
  categoryId: z.string().min(1, 'Selecione uma categoria.'),
})

export const updateTransactionSchema = createTransactionSchema.partial().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'Informe ao menos um campo para atualizar.' },
)
