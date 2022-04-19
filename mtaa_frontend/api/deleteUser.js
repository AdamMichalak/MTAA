import { API_URL } from '../constants/Url'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { navigate } from '../screens/RootNavigation'

export const deleteUser = (id, token, logout) => {
  fetch(`${API_URL}/user/delete/${id}/?token=${token}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          logout()
          showDefaultSuccessMessage(data.response)
          navigate('Welcome')
        } else {
          showDefaultErrorMessage(data.response)
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
