import React, { useMemo } from 'react'
import { useRenderSession } from 'vtex.session-client'
import {useCssHandles} from "vtex.css-handles"

import ConditionLayout from './components/ConditionLayout'
import type { Session } from './hooks/useUser'

const CSS_HANDLES = ['loggedCondition'] as const

interface IsUserLoggedProps {
  Then?: React.ComponentType
  Else?: React.ComponentType
}

const IsUserLogged: React.FC<IsUserLoggedProps> = ({ Then, Else }) => {
  const { session, loading } = useRenderSession()
  const { handles } = useCssHandles(CSS_HANDLES)

  const isLogged = useMemo(() => {
    return !!(session as Session)?.namespaces?.profile?.email?.value
  }, [session])

  return (
    <div data-loading={loading} className={handles.loggedCondition}>
      <ConditionLayout condition={isLogged} Then={Then} Else={Else} />
    </div>
  )
}

export default IsUserLogged
