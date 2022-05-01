import { API_URL } from '../constants/Url'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { navigate } from '../screens/RootNavigation'

export const createPost = (id, token, file, conn, offline) => {
  const url = `${API_URL}/post/create/${id}/?token=${token}`
  const options = {
    method: 'POST',
    body: JSON.stringify({ file: file }),
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const { queue, setQueue } = offline
  if (!conn) {
    queue[url] = JSON.stringify(options)
    setQueue(queue)
    navigate('Main')
  } else {
    fetch(url, options)
      .then((response) => {
        response.json().then((data) => {
          if (response.ok) {
            showDefaultSuccessMessage(data.response)
            navigate('Main')
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
