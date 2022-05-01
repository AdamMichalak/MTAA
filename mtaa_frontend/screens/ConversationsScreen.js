import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, Pressable, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import { getStudents } from '../api/getStudents'
import { useAuth } from '../hooks/useAuth'
import { getStudent } from '../api/getStudent'
import { BORDER_COLOR, INVALID_COLOR } from '../constants/Color'
import { DefaultScreen } from './DefaultScreen'
import { navigate } from './RootNavigation'
import { Loader } from '../components/Loader'

export const ConversationsScreen = () => {
  const { user, notifications } = useAuth()
  const isFocused = useIsFocused()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [userContacts, setUserContacts] = useState('')
  const [students, setStudents] = useState([])

  useEffect(() => {
    let unmounted = false

    if (isFocused) {
      getStudent(user.id).then((res) => {
        if (!unmounted && res) {
          setUserContacts(res.contacts)
        }
      })

      getStudents(user.id)
        .then((res) => {
          if (!unmounted && res) {
            setStudents(res)
            setDataLoaded(true)
          }
        })
        .catch((error) => {
          if (!unmounted) {
            console.log(error)
          }
        })
    }

    return () => {
      unmounted = true
    }
  }, [isFocused])

  return dataLoaded ? (
    <DefaultScreen style={{ marginTop: 60 }}>
      {students.map((student, key) => {
        return userContacts.includes(student.user_id) ? (
          <Pressable
            key={key}
            style={styles.container}
            onPress={() => {
              navigate('Conversation', { to: student.user_id })
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.heading}>{student.fullname}</Text>
              {Object.keys(notifications) > 0 &&
              notifications[student.user_id] > 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    backgroundColor: INVALID_COLOR,
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ color: '#fff', fontSize: 15 }}>
                    {notifications[student.user_id]}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        ) : null
      })}
    </DefaultScreen>
  ) : (
    <Loader />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: BORDER_COLOR,
    marginBottom: 20,
    borderRadius: 8,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
})
