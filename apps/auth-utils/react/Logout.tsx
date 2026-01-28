import React, { useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import {useCssHandles} from "vtex.css-handles"

type LogoutProps = {
  //
}

const CSS_HANDLES = ['logoutLink', 'text'] as const

const Logout: StorefrontFC<LogoutProps> = ({ children }) => {
  const { account } = useRuntime()

  const { handles } = useCssHandles(CSS_HANDLES)

  const handleLogoutClick = useCallback(async () => {
    fetch(`/api/vtexid/pub/logout?scope=${account}`).then(() =>
      window.location.reload()
    )
  }, [account])

  const hasChildren = React.Children.count(children) > 0

  return (
    <button
      type="button"
      className={handles.logoutLink}
      onClick={handleLogoutClick}
    >
      {hasChildren ? children : <span className={handles.text}>Sair</span>}
    </button>
  )
}

export default Logout
