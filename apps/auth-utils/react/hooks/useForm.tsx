import type React from 'react'
import { useCallback, useMemo, useState } from 'react'

type FormInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
type Nullable<T> = { [K in keyof T]: T[K] | null | undefined }
export type ErrorsDict<T> = Nullable<
  T & Record<string, string[] | boolean> & { alert: string }
>

export type FormHelper<T = any> = {
  setData: React.Dispatch<
    React.SetStateAction<Nullable<T & Record<string, any>>>
  >
  data: Nullable<T & Record<string, any>>
  handleInputChange: (e: React.ChangeEvent<FormInput>) => void
  clear: () => void
  setErrors: React.Dispatch<React.SetStateAction<ErrorsDict<T>>>
  errors: ErrorsDict<T>
  setFieldErrors: (
    fieldName: keyof Nullable<T & Record<string, any>>,
    error: string[] | boolean
  ) => void
  clearErrors: () => void
}

export function useForm<T = any>(): FormHelper<T> {
  const [data, setData] = useState({} as Nullable<T & Record<string, any>>)
  const [errors, setErrors] = useState({} as ErrorsDict<T>)

  const handleInputChange = useCallback((e: React.ChangeEvent<FormInput>) => {
    setData((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({} as ErrorsDict<T>)
  }, [])

  const setFieldErrors = useCallback(
    (
      fieldName: keyof Nullable<T & Record<string, any>>,
      error: string[] | boolean = true
    ) => {
      if (typeof error === 'boolean') {
        setErrors((old) => ({ ...old, [fieldName]: error }))

        return
      }

      setErrors((old) => {
        const curr = old[fieldName]

        if (curr && typeof curr === 'boolean') {
          return old
        }

        return {
          ...old,
          [fieldName]: error,
        }
      })
    },
    []
  )

  const clear = useCallback(() => {
    clearErrors()
    setData({} as Nullable<T & Record<string, any>>)
  }, [clearErrors])

  return useMemo(
    () => ({
      setData,
      data,
      handleInputChange,
      clear,
      setErrors,
      setFieldErrors,
      errors,
      clearErrors,
    }),
    [data, handleInputChange, clear, setFieldErrors, errors, clearErrors]
  )
}
