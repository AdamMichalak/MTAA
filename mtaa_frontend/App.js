import { registerRootComponent } from 'expo'
import React from 'react'
import FlashMessage from 'react-native-flash-message'

import { AuthProvider } from './hooks/useAuth'
import { InitialScreen } from './screens/InitialScreen'

class App extends React.Component {
  render() {
    return (
      <AuthProvider>
        <InitialScreen />
        <FlashMessage position="top" />
      </AuthProvider>
    )
  }
}

registerRootComponent(App)
export default App
