import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { API_URL } from '../constants/Url'
import { getStudent } from './getStudent'

export const addFriend = (id, token, friendId) => {
  const contacts = []
  getStudent(id).then((res) => {
    if (res.contacts.includes(friendId)) {
      showDefaultErrorMessage('User is already your friend')
    } else {
      if (res.contacts) {
        contacts.push(res.contacts)
      }
      contacts.push(friendId)

      const fetchData = JSON.stringify({
        ...res,
        contacts: contacts.join(','),
      })

      fetch(`${API_URL}/student/update/data/${id}/?token=${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: fetchData,
      })
        .then((response) => {
          response.json().then(() => {
            if (response.ok) {
              showDefaultSuccessMessage('Friend added')
            } else {
              showDefaultErrorMessage('Something went wrong')
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  })
}
