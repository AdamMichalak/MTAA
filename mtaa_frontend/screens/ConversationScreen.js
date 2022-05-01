import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
  Platform,
  Pressable,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import { TextInput } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import socketio from 'socket.io-client'
import { Formik } from 'formik'

import { BLUE_COLOR, BORDER_COLOR } from '../constants/Color'
import { CustomDialog } from '../components/CustomDialog'
import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/Loader'
import { getMessages } from '../api/getMessages'
import { API_URL } from '../constants/Url'

const windowWidth = Dimensions.get('window').width

export const ConversationScreen = ({ route }) => {
  const { user, setNotifications } = useAuth()
  const { params } = route
  const { to } = params
  const isFocused = useIsFocused()
  const [attachmentSource, setAttachmentSource] = useState('paperclip')
  const [dataLoaded, setDataLoaded] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [allMessages, setAllMessages] = useState([])
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [messageId, setMessageId] = useState()
  const scrollViewRef = useRef()

  useEffect(() => {
    setNotifications({ [to]: 0 })

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      },
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  const socket = socketio.connect(API_URL)

  useEffect(() => {
    socket.on('send_message', (e) => {
      const isConversation =
        e.to_id.toString() === to.toString() ||
        e.from_id.toString() === user.id.toString() ||
        e.to_id.toString() === user.id.toString() ||
        e.from_id.toString() === to.toString()

      if (isConversation) {
        setAllMessages([
          ...allMessages,
          {
            from_id: e.from_id,
            to_id: to,
            content: e.content,
            attachment: e.attachment,
          },
        ])
      }
    })

    socket.on('delete_message', (e) => {
      const x = allMessages.filter((m) => {
        return m.id !== e.id
      })
      setAllMessages(x)
      setModalVisible(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [isFocused, allMessages])

  useEffect(() => {
    setDataLoaded(false)
    let unmounted = false

    getMessages(user.id, params.to).then((res) => {
      if (!unmounted && res) {
        if (res.response) {
          setDataLoaded(true)
        } else {
          setAllMessages(res)
          setDataLoaded(true)
        }
      }
    })

    return () => {
      unmounted = true
    }
  }, [isFocused])

  return dataLoaded ? (
    <View style={{ padding: 20, flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }>
        {modalVisible ? (
          <CustomDialog
            style={{ top: 150 }}
            title="Do you want to delete your message?"
            label="Delete"
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            handleClick={() => {
              socket.emit('delete_message', {
                id: messageId,
              })
            }}
          />
        ) : null}
        {allMessages.length === 0 ? (
          <Text style={styles.heading}>This is start of the conversation</Text>
        ) : null}
        <View style={styles.messagesContainer}>
          {allMessages.map((msg, key) => {
            const isYours = msg.from_id.toString() === user.id.toString()

            return (
              <Pressable
                key={key}
                onLongPress={() => {
                  setMessageId(msg.id)
                  if (msg.from_id.toString() === user.id.toString()) {
                    setModalVisible(true)
                  }
                }}>
                {msg.attachment && msg.attachment !== 'storage-image' ? (
                  <Image
                    style={{
                      width: windowWidth * 0.65,
                      height: windowWidth * 0.65,
                      borderRadius: 10,
                      alignSelf: isYours ? 'flex-end' : 'flex-start',
                      marginBottom: 10,
                    }}
                    source={{ uri: `data:image/gif;base64,${msg.attachment}` }}
                  />
                ) : null}
                {msg.attachment === 'storage-image' ? (
                  <View
                    style={[
                      styles.message,
                      isYours ? styles.messageTo : styles.messageFrom,
                    ]}>
                    <View style={{ padding: 10 }}>
                      <Text style={styles.messageText}>
                        Images cannot be stored in cache
                      </Text>
                    </View>
                  </View>
                ) : null}
                <View
                  style={[
                    styles.message,
                    isYours ? styles.messageTo : styles.messageFrom,
                  ]}>
                  {msg.content ? (
                    <View style={{ padding: 10 }}>
                      <Text style={styles.messageText}>{msg.content}</Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          content: '',
          image: null,
          binary: null,
        }}
        validate={(values) => {
          const errors = {}

          if (!values.content && !values.binary) {
            errors.content = 'Random'
          }

          return errors
        }}
        onSubmit={(values, { resetForm }) => {
          socket.emit('send_message', {
            from_id: user.id,
            to_id: to,
            content: values.content,
            attachment: values.binary,
          })
          resetForm()
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
        }) => (
          <View
            style={{
              bottom: isKeyboardVisible && Platform.OS === 'ios' ? 280 : 0,
            }}>
            {values.image ? (
              <Image
                source={{ uri: values.image }}
                style={{
                  width: 40,
                  height: 40,
                  marginTop: 20,
                }}
              />
            ) : null}
            <TextInput
              mode="outlined"
              theme={{ roundness: 20 }}
              placeholderTextColor={BORDER_COLOR}
              placeholder="Your message"
              onChangeText={handleChange('content')}
              onBlur={handleBlur('content')}
              value={values.content}
              right={<TextInput.Icon name="send" onPress={handleSubmit} />}
              left={
                values.image ? (
                  <TextInput.Icon
                    name="close"
                    onPress={() => {
                      setFieldValue('image', null)
                      setFieldValue('binary', null)
                    }}
                  />
                ) : (
                  <TextInput.Icon
                    name={attachmentSource}
                    onPress={async () => {
                      let result
                      if (attachmentSource === 'paperclip') {
                        result = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: true,
                          aspect: [1, 1],
                          quality: 1,
                          base64: true,
                        })
                      } else {
                        result = await ImagePicker.launchCameraAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: true,
                          aspect: [1, 1],
                          quality: 1,
                          base64: true,
                        })
                      }

                      if (!result.cancelled) {
                        setFieldValue('image', result.uri)
                        setFieldValue('binary', result.base64)
                      }
                    }}
                    onLongPress={() => {
                      setAttachmentSource(
                        attachmentSource === 'paperclip'
                          ? 'camera'
                          : 'paperclip',
                      )
                    }}
                  />
                )
              }
            />
          </View>
        )}
      </Formik>
    </View>
  ) : (
    <Loader />
  )
}

const styles = StyleSheet.create({
  inputContainer: {},
  container: {
    backgroundColor: BORDER_COLOR,
    marginBottom: 20,
    borderRadius: 8,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  messagesContainer: {
    flexDirection: 'column',
  },
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxWidth: '75%',
    marginBottom: 10,
    borderRadius: 15,
  },
  messageFrom: {
    backgroundColor: BORDER_COLOR,
    alignSelf: 'flex-start',
  },
  messageTo: {
    backgroundColor: BLUE_COLOR,
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff',
  },
})
