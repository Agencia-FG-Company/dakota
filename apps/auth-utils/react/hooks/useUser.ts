/* eslint-disable prefer-destructuring */
import { useRenderSession } from 'vtex.session-client'
import { useQuery } from 'react-apollo'
import { useMemo } from 'react'

import CustomerGreeting from '../graphql/CustomerGreeting.gql'

interface NamespaceItem<T = string> {
  value: T & string
}

export interface Session {
  __typename?: 'SessionSuccess' | 'SessionUnauthorized' | 'SessionForbidden'
  id?: string
  namespaces?: {
    profile?: {
      id?: NamespaceItem
      isAuthenticated?: NamespaceItem<'true' | 'false'>
      firstName?: NamespaceItem
      lastName?: NamespaceItem
      email?: NamespaceItem
      document?: NamespaceItem
      phone?: NamespaceItem
    }
  }
}

interface CustomerGreetingData {
  profile: {
    firstName: string | null
    lastName: string | null
    profilePicture: string | null

    // Email
    cacheId: string
  }
}

export const useUser = () => {
  const { session, loading } = useRenderSession()

  const profile = useMemo(() => {
    return (session as Session)?.namespaces?.profile
  }, [session])

  const { data: customerGreeting } = useQuery<CustomerGreetingData>(
    CustomerGreeting,
    {
      skip: !profile?.email?.value && !profile?.firstName?.value,
    }
  )

  const greetingName = useMemo(() => {
    if (loading) {
      return null
    }

    const firstName = customerGreeting?.profile.firstName

    if (firstName) {
      return firstName
    }

    return profile?.firstName?.value ?? profile?.email?.value?.split('@')?.[0]
  }, [customerGreeting, profile, loading])

  const fullName = useMemo(() => {
    if (loading) {
      return null
    }

    const greetingDataFirstName = customerGreeting?.profile.firstName

    if (greetingDataFirstName) {
      const name = greetingDataFirstName
      const lastName = customerGreeting?.profile?.lastName

      if (name && lastName) {
        return `${name} ${lastName}`
      }

      return name
    }

    if (!profile?.firstName?.value) {
      return greetingName
    }

    const name = profile.firstName.value
    const lastName = profile.lastName?.value

    if (name && lastName) {
      return `${name} ${lastName}`
    }

    return name
  }, [loading, customerGreeting, profile, greetingName])

  const isAuthenticated = useMemo(() => {
    return profile?.isAuthenticated?.value === 'true'
  }, [profile])

  return {
    greetingName,
    fullName,
    loading,
    isAuthenticated,
  }
}
