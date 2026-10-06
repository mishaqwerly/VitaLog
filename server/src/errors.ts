import type { ErrorRequestHandler, RequestHandler } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code = 'REQUEST_ERROR',
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const notFound: RequestHandler = (_request, _response, next) => {
  next(new AppError(404, 'Route not found', 'NOT_FOUND'))
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.status).json({
      error: { code: error.code, message: error.message, ...(error.details === undefined ? {} : { details: error.details }) },
    })
    return
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details: error.flatten() },
    })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    response.status(409).json({ error: { code: 'CONFLICT', message: 'Resource already exists' } })
    return
  }

  console.error(error)
  response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
}
