import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

const prefix = 'cache'
// in minutes
const cacheDuration = 10

const store = async (key, value) => {
  const item = {
    value,
    timeStamp: Date.now(),
  }

  try {
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item))
  } catch (err) {
    console.log(err)
  }
}

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key)
    const item = JSON.parse(value)

    if (!item) return null

    if (
      moment(Date.now()).diff(moment(item.timeStamp), 'minutes') > cacheDuration
    ) {
      await AsyncStorage.removeItem(prefix + key)
      return null
    }

    return item.value
  } catch (err) {
    console.log(err)
  }
}

export default { store, get }
