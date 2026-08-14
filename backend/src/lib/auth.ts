import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from './env.js'

interface TokenPayload {
  sub: string
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(userId: string) {
  return jwt.sign({ sub: userId } satisfies TokenPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

/** Retorna o id do usuário contido no token, ou `null` se o token for inválido/expirado. */
export function getUserIdFromToken(authorization?: string | null): string | null {
  if (!authorization) return null

  const [scheme, token] = authorization.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload
    return payload.sub ?? null
  } catch {
    return null
  }
}
