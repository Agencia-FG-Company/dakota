import React, { useMemo } from 'react'
import { useRuntime, Link } from 'vtex.render-runtime'
import {useCssHandles} from "vtex.css-handles"

interface LoginLinkProps {
  returnUrl?: string
}

const CSS_HANDLES = ['linkContainer', 'label'] as const

const LoginLink: React.FC<LoginLinkProps> = ({ returnUrl, children }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { route } = useRuntime()
  const { canonicalPath, path } = route

  const href = useMemo(() => {
    const splitedPath = path.split(canonicalPath ?? '')

    const newReturnUrl = encodeURIComponent(
      returnUrl ?? `${canonicalPath}${splitedPath[1]}`
    )

    return `/login?returnUrl=${newReturnUrl}`
  }, [canonicalPath, path, returnUrl])

  return (
    <Link
      className={handles.linkContainer}
      to={href}
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      <span className={handles.label}>{children}</span>
    </Link>
  )
}

export default LoginLink
