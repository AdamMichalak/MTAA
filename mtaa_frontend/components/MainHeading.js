import { StyleSheet, Text } from 'react-native'

export const MainHeading = ({ style }) => {
  return <Text style={[styles.heading, style]}>Students dating app</Text>
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '60%',
  },
})
