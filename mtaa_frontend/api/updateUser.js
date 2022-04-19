import { API_URL } from '../constants/Url'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { navigate } from '../screens/RootNavigation'

export const updateUser = (id, token, data) => {
  const { username, email, password } = data
  fetch(`${API_URL}/user/update/${id}/?token=${token}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          showDefaultSuccessMessage(data.response)
          navigate('Main', { screen: 'Profile' })
        } else {
          showDefaultErrorMessage(data.response)
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
