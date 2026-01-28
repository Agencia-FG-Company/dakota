import type { FormHelper } from '../useForm'

export type LoginActions =
  | 'sendKey'
  | 'validateKey'
  | 'passwordLogin'
  | 'forgotPassword'

export interface LoginContextData<T> extends FormHelper<T> {
  handleAction: (action: LoginActions) => Promise<void>
  handleSendAccessKey: () => Promise<void>
  handleLoginWithAccessKey: () => Promise<void>
  handleLoginWithPassword: () => Promise<void>
  handleForgotPassword: () => Promise<void>
}

export interface VtexIDAuthenticationStartData {
  authenticationToken: string
  oauthProviders: any[]
  showClassicAuthentication: boolean
  showAccessKeyAuthentication: boolean
  authCookie: string | null
  isAuthenticated: boolean
  selectedProvider: string | null
  samlProviders: any[]
}
