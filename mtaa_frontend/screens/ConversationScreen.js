import { Dimensions, Image, StyleSheet, Text, Pressable } from 'react-native'
import { DefaultScreen } from './DefaultScreen'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { getMessage } from '../api/getMessage'
import { BORDER_COLOR } from '../constants/Color'
import { DefaultButton } from '../components/DefaultButton'
import { navigate } from './RootNavigation'
import { CustomDialog } from '../components/CustomDialog'
import { deleteMessage } from '../api/deleteMessage'
import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/Loader'

const windowWidth = Dimensions.get('window').width

export const ConversationScreen = ({ route }) => {
  const { user } = useAuth()
  const { params } = route
  const isFocused = useIsFocused()
  const [messages, setMessages] = useState([])
  const [hasMessages, setHasMessages] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [messageId, setMessageId] = useState(0)

  useEffect(() => {
    let unmounted = false

    getMessage(params.to, params.from).then((res) => {
      if (!unmounted) {
        if (res.response) {
          setHasMessages(false)
          setDataLoaded(true)
        } else {
          setMessages(res)
          setHasMessages(true)
          setDataLoaded(true)
        }
      }
    })

    return () => {
      unmounted = true
    }
  }, [isFocused])

  return dataLoaded ? (
    <DefaultScreen>
      {modalVisible ? (
        <CustomDialog
          style={{ top: 150 }}
          title="Do you want to delete your message?"
          label="Delete"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleClick={() => {
            deleteMessage(messageId, user.token)
          }}
        />
      ) : null}
      {hasMessages ? (
        messages.map((message, key) => {
          const x = message.sent_at.indexOf('.')
          return (
            <Pressable
              key={key}
              style={styles.container}
              onLongPress={() => {
                setMessageId(message.id)
                setModalVisible(true)
              }}>
              <Text style={[styles.heading, styles.text]}>
                {message.sent_at
                  .replace('T', ' ')
                  .replaceAll('-', ' ')
                  .slice(0, x)}
              </Text>
              {message.attachment ? (
                <Image
                  style={{
                    width: windowWidth - 80,
                    height: windowWidth - 80,
                    borderRadius: 8,
                    alignSelf: 'center',
                  }}
                  source={{
                    uri: `data:image/gif;base64,${message.attachment}`,
                  }}
                />
              ) : null}
              <Text style={styles.heading}>{message.content}</Text>
            </Pressable>
          )
        })
      ) : (
        <Text style={styles.heading}>No messages sent yet!</Text>
      )}
      <DefaultButton
        style={{ marginTop: 20 }}
        text={'Write back!'}
        handleClick={() => {
          navigate('SendMessage', { id: params.to })
        }}
      />
    </DefaultScreen>
  ) : (
    <Loader />
  )
}

const styles = StyleSheet.create({
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
})
