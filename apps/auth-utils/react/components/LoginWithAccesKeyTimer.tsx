import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import LoginFormElement from '../LoginFormElement'
import LoginInput from '../LoginInput'
import LoginButton from '../LoginButton'

export type LoginWithAccesKeyTimerProps = {
  accessKeyLabel?: string
  accessKeyPlaceholder?: string
  accessKeyButtonText?: string
  loading: boolean
  setIsLoading: (state: boolean) => void
  handleStep:() => void
}

const CSS_HANDLES = ['loginAccesKeyWithTimerContainer',"loginAccessKeyWithTimerText","loginAccessKeyWithTimerTextClock", "loginAccessKeyWithTimerInformative" ,"loginWithAccessKeyBackButton"] as const

const LoginWithAccesKeyTimer = ({
  accessKeyLabel="Digite o código enviado para seu email",
  accessKeyPlaceholder,
  loading,
  setIsLoading,
  handleStep
}: LoginWithAccesKeyTimerProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const TOTAL_SECONDS = 15 * 60
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS)
  const intervalRef = useRef<number | null>(null)
  const hasExpiredRef = useRef(false)

  const handleStepRef = useRef(handleStep)
  useEffect(() => {
    handleStepRef.current = handleStep
  }, [handleStep])

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true
            handleStepRef.current()
          }

          if (intervalRef.current != null) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const remainingTimeLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [remainingSeconds])


  return (
    <div className={handles.loginAccesKeyWithTimerContainer}>
          <LoginFormElement
            action="validateKey"
            onStart={() => setIsLoading(true)}
            onError={() => setIsLoading(false)}
          >
            <LoginInput
              name="accessKey"
              blockClass="accessKey"
              label={accessKeyLabel}
              placeholder={accessKeyPlaceholder}
            />
        <p className={handles.loginAccessKeyWithTimerTextClock}>{remainingTimeLabel}</p>
             <p className={handles.loginAccessKeyWithTimerInformative}>
              Após o termino do tempo, o código expira sendo necessário uma nova solciitação.
             </p>
            <p className={handles.loginAccessKeyWithTimerInformative}>* Verifique sua caixa de ENTRADA e SPAM para o código de acesso.</p>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',width: '100%'}}>
            <button className={handles.loginWithAccessKeyBackButton} onClick={() => handleStep()}>Voltar</button>
            <LoginButton
              text={"Confirmar"}
              type="submit"
              loading={loading}
              />
              </div>
          </LoginFormElement>
    </div>
  )
}

export default LoginWithAccesKeyTimer
