import React, { createContext, useCallback, useContext } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import useSWR from 'swr/immutable'

import type {
  LoginActions,
  LoginContextData,
  VtexIDAuthenticationStartData,
} from './types'
import { useForm } from '../useForm'
import {
  ACCESS_KEY_FORM_EMAIL_STEP,
  ACCESS_KEY_FORM_KEY_STEP,
  FORGOT_PASSWORD_FORM,
  PASSWORD_FORM,
  parseError,
} from '../../utils/schemas'

interface LoginFields {
  [key: string]: any
  step: string
  email: string
  accessKey: string
  password: string
  forgotPassword: string
  confirmForgotPassword: string
}

const LoginContext = createContext<LoginContextData<LoginFields>>(
  {} as LoginContextData<LoginFields>
)

export const LoginProvider: React.FC = ({ children }) => {
  const { account } = useRuntime()
  const formHelpers = useForm<LoginFields>()

  const { data: loginData, setFieldErrors } = formHelpers

  const { data: startData, isValidating: isStartLoading } =
    useSWR<VtexIDAuthenticationStartData>(
      '/api/vtexid/pub/authentication/start',
      async (url) => {
        const formdata = new FormData()

        formdata.append('scope', account)

        const res = await fetch(url, { method: 'post', body: formdata })

        return res.json()
      }
    )

  const handleSendAccessKey = useCallback(async () => {
    if (isStartLoading || !startData || startData.isAuthenticated) {
      return
    }

    ;(document.activeElement as HTMLElement | null)?.blur?.()

    const result = ACCESS_KEY_FORM_EMAIL_STEP.safeParse(loginData)

    if (!result.success) {
      const errors = parseError(result.error)

      Object.entries(errors).forEach(([key, value]) => {
        setFieldErrors(key, value)
      })

      throw new Error('Input error.')
    }

    const { data: parsedData } = result

    const formdata = new FormData()

    formdata.append('email', parsedData.email)
    formdata.append('authenticationToken', startData.authenticationToken)

    const response = await fetch(
      '/api/vtexid/pub/authentication/accesskey/send',
      {
        method: 'post',
        body: formdata,
      }
    )

    if (!response.ok) {
      setFieldErrors('alert', ['Houve um problema ao fazer a requisição!'])
      throw new Error('User not approved.')
    }
  }, [isStartLoading, loginData, setFieldErrors, startData])

  const handleLoginWithAccessKey = useCallback(async () => {
    if (isStartLoading || !startData || startData.isAuthenticated) {
      return
    }

    ;(document.activeElement as HTMLElement | null)?.blur?.()

    const result = ACCESS_KEY_FORM_KEY_STEP.safeParse(loginData)

    if (!result.success) {
      const errors = parseError(result.error)

      Object.entries(errors).forEach(([key, value]) => {
        setFieldErrors(key, value)
      })

      throw new Error('Input error.')
    }

    const { data: parsedData } = result

    const formdata = new FormData()

    formdata.append('email', parsedData.email)
    formdata.append('authenticationToken', startData.authenticationToken)
    formdata.append('accesskey', parsedData.accessKey)

    const res = await fetch(
      '/api/vtexid/pub/authentication/accesskey/validate',
      {
        method: 'post',
        body: formdata,
      }
    )

    if (!res.ok) {
      setFieldErrors('alert', ['Houve um problema ao fazer a requisição!'])
      throw new Error('User not approved.')
    }

    const data = (await res.json()) as {
      authStatus: 'Success' | 'WrongCredentials'
    }

    if (data.authStatus !== 'Success') {
      setFieldErrors('alert', [
        'Chave de acesso inválida ou expirada. Tente novamente.',
      ])
      throw new Error('Something wrong.')
    }

    if (window.location.href.includes('login')) {
      const searchParams = new URLSearchParams(window.location.search)

      window.location.href = searchParams.get('returnUrl') ?? '/'

      return
    }

    window.location.reload()
  }, [isStartLoading, loginData, setFieldErrors, startData])

  const handleLoginWithPassword = useCallback(async () => {
    if (isStartLoading || !startData || startData.isAuthenticated) {
      return
    }

    ;(document.activeElement as HTMLElement | null)?.blur?.()

    const result = PASSWORD_FORM.safeParse(loginData)

    if (!result.success) {
      const errors = parseError(result.error)

      Object.entries(errors).forEach(([key, value]) => {
        setFieldErrors(key, value)
      })

      throw new Error('Input error.')
    }

    const { data: parsedData } = result

    const formdata = new FormData()

    formdata.append('login', parsedData.email)
    formdata.append('password', parsedData.password)
    formdata.append('recaptcha', '')
    formdata.append('fingerprint', '')

    const res = await fetch('/api/vtexid/pub/authentication/classic/validate', {
      method: 'post',
      body: formdata,
    })

    if (!res.ok) {
      setFieldErrors('alert', ['Houve um problema ao fazer a requisição!'])
      throw new Error('User not approved.')
    }

    const data = (await res.json()) as {
      authStatus: 'Success' | 'WrongCredentials'
    }

    if (data.authStatus !== 'Success') {
      setFieldErrors('alert', ['E-mail e/ou senha incorretos!'])
      throw new Error('Something wrong.')
    }

    if (window.location.href.includes('login')) {
      const searchParams = new URLSearchParams(window.location.search)

      window.location.href = searchParams.get('returnUrl') ?? '/'

      return
    }

    window.location.reload()
  }, [isStartLoading, loginData, setFieldErrors, startData])

  const handleForgotPassword = useCallback(async () => {
    if (isStartLoading || !startData || startData.isAuthenticated) {
      return
    }

    ;(document.activeElement as HTMLElement | null)?.blur?.()

    const result = FORGOT_PASSWORD_FORM.safeParse(loginData)

    if (!result.success) {
      const errors = parseError(result.error)

      Object.entries(errors).forEach(([key, value]) => {
        setFieldErrors(key, value)
      })

      throw new Error('Input error.')
    }

    const { data: parsedData } = result

    const formdata = new FormData()

    formdata.append('login', parsedData.email)
    formdata.append('newPassword', parsedData.forgotPassword)

    formdata.append('authenticationToken', startData.authenticationToken)
    formdata.append('accesskey', parsedData.accessKey)
    formdata.append('method', 'POST')

    const res = await fetch(
      '/api/vtexid/pub/authentication/classic/setpassword?expireSessions=true',
      {
        method: 'post',
        body: formdata,
      }
    )

    if (!res.ok) {
      setFieldErrors('alert', ['Houve um problema ao fazer a requisição!'])
      throw new Error('User not approved.')
    }

    const data = (await res.json()) as {
      authStatus: 'Success' | 'WrongCredentials'
    }

    if (data.authStatus !== 'Success') {
      setFieldErrors('alert', [
        'Chave de acesso inválida ou expirada. Tente novamente.',
      ])
      throw new Error('Something wrong.')
    }

    if (window.location.href.includes('login')) {
      const searchParams = new URLSearchParams(window.location.search)

      window.location.href = searchParams.get('returnUrl') ?? '/'

      return
    }

    window.location.reload()
  }, [isStartLoading, loginData, setFieldErrors, startData])

  const handleAction = useCallback(
    (action: LoginActions) => {
      const dict = {
        sendKey: handleSendAccessKey,
        validateKey: handleLoginWithAccessKey,
        passwordLogin: handleLoginWithPassword,
        forgotPassword: handleForgotPassword,
      }

      return dict[action]?.()
    },
    [
      handleForgotPassword,
      handleLoginWithAccessKey,
      handleLoginWithPassword,
      handleSendAccessKey,
    ]
  )

  return (
    <LoginContext.Provider
      value={{
        handleAction,
        handleSendAccessKey,
        handleLoginWithAccessKey,
        handleLoginWithPassword,
        handleForgotPassword,
        ...formHelpers,
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export function useLogin<T = Record<string, any>>(): LoginContextData<
  T & Partial<LoginFields>
> {
  const context = useContext(LoginContext)

  return context as LoginContextData<T & LoginFields>
}
