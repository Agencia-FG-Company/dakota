import React, { useCallback } from 'react'
import {useCssHandles} from "vtex.css-handles"

import { useLogin } from './hooks/login'
import type { LoginActions } from './hooks/login/types'

// import { Container } from './styles';

interface LoginButtonProps {
  type?: 'button' | 'submit'
  text: string
  action?: LoginActions
  loading?: boolean
}

const CSS_HANDLES = ['buttonElement'] as const

const LoginButton: React.FC<LoginButtonProps> = ({
  text,
  action,
  type = 'button',
  loading,
}) => {
  const { withModifiers } = useCssHandles(CSS_HANDLES)

  const { handleAction } = useLogin()

  const handleClick = useCallback(() => {
    action && handleAction(action)
  }, [action, handleAction])

  return (
    <button
      className={withModifiers('buttonElement', { loading })}
      type={type}
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? 'Carregando...' : text}
    </button>
  )
}

export default LoginButton
