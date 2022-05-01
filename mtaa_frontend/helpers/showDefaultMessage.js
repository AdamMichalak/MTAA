import { showMessage } from 'react-native-flash-message'
import { INVALID_COLOR, SUCCESS_COLOR } from '../constants/Color'

const styles = {
  paddingTop: 50,
  paddingLeft: 20,
  paddingRight: 20,
}

const options = {
  type: 'info',
  duration: 3000,
}

export const showDefaultErrorMessage = (message) =>
  showMessage({
    message: message,
    ...options,
    style: {
      ...styles,
      backgroundColor: INVALID_COLOR,
    },
    titleStyle: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
    },
  })

export const showDefaultSuccessMessage = (message) =>
  showMessage({
    message: message,
    ...options,
    style: {
      ...styles,
      backgroundColor: SUCCESS_COLOR,
    },
    titleStyle: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
    },
  })

export const showDefaultWarnMessage = (message, duration = undefined) =>
  showMessage({
    message: message,
    type: 'warning',
    position: 'bottom',
    duration,
    autoHide: false,
    hideOnPress: true,
    style: {
      ...styles,
      paddingTop: 20,
    },
    titleStyle: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
    },
  })
