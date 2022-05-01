import React from 'react'
import FlashMessage from 'react-native-flash-message'

import { AuthProvider } from './hooks/useAuth'
import { InitialScreen } from './screens/InitialScreen'
import { OfflineProvider } from './hooks/useOffline'

class App extends React.Component {
  render() {
    return (
      <AuthProvider>
        <OfflineProvider>
          <InitialScreen />
          <FlashMessage position="top" />
        </OfflineProvider>
      </AuthProvider>
    )
  }
}

export default App
