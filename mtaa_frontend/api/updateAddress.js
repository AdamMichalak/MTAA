import { API_URL } from '../constants/Url'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { navigate } from '../screens/RootNavigation'

export const updateAddress = (id, token, data) => {
  const fetchData = JSON.stringify({
    street: data.street,
    city: data.city,
    postalcode: data.psc,
    country: data.country,
  })

  fetch(`${API_URL}/address/update/${id}/?token=${token}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: fetchData,
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
