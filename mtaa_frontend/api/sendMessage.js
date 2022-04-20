import { API_URL } from '../constants/Url'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { navigate } from '../screens/RootNavigation'

export const sendMessage = (from, to, token, data) => {
  const { content, file } = data
  fetch(`${API_URL}/message/create/${from}/${to}/?token=${token}`, {
    method: 'POST',
    body: JSON.stringify({ file: file || '', content: content }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          showDefaultSuccessMessage(data.response)
          navigate('Main', { screen: 'Messages' })
        } else {
          showDefaultErrorMessage(data.response)
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
