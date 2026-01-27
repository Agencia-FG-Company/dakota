import React,{useState} from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'
import {useCssHandles} from "vtex.css-handles"

import { useUser } from './hooks/useUser'
import LoggedModal from './components/LoggedModal'

interface GreetingProps {
  markers?: string[]
  unloggedText?: string
  loggedText?: string
  handleModalVisibility:() => void
}

const CSS_HANDLES = ['greeting'] as const

const Greeting: React.FC<GreetingProps> = ({
  unloggedText = 'Entre ou Cadastre-se',
  loggedText = 'Olá {user}',
  markers = [],
  handleModalVisibility
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const [showModal,setShowModal] = useState(false)
  const { greetingName, fullName, isAuthenticated, loading } = useUser()

  if (loading || !isAuthenticated) {
    return <div className={`${handles.greeting} truncate`} role='button' onClick={handleModalVisibility}>{unloggedText}</div>
  }

  return (
    <div className={`${handles.greeting} truncate`} role='button' onClick={() => setShowModal(!showModal)}>
      <IOMessageWithMarkers
        message={loggedText}
        markers={markers}
        handleBase="logged"
        values={{
          user: greetingName,
          greetingName,
          greeting: greetingName,
          fullName,
        }}
      />
      {
        showModal &&  <LoggedModal />
      }
    </div>
  )
}

export default Greeting
