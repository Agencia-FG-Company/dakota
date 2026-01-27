import React, { useMemo } from 'react'
import {useCssHandles} from "vtex.css-handles"

import { useLogin } from './hooks/login'

const CSS_HANDLES = ['errorWrapper', 'errorList', 'errorListItem'] as const

interface LoginErrorListProps {
  forceShow?: boolean
}

const LoginErrorList: React.FC<LoginErrorListProps> = ({ forceShow }) => {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
  const { errors } = useLogin()

  const parsedErrors = useMemo<Array<[string, string[]]>>(
    () =>
      Object.entries(errors).filter(([, errorValue]) =>
        Array.isArray(errorValue)
      ),
    [errors]
  )

  if (!parsedErrors.length && !forceShow) {
    return null
  }

  return (
    <div
      className={withModifiers('errorWrapper', {
        hidden: !parsedErrors.length && forceShow,
      })}
    >
      <ul className={handles.errorList}>
        {parsedErrors.map(([name, errorValues]) => (
          <>
            {errorValues.map((errorValue) => (
              <li key={name} className={handles.errorListItem}>
                {errorValue}
              </li>
            ))}
          </>
        ))}
      </ul>
    </div>
  )
}

export default LoginErrorList
