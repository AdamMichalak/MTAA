import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { useNetInfo } from '@react-native-community/netinfo'
import { DefaultButton } from './DefaultButton'
import img from '../assets/no-network.png'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export const NoInternetDialog = () => {
  const [hide, setHide] = useState(false)
  const info = useNetInfo()

  return !info.isInternetReachable && !hide ? (
    <View style={styles.container}>
      <Image
        source={img}
        style={{ width: 100, height: 100, marginBottom: 20 }}
      />
      <Text style={styles.text}>Slow or no internet connection</Text>
      <Text style={styles.text}>
        To have the best experience connect to internet
      </Text>
      <DefaultButton
        text="Continue anyway"
        handleClick={() => {
          setHide(true)
        }}
        style={{ width: 200 }}
      />
    </View>
  ) : null
}

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    backgroundColor: '#f4f6f8',
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    maxWidth: 250,
    fontSize: 16,
    marginBottom: 10,
  },
})
