import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'

import { HomeScreen } from './HomeScreen'
import { ACTIVE_COLOR } from '../constants/Color'
import { ProfileScreen } from './ProfileScreen'
import { FindStudentsScreen } from './FindStudentsScreen'
import { ConversationsScreen } from './ConversationsScreen'

const Tab = createBottomTabNavigator()

export const MainScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline'
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'
          } else if (route.name === 'Find') {
            iconName = focused ? 'search' : 'search-outline'
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Find" component={FindStudentsScreen} />
      <Tab.Screen name="Messages" component={ConversationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
