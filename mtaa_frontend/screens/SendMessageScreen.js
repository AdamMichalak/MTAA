import {
  View,
  Image,
  Dimensions,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'

import { useAuth } from '../hooks/useAuth'
import { DefaultScreen } from './DefaultScreen'
import { DefaultButton } from '../components/DefaultButton'
import { sendMessage } from '../api/sendMessage'
import { loginStyles } from './LoginScreen'
import { BORDER_COLOR } from '../constants/Color'
import { Formik } from 'formik'

const windowWidth = Dimensions.get('window').width

export const SendMessageScreen = ({ route }) => {
  const { user } = useAuth()
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
      <Text style={[styles.heading]}>Select attachment</Text>
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
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: windowWidth - 40,
              height: windowWidth - 40,
              marginTop: 20,
              alignSelf: 'center',
            }}
          />
        )}
      </View>
      <Text style={[styles.heading]}>Message content</Text>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          content: '',
        }}
        onSubmit={(values) => {
          sendMessage(user.id, params.id, user.token, {
            file: binary,
            content: values.content,
          })
        }}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={{ marginBottom: 40 }}>
            <View style={[loginStyles.inputContainer, { marginBottom: 0 }]}>
              <TextInput
                style={[loginStyles.input]}
                placeholderTextColor={BORDER_COLOR}
                placeholder="Random stuff"
                onChangeText={handleChange('content')}
                onBlur={handleBlur('content')}
                value={values.content}
              />
            </View>
            <DefaultButton
              text={'Send message'}
              style={{ height: 60 }}
              handleClick={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </DefaultScreen>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
})
