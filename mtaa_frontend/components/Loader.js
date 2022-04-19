import { ActivityIndicator } from 'react-native'
import { View } from 'react-native'

export const Loader = ({ style }) => {
  return (
    <View style={[style, { flex: 1, justifyContent: 'center' }]}>
      <ActivityIndicator size="large" color="#2196F3" />
    </View>
  )
}
