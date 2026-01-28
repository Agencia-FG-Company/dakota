import React from 'react'
import {useCssHandles} from "vtex.css-handles"

import LoginWithAccessKey from './components/LoginWithAccessKey'
import LoginWithPassword from './components/LoginWithPassword'

const CSS_HANDLES = ['formContainer'] as const

const FORMS = {
  'access-key': LoginWithAccessKey,
  password: LoginWithPassword,
}

export type LoginOption = keyof typeof FORMS

interface LoginFormProps {
  option: LoginOption
  data?: Record<string, any>
}

const LoginForm: React.FC<LoginFormProps> = ({ option, data }) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const Component = FORMS[option] as React.ComponentType<any>

  const props = data ?? {}

  if (!Component) {
    return null
  }

  return (
    <div className={handles.formContainer}>
      <Component {...props} />
    </div>
  )
}

export default LoginForm
