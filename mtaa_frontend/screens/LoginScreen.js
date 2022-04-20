import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native'
import { Formik } from 'formik'

import { useAuth } from '../hooks/useAuth'
import { BORDER_COLOR, INVALID_COLOR, TEXT_COLOR } from '../constants/Color'
import { MainHeading } from '../components/MainHeading'
import { KeyboardAvoidingScreen } from './KeyboardAvoidingScreen'

export const LoginScreen = () => {
  const { login } = useAuth()

  return (
    <KeyboardAvoidingScreen>
      <View>
        <MainHeading style={{ marginBottom: 50, alignSelf: 'center' }} />
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{ username: '', password: '' }}
          validate={(values) => {
            const errors = {}

            if (!values.username) {
              errors.username = 'Username is required'
            }

            if (!values.password) {
              errors.password = 'Password is required'
            }

            return errors
          }}
          onSubmit={(values) => {
            login(values.username, values.password)
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
              <Pressable style={[loginStyles.button]} onPress={handleSubmit}>
                <Text style={loginStyles.buttonText}>Login</Text>
              </Pressable>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingScreen>
  )
}

export const loginStyles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
    position: 'relative',
    paddingBottom: 20,
  },
  label: {
    color: TEXT_COLOR,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 60,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    paddingLeft: 25,
    fontSize: 18,
  },
  inputInvalid: {
    borderColor: INVALID_COLOR,
    color: INVALID_COLOR,
  },
  button: {
    backgroundColor: BORDER_COLOR,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: INVALID_COLOR,
    marginTop: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: -10,
    textAlign: 'center',
  },
})
