import { View, Image, Dimensions, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'

import { addUserPhoto } from '../api/addUserPhoto'
import { createPost } from '../api/createPost'
import { useAuth } from '../hooks/useAuth'
import { DefaultScreen } from './DefaultScreen'
import { DefaultButton } from '../components/DefaultButton'
import { updatePost } from '../api/updatePost'
import { useNetInfo } from '@react-native-community/netinfo'
import { useOffline } from '../hooks/useOffline'

const windowWidth = Dimensions.get('window').width

export const UploadPhotoScreen = ({ route }) => {
  const { user } = useAuth()
  const { isInternetReachable } = useNetInfo()
  const offline = useOffline()
  const { params } = route
  const [image, setImage] = useState(null)
  const [binary, setBinary] = useState(null)

  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    })

    if (!result.cancelled) {
      setBinary(result.base64)
      setImage(result.uri)
    }
  }

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    })

    if (!result.cancelled) {
      setBinary(result.base64)
      setImage(result.uri)
    }
  }

  return (
    <DefaultScreen>
      <DefaultButton
        text="Take photo with camera"
        handleClick={pickImageFromCamera}
      />
      <DefaultButton
        text="Select photo from gallery"
        handleClick={pickImageFromGallery}
        style={{ marginTop: 10 }}
      />
      <View>
        {params.photo && !image && params.photo !== 'storage-image' ? (
          <Image
            source={{ uri: `data:image/gif;base64,${params.photo}` }}
            style={{
              width: windowWidth - 40,
              height: windowWidth - 40,
              marginTop: 20,
            }}
          />
        ) : null}
        {params.photo === 'storage-image' ? (
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
        ) : null}
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: windowWidth - 40,
              height: windowWidth - 40,
              marginTop: 20,
            }}
          />
        )}
      </View>
      <DefaultButton
        style={{ marginTop: 20 }}
        text="Submit"
        handleClick={() => {
          if (params.type === 'user_photo') {
            addUserPhoto(user.id, user.token, binary)
          } else if (params.type === 'user_post') {
            createPost(
              user.id,
              user.token,
              binary,
              isInternetReachable,
              offline,
            )
          } else if (params.type === 'user_post_update') {
            updatePost(params.post_id, user.token, binary)
          }
        }}
      />
    </DefaultScreen>
  )
}
