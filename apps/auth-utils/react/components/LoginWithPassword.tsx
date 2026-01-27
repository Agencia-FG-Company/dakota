import React, { useState } from 'react'

import {useCssHandles} from "vtex.css-handles"

import LoginButton from '../LoginButton'
import LoginFormElement from '../LoginFormElement'
import LoginInput from '../LoginInput'
import LoginErrorList from '../LoginErrorList'
import { useLogin } from '../hooks/login'

interface LoginWithAccessKeyProps {
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  accessKeyLabel?: string
  accessKeyPlaceholder?: string
  buttonText?: string
  accessKeyButtonText?: string
  forgotPasswordText?: string
  forgotPasswordButtonText?: string
}

const CSS_HANDLES = ['forgotPassword'] as const

const LoginWithAccessKey: React.FC<LoginWithAccessKeyProps> = ({
  emailLabel = 'E-mail',
  emailPlaceholder = 'exemplo@exemplo.com',
  passwordLabel = 'Senha',
  passwordPlaceholder = 'Senha',
  buttonText = 'Entrar',
  accessKeyButtonText = 'Confirmar',
  accessKeyLabel = 'Código de acesso',
  accessKeyPlaceholder = 'Ex: 123123',
  forgotPasswordButtonText = 'Enviar',
  forgotPasswordText = 'Esqueci minha senha',
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const [step, setStep] = useState<'default' | 'email' | 'forgot'>('default')
  const [loading, setIsLoading] = useState(false)
  const { clearErrors } = useLogin()

  const DICT = {
    default: (
      <LoginFormElement
        action="passwordLogin"
        onStart={() => setIsLoading(true)}
        onError={() => setIsLoading(false)}
      >
        <LoginInput
          name="email"
          type="email"
          blockClass="email"
          label={emailLabel}
          placeholder={emailPlaceholder}
        />
        <LoginInput
          name="password"
          type="password"
          blockClass="password"
          label={passwordLabel}
          placeholder={passwordPlaceholder}
        />
        <LoginButton text={buttonText} type="submit" loading={loading} />
        <button
          type="button"
          className={handles.forgotPassword}
          onClick={() => {
            setStep('email')
            clearErrors()
          }}
        >
          {forgotPasswordText}
        </button>
      </LoginFormElement>
    ),
    email: (
      <LoginFormElement
        action="sendKey"
        onStart={() => setIsLoading(true)}
        onSuccess={() => setStep('forgot')}
        onEnd={() => setIsLoading(false)}
      >
        <LoginInput
          name="email"
          type="email"
          blockClass="email"
          label={emailLabel}
          placeholder={emailPlaceholder}
        />
        <LoginButton
          text={accessKeyButtonText}
          type="submit"
          loading={loading}
        />
      </LoginFormElement>
    ),
    forgot: (
      <LoginFormElement
        action="forgotPassword"
        onStart={() => setIsLoading(true)}
        onError={() => setIsLoading(false)}
      >
        <LoginInput
          name="accessKey"
          blockClass="accessKey"
          label={accessKeyLabel}
          placeholder={accessKeyPlaceholder}
        />
        <LoginInput
          name="forgotPassword"
          blockClass="forgotPassword"
          type="password"
          label={passwordLabel}
          placeholder={passwordPlaceholder}
        />
        <LoginInput
          name="confirmForgotPassword"
          blockClass="confirmForgotPassword"
          type="password"
          label="Confirme sua senha"
          placeholder="Confirme sua senha"
        />
        <LoginButton
          text={forgotPasswordButtonText}
          type="submit"
          loading={loading}
        />
      </LoginFormElement>
    ),
  }

  return (
    <>
      {DICT[step]}
      <LoginErrorList />
    </>
  )
}

export default LoginWithAccessKey
