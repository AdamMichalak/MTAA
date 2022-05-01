import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { getAllPosts } from '../api/getAllPosts'
import { navigate } from './RootNavigation'
import { DefaultScreen } from './DefaultScreen'
import { DefaultButton } from '../components/DefaultButton'
import { INVALID_COLOR } from '../constants/Color'
import { likePost } from '../api/likePost'
import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/Loader'

const windowWidth = Dimensions.get('window').width

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export const HomeScreen = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const isFocused = useIsFocused()
  const [pressed, setPressed] = useState(false)
  const [pressedOnce, setPressedOnce] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(true)
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(() => {
    getAllPosts().then((res) => {
      setPosts(res)
      setDataLoaded(true)
    })

    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
  }, [])

  useEffect(async () => {
    let unmounted = false

    if (isFocused) {
      getAllPosts().then((res) => {
        if (!unmounted && res) {
          setPosts(res)
          setDataLoaded(true)
        }
      })
    }

    return () => {
      unmounted = true
    }
  }, [isFocused])

  return (
    <>
      <DefaultScreen
        style={{ padding: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View>
          {dataLoaded ? (
            <View>
              {posts?.map((post, key) => {
                return (
                  <View
                    key={key}
                    style={{
                      backgroundColor: '#F4EBE2',
                      borderRadius: 8,
                      marginBottom: 20,
                    }}>
                    {post.attachment === 'storage-image' ? (
                      <View
                        style={{
                          width: windowWidth - 80,
                          height: windowWidth - 80,
                          borderRadius: 8,
                          alignSelf: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 40,
                        }}>
                        <Text style={{ textAlign: 'center' }}>
                          Images are too powerful, to be stored in cache
                        </Text>
                      </View>
                    ) : (
                      <Image
                        style={{
                          width: windowWidth - 80,
                          height: windowWidth - 80,
                          borderRadius: 8,
                          alignSelf: 'center',
                        }}
                        source={{
                          uri: `data:image/gif;base64,${post.attachment}`,
                        }}
                      />
                    )}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10,
                      }}>
                      <View>
                        <Text style={styles.postText}>
                          {new Date(post.created_at).toLocaleDateString(
                            'sk-SK',
                          )}
                        </Text>
                        <Text>{post.username}</Text>
                        <Text>{post.likes} likes</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                        }}>
                        <Ionicons
                          name={pressed ? 'heart' : 'heart-outline'}
                          size={30}
                          color={pressed ? INVALID_COLOR : '#000'}
                          onPress={() => {
                            setPressed(!pressed)
                            if (!pressedOnce) {
                              setPressedOnce(true)
                              likePost(post.id, user.token)
                            }
                          }}
                        />
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          ) : (
            <Loader />
          )}
        </View>
      </DefaultScreen>
      <View style={styles.buttonContainer}>
        <DefaultButton
          style={styles.button}
          text="Create post"
          handleClick={() => {
            navigate('UploadPhoto', { type: 'user_post' })
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: windowWidth - 40,
  },
  postText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
