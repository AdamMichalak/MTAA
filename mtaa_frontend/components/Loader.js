import { ActivityIndicator } from 'react-native'
import { View } from 'react-native'

export const Loader = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}
