import React from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native'

export const CustomDialog = ({
  modalVisible,
  setModalVisible,
  label,
  title,
  handleClick,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.')
        setModalVisible(!modalVisible)
      }}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{title}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            style={[styles.button, styles.buttonClose, { marginRight: 20 }]}
            onPress={handleClick}>
            <Text style={styles.textStyle}>{label}</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalView: {
    flexWrap: 'wrap',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    width: 120,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})
