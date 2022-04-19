import { Image, StyleSheet, Text, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

import { getAddress } from '../api/getAddress'
import { deleteUser } from '../api/deleteUser'
import { getStudent } from '../api/getStudent'
import { useAuth } from '../hooks/useAuth'
import { navigate } from './RootNavigation'
import { Loader } from '../components/Loader'
import { CustomDialog } from '../components/CustomDialog'
import { DefaultButton } from '../components/DefaultButton'
import { DefaultScreen } from './DefaultScreen'

export const ProfileScreen = () => {
  const { user, logout } = useAuth()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [userData, setUserData] = useState({})
  const [address, setAddress] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const isFocused = useIsFocused()

  useEffect(() => {
    getStudent(user.id).then((res) => {
      setUserData(res)
      setDataLoaded(true)
    })

    getAddress(user.id).then((res) => {
      setAddress({
        street: res.street,
        city: res.city,
        psc: res.postalcode,
        country: res.country,
      })
      setDataLoaded(true)
    })
  }, [isFocused])

  return dataLoaded ? (
    <DefaultScreen style={styles.container}>
      {modalVisible ? (
        <CustomDialog
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          label="Delete user"
          title="Do you really want to delete your account ?"
          handleClick={() => {
            deleteUser(user.id, user.token, logout)
            setModalVisible(false)
          }}
        />
      ) : null}
      <View style={styles.header}>
        {userData.file ? (
          <Image
            style={{
              width: 125,
              height: 125,
              borderRadius: 75,
            }}
            source={{ uri: `data:image/gif;base64,${userData.file}` }}
          />
        ) : (
          <Ionicons name="person-circle-outline" size={150} color="#000" />
        )}
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.headerText}>{userData.fullname}</Text>
          <Text style={styles.headerText}>{userData.phonenumber}</Text>
          <Text style={styles.headerText}>{address.street}</Text>
          <Text style={styles.headerText}>
            {address.city} {address.psc}
          </Text>
          <Text style={styles.headerText}>{address.country}</Text>
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <Ionicons
            style={{ marginBottom: 20 }}
            name="trash-bin"
            size={30}
            color="#000"
            onPress={() => {
              setModalVisible(true)
            }}
          />
          <Ionicons
            name="pencil"
            size={30}
            color="#000"
            onPress={() => {
              navigate(user.hasAddress ? 'UpdateAddress' : 'CreateAddress')
            }}
          />
        </View>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginBottom: 20,
          marginTop: 20,
          flexWrap: 'wrap',
        }}>
        <DefaultButton
          handleClick={() => {
            logout()
          }}
          text="Logout"
          style={{ width: '47.5%' }}
        />
        <DefaultButton
          handleClick={() => {
            navigate('UpdateUser')
          }}
          text="Update user data"
          style={{ width: '47.5%' }}
        />
        <DefaultButton
          handleClick={() => navigate('UploadPhoto', { type: 'user_photo' })}
          text="Upload profile picture"
          style={{ width: '100%', marginTop: 10 }}
        />
      </View>
      <View style={[styles.section]}>
        <Ionicons
          style={styles.editIcon}
          name="pencil"
          size={30}
          color="#000"
          onPress={() => {
            navigate('UpdateProfile')
          }}
        />
        <Text style={styles.sectionHeading}>Personal info</Text>
        <View>
          <Text style={styles.sectionText}>Height: {userData.height}cm</Text>
          <Text style={styles.sectionText}>Weight: {userData.weight}kg</Text>
          <Text style={styles.sectionText}>Body type: {userData.bodytype}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Ionicons
          style={styles.editIcon}
          name="pencil"
          size={30}
          color="#000"
          onPress={() => {
            navigate('UpdateProfile')
          }}
        />
        <Text style={styles.sectionHeading}>Hobbies</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {userData.hobby?.split(',').map((hobby, key) => {
            return (
              <Text key={key} style={[styles.sectionText, { width: '33%' }]}>
                {hobby}
              </Text>
            )
          })}
        </View>
      </View>
      <View style={styles.section}>
        <Ionicons
          style={styles.editIcon}
          name="pencil"
          size={30}
          color="#000"
          onPress={() => {
            navigate('UpdateProfile')
          }}
        />
        <Text style={styles.sectionHeading}>Interests</Text>
        <View>
          {userData.interests?.split(',').map((interest, key) => {
            return (
              <Text key={key} style={[styles.sectionText]}>
                {interest}
              </Text>
            )
          })}
        </View>
      </View>
    </DefaultScreen>
  ) : (
    <Loader />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  section: {
    backgroundColor: '#E4F3FD',
    borderRadius: 10,
    padding: 20,
    position: 'relative',
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  button: {
    borderRadius: 8,
    height: 40,
    backgroundColor: '#2196F3',
  },
})
