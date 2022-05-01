import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import React, { useState, useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import socketio from 'socket.io-client'

import { HomeScreen } from './HomeScreen'
import { ACTIVE_COLOR } from '../constants/Color'
import { ProfileScreen } from './ProfileScreen'
import { FindStudentsScreen } from './FindStudentsScreen'
import { ConversationsScreen } from './ConversationsScreen'
import { useAuth } from '../hooks/useAuth'
import { API_URL } from '../constants/Url'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

async function sendPushNotification(expoPushToken, msg, user) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: user,
    body: msg,
    data: {},
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}

async function registerForPushNotificationsAsync() {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token
}

const Tab = createBottomTabNavigator()

export const MainScreen = () => {
  const { notifications, setNotifications } = useAuth()
  const { user } = useAuth()
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => {})

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const socket = socketio.connect(API_URL)
  useEffect(() => {
    socket.on('send_message', async (e) => {
      if (e.to_id.toString() === user.id.toString()) {
        if (Object.keys(notifications).length === 0) {
          setNotifications({ [e.from_id]: 1 })
        } else {
          setNotifications({ [e.from_id]: notifications[e.from_id] + 1 })
        }
        await sendPushNotification(
          expoPushToken,
          e.content || 'Poslal fotku',
          e.user,
        )
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [notifications])

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
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Find" component={FindStudentsScreen} />
      <Tab.Screen
        name="Messages"
        component={ConversationsScreen}
        options={{
          tabBarBadge:
            Object.values(notifications) > 0
              ? Object.values(notifications).reduce(
                  (partialSum, a) => partialSum + a,
                  0,
                )
              : null,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
