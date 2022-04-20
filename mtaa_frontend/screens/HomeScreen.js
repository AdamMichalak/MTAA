import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
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

export const HomeScreen = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const isFocused = useIsFocused()
  const [pressed, setPressed] = useState(false)
  const [pressedOnce, setPressedOnce] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    let unmounted = false
    getAllPosts().then((res) => {
      if (!unmounted) {
        setPosts(res)
        setDataLoaded(true)
      }
    })

    return () => {
      unmounted = true
    }
  }, [isFocused, pressed])

  return (
    <>
      <DefaultScreen style={{ padding: 40 }}>
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
