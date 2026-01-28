//@ts-ignore
import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import LoginButton from '../LoginButton'
import LoginErrorList from '../LoginErrorList'
import LoginFormElement from '../LoginFormElement'
import LoginInput from '../LoginInput'
import LoginWithAccesKeyTimer from './LoginWithAccesKeyTimer'

// import { Container } from './styles';

const CSS_HANDLES = ['loginWithAccessKeyContainer',"loginWithAccessKeyButton","loginWithAccessKeyText","loginWithAccessKeyBackButton"] as const
interface LoginWithAccessKeyProps {
  emailLabel?: string
  emailPlaceholder?: string
  emailButtonText?: string
  accessKeyLabel?: string
  accessKeyPlaceholder?: string
  accessKeyButtonText?: string
}

const LoginWithAccessKey: React.FC<LoginWithAccessKeyProps> = ({
  emailPlaceholder = 'exemplo@exemplo.com',
  emailButtonText = 'Confirmar',
  accessKeyLabel = 'Código de acesso',
  accessKeyPlaceholder = 'Ex: 123123',
  accessKeyButtonText = 'Entrar',
}) => {
  const [step, setStep] = useState<'email' | 'accessKey'>('email')
  const [loading, setIsLoading] = useState(false)
  const [showInput,setShowInput] = useState(false)
  const { handles } = useCssHandles(CSS_HANDLES)
  const DICT = {
    email: (
      <LoginFormElement
        action="sendKey"
        onStart={() => setIsLoading(true)}
        onSuccess={() => setStep('accessKey')}
        onEnd={() => setIsLoading(false)}
      >
        <p className={handles.loginWithAccessKeyText}>Receber código de acesso por email</p>
        <LoginInput
          name="email"
          type="email"
          blockClass="email"
          placeholder={emailPlaceholder}
        />

        <div className={handles.loginWithAccessKeyContainer}>
         <button className={handles.loginWithAccessKeyBackButton} onClick={() => setShowInput(false)}>Voltar</button>
        <LoginButton text={emailButtonText} type="submit" loading={loading} />
        </div>
      </LoginFormElement>
    ),
    accessKey: (
      <LoginWithAccesKeyTimer
        accessKeyButtonText={accessKeyButtonText}
        accessKeyPlaceholder={accessKeyPlaceholder}
        accessKeyLabel={accessKeyLabel}
        loading={loading}
        setIsLoading={setIsLoading}
        handleStep={() => {
          setShowInput(false)
          setStep('email')
        }}
      />
    ),
  }

  return (
    <>
        {
          !showInput  ? (<button className={handles.loginWithAccessKeyButton} onClick={() => setShowInput(true)}>Receber código de acesso por email</button>) : (
          <>
          {DICT[step]}
          <LoginErrorList />
          </>
        )
        
        }
    </>
  )
}

export default LoginWithAccessKey
