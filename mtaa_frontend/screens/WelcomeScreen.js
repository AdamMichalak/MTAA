import { Pressable, StyleSheet, Text } from 'react-native'
import { useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { useAuth } from '../hooks/useAuth'
import { TEXT_COLOR } from '../constants/Color'
import { navigate } from './RootNavigation'
import { MainHeading } from '../components/MainHeading'
import { DefaultScreen } from './DefaultScreen'

export const WelcomeScreen = ({ navigation }) => {
  const { user } = useAuth()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (Object.keys(user).length !== 0 && isFocused) {
      if (user.isStudent) {
        navigate('Main')
      } else {
        navigate('SetupProfile')
      }
    }
  }, [user])

  return (
    <DefaultScreen style={styles.container}>
      <MainHeading style={{ marginTop: 100, marginBottom: 150 }} />
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </DefaultScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    width: '75%',
    backgroundColor: '#B8B8B8',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
})
