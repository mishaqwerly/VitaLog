import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { AppError } from './errors.js'
import type { AppConfig } from './config.js'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

type TokenPayload = jwt.JwtPayload & { sub: string }

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

export function signAuthToken(userId: string, config: AppConfig): string {
  return jwt.sign({}, config.jwtSecret, {
    subject: userId,
    expiresIn: config.jwtExpiresIn as NonNullable<SignOptions['expiresIn']>,
  })
}

export function setAuthCookie(response: Response, token: string, config: AppConfig): void {
  response.cookie(config.authCookieName, token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1_000,
  })
}

export function clearAuthCookie(response: Response, config: AppConfig): void {
  response.clearCookie(config.authCookieName, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export function createRequireAuth(config: AppConfig) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const token = request.cookies?.[config.authCookieName] as string | undefined
    if (!token) {
      next(new AppError(401, 'Authentication required', 'UNAUTHORIZED'))
      return
    }

    try {
      const payload = jwt.verify(token, config.jwtSecret) as TokenPayload
      if (!payload.sub) throw new Error('Token subject is missing')
      request.userId = payload.sub
      next()
    } catch {
      next(new AppError(401, 'Invalid or expired session', 'UNAUTHORIZED'))
    }
  }
}
