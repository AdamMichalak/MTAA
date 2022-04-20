import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { DefaultScreen } from './DefaultScreen'
import { Loader } from '../components/Loader'
import { getUserPosts } from '../api/getUserPosts'

const windowWidth = Dimensions.get('window').width

export const ViewPostsScreen = ({ route }) => {
  const { params } = route
  const [posts, setPosts] = useState([])
  const isFocused = useIsFocused()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [hasPosts, setHasPosts] = useState(false)

  useEffect(() => {
    let unmounted = false
    getUserPosts(params.id).then((res) => {
      if (!unmounted) {
        if (res.response) {
          setHasPosts(false)
          setDataLoaded(true)
        } else {
          setPosts(res)
          setDataLoaded(true)
          setHasPosts(true)
        }
      }
    })

    return () => {
      unmounted = true
    }
  }, [isFocused])

  return (
    <>
      <DefaultScreen style={{ padding: 40 }}>
        <View>
          {dataLoaded ? (
            <View>
              {hasPosts ? (
                posts.map((post, key) => {
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
                      </View>
                    </View>
                  )
                })
              ) : (
                <Text style={styles.heading}>User has no posts</Text>
              )}
            </View>
          ) : (
            <Loader />
          )}
        </View>
      </DefaultScreen>
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
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
})
