import React, { useEffect, useRef } from 'react'
import { Keyboard, ScrollView, StyleSheet } from 'react-native'

export const DefaultScreen = ({ children, style, ...rest }) => {
  const scrollViewRef = useRef()

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollViewRef.current.scrollToEnd({ animated: true })
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        scrollViewRef.current.scrollToEnd({ animated: true })
      },
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.defaultScreen, style]}
      {...rest}>
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  defaultScreen: {
    padding: 20,
  },
  button: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
})
