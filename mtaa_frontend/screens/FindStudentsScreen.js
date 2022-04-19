import React, { useRef } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { Searchbar } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'

import { getStudents } from '../api/getStudents'
import { useAuth } from '../hooks/useAuth'
import { BORDER_COLOR } from '../constants/Color'
import { DefaultButton } from '../components/DefaultButton'
import { navigate } from './RootNavigation'
import { DefaultScreen } from './DefaultScreen'
import { Loader } from '../components/Loader'

export const FindStudentsScreen = () => {
  const isFocused = useIsFocused()
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [searchQuery, setSearchQuery] = useState(undefined)
  const [searched, setSearched] = useState(false)
  const [maxResults, setMaxResults] = useState(2)
  const [moreResults, setMoreResults] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  const timeoutRef = useRef()

  const onChangeSearch = (query) => {
    setSearchQuery(query)
    setDataLoaded(false)
  }

  useEffect(() => {
    getStudents(user.id).then((res) => {
      setDataLoaded(true)
      setMoreResults(res.length > maxResults)
      setStudents(res)
      setFilteredList(res.slice(0, maxResults))
    })
  }, [isFocused, maxResults])

  useEffect(() => {
    if (searchQuery === '') {
      setSearched(false)
      setMoreResults(students.length > maxResults)
      setFilteredList(students.slice(0, maxResults))
      timeoutRef.current = setTimeout(() => {
        setDataLoaded(true)
      }, 250)
    } else if (searchQuery !== undefined) {
      const list = students.filter(
        (student) => student.fullname.search(searchQuery) !== -1,
      )
      setMoreResults(list.slice(0, maxResults).length > maxResults)
      setFilteredList(list.slice(0, maxResults))
      setSearched(true)

      timeoutRef.current = setTimeout(() => {
        setDataLoaded(true)
      }, 250)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchQuery, maxResults])

  return (
    <DefaultScreen>
      <View style={{ marginTop: 50 }}>
        <Searchbar
          style={styles.search}
          placeholder="Find student"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        {dataLoaded ? (
          <>
            {filteredList.length !== 0
              ? filteredList?.map((student, key) => {
                  return (
                    <Pressable
                      key={key}
                      onPress={() => {
                        navigate('ViewProfile', { id: student['user_id'] })
                      }}>
                      <View key={key} style={styles.resultContainer}>
                        {student.file ? (
                          <Image
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 75,
                            }}
                            source={{
                              uri: `data:image/gif;base64,${student.file}`,
                            }}
                          />
                        ) : (
                          <Ionicons
                            name="person-circle-outline"
                            size={50}
                            color="#000"
                          />
                        )}
                        <View style={styles.resultInfoContainer}>
                          <Text style={styles.resultInfoHeading}>
                            {student.fullname} {student.age}y.o{' '}
                          </Text>
                          <Text style={styles.resultInfo}>
                            {student.interests}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  )
                })
              : null}
            {moreResults ? (
              <DefaultButton
                style={{ marginTop: 15 }}
                text="Load more users"
                handleClick={() => {
                  setDataLoaded(false)
                  setMaxResults(maxResults + 3)
                }}
              />
            ) : null}
            {searched && filteredList.length === 0 ? (
              <View>
                <Text style={styles.heading}>No student found</Text>
              </View>
            ) : null}
          </>
        ) : (
          <Loader style={{ marginTop: 40 }} />
        )}
      </View>
    </DefaultScreen>
  )
}

const styles = StyleSheet.create({
  search: {
    height: 40,
    borderRadius: 20,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  resultContainer: {
    backgroundColor: BORDER_COLOR,
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultInfoContainer: {
    marginLeft: 15,
  },
  resultInfoHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultInfo: {
    fontSize: 14,
    fontWeight: '600',
  },
})
