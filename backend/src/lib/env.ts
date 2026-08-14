import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório (veja o .env.example)'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório (veja o .env.example)'),
  PORT: z.coerce.number().int().positive().default(4000),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
  console.error(`\nVariaveis de ambiente inválidas:\n${issues.join('\n')}\n`)
  process.exit(1)
}

export const env = parsed.data

/** Lista de origens liberadas no CORS. `*` libera qualquer origem. */
export const corsOrigins =
  env.CORS_ORIGIN === '*'
    ? '*'
    : env.CORS_ORIGIN.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
