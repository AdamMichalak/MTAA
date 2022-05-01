import { Pressable, StyleSheet, Text } from 'react-native'
import { BLUE_COLOR } from '../constants/Color'

export const DefaultButton = ({ handleClick, text, style }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={handleClick}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    backgroundColor: BLUE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
})
