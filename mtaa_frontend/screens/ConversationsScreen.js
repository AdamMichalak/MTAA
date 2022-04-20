import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, Pressable } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import { getStudents } from '../api/getStudents'
import { useAuth } from '../hooks/useAuth'
import { getStudent } from '../api/getStudent'
import { BORDER_COLOR } from '../constants/Color'
import { DefaultScreen } from './DefaultScreen'
import { navigate } from './RootNavigation'
import { Loader } from '../components/Loader'

export const ConversationsScreen = () => {
  const { user } = useAuth()
  const isFocused = useIsFocused()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [userContacts, setUserContacts] = useState('')
  const [students, setStudents] = useState([])

  useEffect(() => {
    let unmounted = false

    getStudent(user.id).then((res) => {
      setUserContacts(res.contacts)
    })

    getStudents(user.id)
      .then((res) => {
        if (!unmounted) {
          setStudents(res)
          setDataLoaded(true)
        }
      })
      .catch((error) => {
        if (!unmounted) {
          console.log(error)
        }
      })

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
              navigate('Conversation', { from: user.id, to: student.user_id })
            }}>
            <Text style={styles.heading}>{student.fullname}</Text>
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
