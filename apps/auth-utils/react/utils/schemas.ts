import * as z from 'zod'
import type { ZodError } from 'zod'

const EMAIL = z.string().email('E-mail inválido!').min(1, 'Insira um e-mail!')

const ACCESS_KEY = z
  .string()
  .length(6, 'A chave de acesso deve conter 6 números!')
  .refine(
    (n) => !Number.isNaN(Number(n)),
    'A chave de acesso consiste apenas em números!'
  )

const PASSWORD = z
  .string()
  .min(1, 'Insira sua senha!')
  .min(8, 'A senha deve ter ao menos 8 caracteres!')
  .refine((n) => !!n.match(/\d/g), 'A senha deve conter 1 número')
  .refine(
    (n) => !!n.match(/(?=.*[a-z])/g),
    'A senha deve conter 1 letra minúscula'
  )
  .refine(
    (n) => !!n.match(/(?=.*[A-Z])/g),
    'A senha deve conter 1 letra maiúscula'
  )

export const ACCESS_KEY_FORM_EMAIL_STEP = z
  .object({
    email: EMAIL,
  })
  .nonstrict()

export const ACCESS_KEY_FORM_KEY_STEP = z
  .object({
    email: EMAIL,
    accessKey: ACCESS_KEY,
  })
  .nonstrict()

export const PASSWORD_FORM = z
  .object({
    email: EMAIL,
    password: PASSWORD,
  })
  .nonstrict()

export const FORGOT_PASSWORD_FORM = z
  .object({
    email: EMAIL,
    accessKey: ACCESS_KEY,
    forgotPassword: PASSWORD,
    confirmForgotPassword: z.string().min(1, 'Insira a confirmação da senha!'),
  })
  .refine((data) => data.forgotPassword === data.confirmForgotPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não batem!',
  })
  .nonstrict()

export const parseError = (error: ZodError) => {
  // console.error({ zod: error })

  return error.errors.reduce((acc, issue) => {
    const name = String(issue.path[0])

    if (typeof acc[name] === 'boolean') {
      return acc
    }

    if (issue.message === 'Required') {
      return { ...acc, [name]: true }
    }

    const curr = acc[name]

    return {
      ...acc,
      [name]: Array.isArray(curr) ? [...curr, issue.message] : [issue.message],
    }
  }, {} as Record<string, string[] | boolean>)
}
