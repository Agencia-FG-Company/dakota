import React, { useState } from 'react'
import Greeting from './Greeting'
import { useCssHandles } from 'vtex.css-handles'

export type LoginWrapperProps = {
  children: React.ReactNode
}

const CSS_HANDLES = ['customLoginWrapper', 'customLoginModal'] as const

const LoginWrapper = ({ children }: LoginWrapperProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const [modalVisibility, setModalVisibility] = useState(false)

  const handleModalVisibility = () => setModalVisibility((prev) => !prev)
  console.log('girl',children)
  return (
    <div className={handles.customLoginWrapper}>
      <Greeting handleModalVisibility={handleModalVisibility} />
      {modalVisibility && (
        <div className={handles.customLoginModal}>
                {children}
            </div>
      )}
    </div>
  )
}

export default LoginWrapper
