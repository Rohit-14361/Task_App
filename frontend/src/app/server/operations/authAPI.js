import { apiConnector } from '../apiConnector.js'
import { userEndpoints } from '../apiRoute.js'

export async function signupUser(userData) {
  try {
    const response = await apiConnector('POST', userEndpoints.signup, userData)
    console.log('SIGNUP RESPONSE:', response)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || 'Signup failed')
    }
    return { success: true, data: response.data }
  } catch (error) {
    console.log('SIGNUP ERROR:', error)
    return { success: false, error: error?.response?.data?.message || error.message || 'Signup failed' }
  }
}

export async function loginUser(credentials) {
  try {
    const response = await apiConnector('POST', userEndpoints.login, credentials)
    console.log('LOGIN RESPONSE:', response)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || 'Login failed')
    }
    return { success: true, data: response.data }
  } catch (error) {
    console.log('LOGIN ERROR:', error)
    return { success: false, error: error?.response?.data?.message || error.message || 'Login failed' }
  }
}

