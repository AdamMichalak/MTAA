import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { getAllPosts } from '../api/getAllPosts'
import { navigate } from './RootNavigation'
import { DefaultScreen } from './DefaultScreen'
import { DefaultButton } from '../components/DefaultButton'

const windowWidth = Dimensions.get('window').width

export const HomeScreen = () => {
  const [posts, setPosts] = useState([])
  const isFocused = useIsFocused()

  useEffect(() => {
    getAllPosts().then((res) => {
      setPosts(res)
    })
  }, [isFocused])

  return (
    <DefaultScreen style={{ flex: 1, padding: 40 }}>
      <View style={{ marginTop: 50, flex: 1 }}>
        {posts?.map((post, key) => {
          return (
            <View
              key={key}
              style={{
                backgroundColor: '#F4EBE2',
                borderRadius: 8,
              }}>
              <Image
                style={{
                  width: windowWidth - 80,
                  height: windowWidth - 80,
                  borderRadius: 8,
                  alignSelf: 'center',
                }}
                source={{ uri: `data:image/gif;base64,${post.attachment}` }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                <View>
                  <Text style={styles.postText}>
                    {new Date(post.created_at).toLocaleDateString('sk-SK')}
                  </Text>
                  <Text>xmichalaka</Text>
                  <Text>{post.likes} likes</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <Ionicons name="heart-outline" size={30} color={'#000'} />
                </View>
              </View>
            </View>
          )
        })}
        <DefaultButton
          style={styles.button}
          text="Create post"
          handleClick={() => {
            navigate('UploadPhoto', { type: 'user_post' })
          }}
        />
      </View>
    </DefaultScreen>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  postText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
