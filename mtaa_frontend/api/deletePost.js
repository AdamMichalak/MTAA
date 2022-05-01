import { API_URL } from '../constants/Url'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { navigate } from '../screens/RootNavigation'

export const deletePost = (id, token, conn, offline) => {
  const url = `${API_URL}/post/delete/${id}/?token=${token}`
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const { queue, setQueue } = offline

  if (!conn) {
    queue[url] = JSON.stringify(options)
    setQueue(queue)
    navigate('Main', { screen: 'Profile' })
  } else {
    fetch(url, options)
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
}
