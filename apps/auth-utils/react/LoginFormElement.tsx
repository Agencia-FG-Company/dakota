import React, { useCallback } from 'react'
import {useCssHandles} from "vtex.css-handles"

import { useLogin } from './hooks/login'
import type { LoginActions } from './hooks/login/types'

interface LoginFormElementProps {
  action?: LoginActions
  onSubmit?: () => Promise<void>
  onStart?: () => void
  onSuccess?: () => void
  onEnd?: () => void
  onError?: () => void
}

const CSS_HANDLES = ['formElement'] as const

const LoginFormElement: React.FC<LoginFormElementProps> = ({
  action,
  onSubmit,
  onStart,
  onSuccess,
  onEnd,
  onError,
  children,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const { handleAction } = useLogin()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      onStart?.()

      if (action) {
        handleAction(action)
          .then(() => {
            onSuccess?.()
          })
          .catch(() => {
            onError?.()
          })
          .finally(() => {
            onEnd?.()
          })
      } else if (onSubmit) {
        onSubmit()
          .then(() => {
            onSuccess?.()
          })
          .catch(() => {
            onError?.()
          })
          .finally(() => {
            onEnd?.()
          })
      }
    },
    [action, handleAction, onEnd, onError, onStart, onSubmit, onSuccess]
  )

  return (
    <form className={handles.formElement} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export default LoginFormElement
