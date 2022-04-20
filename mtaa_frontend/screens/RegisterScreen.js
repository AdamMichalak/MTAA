import { View, TextInput, Text, Pressable } from 'react-native'
import { Formik } from 'formik'

import { useAuth } from '../hooks/useAuth'
import { BORDER_COLOR, INVALID_COLOR } from '../constants/Color'
import { MainHeading } from '../components/MainHeading'
import { loginStyles } from './LoginScreen'
import { KeyboardAvoidingScreen } from './KeyboardAvoidingScreen'

export const RegisterScreen = () => {
  const { register } = useAuth()

  return (
    <KeyboardAvoidingScreen>
      <View style={loginStyles.container}>
        <MainHeading style={{ marginBottom: 40, alignSelf: 'center' }} />
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            username: '',
            email: '',
            id: '',
            password: '',
          }}
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

            if (!values.id) {
              errors.id = 'ID is required'
            }

            return errors
          }}
          onSubmit={(values) => {
            register(values.username, values.email, values.id, values.password)
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
                <Text style={loginStyles.label}>AIS ID</Text>
                <TextInput
                  style={[
                    loginStyles.input,
                    errors.id ? loginStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.id ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder={`${values.id || '110855'}`}
                  onChangeText={handleChange('id')}
                  onBlur={handleBlur('id')}
                  value={values.id}
                  keyboardType="numeric"
                  maxLength={6}
                />
                <Text style={loginStyles.errorMessage}>{errors.id}</Text>
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
                <Text style={loginStyles.buttonText}>Create account</Text>
              </Pressable>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingScreen>
  )
}
