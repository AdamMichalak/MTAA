import { View, Text } from 'react-native'
import { useAuth } from '../hooks/useAuth'

export const ProtectedScreen = ({ children }) => {
  const { user } = useAuth()

  return (
    <View>
      {user.token ? (
        children
      ) : (
        <Text>You don't have permission to view this</Text>
      )}
    </View>
  )
}
