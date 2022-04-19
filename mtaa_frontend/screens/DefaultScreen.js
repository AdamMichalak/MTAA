import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

export const DefaultScreen = ({ children, style }) => {
  return (
    <ScrollView contentContainerStyle={[styles.defaultScreen, style]}>
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  defaultScreen: {
    padding: 20,
  },
})
