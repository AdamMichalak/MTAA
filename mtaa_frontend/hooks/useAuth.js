import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { navigate } from '../screens/RootNavigation'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { API_URL } from '../constants/Url'

const authContext = createContext()

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

const storeData = async (data) => {
  try {
    await AsyncStorage.setItem('@auth_token', data.token)
    await AsyncStorage.setItem('@auth_username', data.username)
    await AsyncStorage.setItem('@auth_password', data.password)
    await AsyncStorage.setItem('@auth_id', data.id)
    await AsyncStorage.setItem('@auth_isStudent', data.isStudent)
  } catch (e) {}
}

const useProvideAuth = () => {
  const [user, setUser] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(null)
  const [notifications, setNotifications] = useState({})

  useEffect(async () => {
    setError('')
    try {
      const token = await AsyncStorage.getItem('@auth_token')
      const username = await AsyncStorage.getItem('@auth_username')
      const password = await AsyncStorage.getItem('@auth_password')
      const id = await AsyncStorage.getItem('@auth_id')
      const isStudent = await AsyncStorage.getItem('@auth_isStudent')
      const hasAddress = await AsyncStorage.getItem('@auth_hasAddress')
      if (
        token !== null &&
        username !== null &&
        password !== null &&
        id !== null
      ) {
        setUser({
          username: username,
          password: password,
          id: id,
          token: token,
          isStudent: isStudent === 'true',
          hasAddress: hasAddress === 'true',
        })
      }
    } catch (e) {}
  }, [])

  const login = (username, password) => {
    setError(null)
    setLoading(true)
    fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        setLoading(false)
        response.json().then((data) => {
          if (response.ok) {
            showDefaultSuccessMessage(data.response)
            setUser({
              username,
              password,
              id: data.id,
              token: data.token,
              isStudent: data.isStudent,
              hasAddress: data.hasAddress,
            })
            storeData({
              username,
              password,
              id: `${data.id}`,
              token: data.token,
              isStudent: `${data.isStudent}`,
              hasAddress: `${data.hasAddress}`,
            })

            if (data.isStudent) {
              navigate('Main')
            } else {
              navigate('SetupProfile')
            }
          } else {
            setError(data.response)
            showDefaultErrorMessage(data.response)
          }
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const register = (username, email, id, password) => {
    setLoading(true)

    fetch(`${API_URL}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, username, email, password }),
    })
      .then((response) => {
        setLoading(false)
        response.json().then((data) => {
          if (response.ok) {
            showDefaultSuccessMessage(data.response)
            navigate('Login')
          } else {
            setError(data.response)
            showDefaultErrorMessage(data.response)
          }
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const logout = async () => {
    setUser({})
    await AsyncStorage.removeItem('@auth_token')
    await AsyncStorage.removeItem('@auth_username')
    await AsyncStorage.removeItem('@auth_password')
    await AsyncStorage.removeItem('@auth_id')
    await AsyncStorage.removeItem('@auth_isStudent')
    await AsyncStorage.removeItem('@auth_hasAddress')
    navigate('Welcome', null)
  }

  return {
    user,
    error,
    loading,
    login,
    register,
    logout,
    notifications,
    setNotifications,
  }
}
