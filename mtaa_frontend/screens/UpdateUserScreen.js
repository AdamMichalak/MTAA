import { View, TextInput, Text, Pressable } from 'react-native'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'

import { updateUser } from '../api/updateUser'
import { getUser } from '../api/getUser'
import { useAuth } from '../hooks/useAuth'
import { BORDER_COLOR, INVALID_COLOR } from '../constants/Color'
import { loginStyles } from './LoginScreen'
import { Loader } from '../components/Loader'
import { DefaultScreen } from './DefaultScreen'

export const UpdateUserScreen = () => {
  const { user } = useAuth()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [userData, setUserData] = useState({})

  useEffect(() => {
    let unmounted = false
    getUser(user.id, user.token).then((res) => {
      if (!unmounted && res) {
        setUserData({
          username: res.username,
          email: res.email,
          password: res.password,
        })
        setDataLoaded(true)
      }
    })

    return () => {
      unmounted = true
    }
  }, [])

  return dataLoaded ? (
    <DefaultScreen style={{ justifyContent: 'flex-start' }}>
      <View style={[loginStyles.container, { marginTop: 50 }]}>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={userData}
          validate={(values) => {
            const errors = {}

            if (!values.username) {
              errors.username = 'Username is required'
            }

            if (!values.password) {
              errors.password = 'Password is required'
            }

            if (!values.email) {
              errors.email = 'Email is required'
            } else if (
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                values.email,
              )
            ) {
              errors.email = 'Invalid email address'
            }

            return errors
          }}
          onSubmit={(values) => {
            updateUser(user.id, user.token, {
              username: values.username,
              password: values.password,
              email: values.email,
            })
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
              <View style={loginStyles.inputContainer}>
                <Text style={loginStyles.label}>Username</Text>
                <TextInput
                  style={[
                    loginStyles.input,
                    errors.username ? loginStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.username ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="xuser"
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  autoCapitalize="none"
                />
                <Text style={loginStyles.errorMessage}>{errors.username}</Text>
              </View>
              <View style={loginStyles.inputContainer}>
                <Text style={loginStyles.label}>Email</Text>
                <TextInput
                  style={[
                    loginStyles.input,
                    errors.email ? loginStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.email ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="user@stuba.sk"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={loginStyles.errorMessage}>{errors.email}</Text>
              </View>
              <View style={loginStyles.inputContainer}>
                <Text style={loginStyles.label}>Password</Text>
                <TextInput
                  style={[
                    loginStyles.input,
                    errors.password ? loginStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.password ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="**********"
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <Text style={loginStyles.errorMessage}>{errors.password}</Text>
              </View>
              <Pressable style={loginStyles.button} onPress={handleSubmit}>
                <Text style={loginStyles.buttonText}>Update data</Text>
              </Pressable>
            </View>
          )}
        </Formik>
      </View>
    </DefaultScreen>
  ) : (
    <Loader />
  )
}
