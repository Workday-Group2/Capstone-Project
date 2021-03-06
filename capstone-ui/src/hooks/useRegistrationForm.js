import * as React from "react"
import apiClient from "../services/apiClient"
import {useAuthenticationForm} from "../hooks/useAuthenticationForm"
import { useAuthContext } from "../contexts/auth"

export const useRegistrationForm = () => {
  const {user, setUser } = useAuthContext()
    const { form, errors, setErrors, handleOnInputChange} = useAuthenticationForm({user})
    const [isLoading, setIsLoading] = React.useState(false)
    
    const handleOnSubmit = async (event) => {
      event.preventDefault()
      setIsLoading(true)
      setErrors((e) => ({ ...e, input: null }))
  
      if (form.passwordConfirm !== form.password) {
        setErrors((e) => ({ ...e, passwordConfirm: "Passwords do not match." }))
        setIsLoading(false)
        return
      } else {
        setErrors((e) => ({ ...e, passwordConfirm: null }))
      }
      
      const { data, error } = await apiClient.signupUser( { email : form.email, 
        password: form.password, userName: form.username, firstName: form.firstname, lastName: form.lastname})
      if (error) setErrors((e) => ({ ...e, form: error }))
      if (data?.user) {
        setUser(data.user)
        apiClient.setToken(data.token)
      } else {
        setErrors((e) => ({ ...e, email: "A user already exists with that email" }))
      }
      setIsLoading(false)
    }
    return {
        isLoading,
        form,
        errors,
        handleOnInputChange,
        handleOnSubmit,
    }
}