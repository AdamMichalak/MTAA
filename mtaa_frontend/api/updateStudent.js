import { navigate } from '../screens/RootNavigation'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { API_URL } from '../constants/Url'

export const updateStudent = (id, token, data) => {
  const {
    fullName,
    phone,
    height,
    weight,
    hairColor,
    age,
    hobbies,
    interests,
    bodyType,
  } = data

  const hobby = []
  const interests_arr = []
  Object.keys(hobbies).map((key) => {
    if (hobbies[key]) {
      hobby.push(key.charAt(0).toUpperCase() + key.slice(1))
    }
  })

  Object.keys(interests).map((key) => {
    if (interests[key]) {
      interests_arr.push(key.charAt(0).toUpperCase() + key.slice(1))
    }
  })

  const fetchData = JSON.stringify({
    fullname: fullName,
    phonenumber: phone,
    contacts: '',
    height: height,
    weight: weight,
    hobby: hobby.toString(),
    haircolor: hairColor,
    age: age,
    bodytype: bodyType,
    interests: interests_arr.toString(),
  })

  fetch(`${API_URL}/student/update/data/${id}/?token=${token}`, {
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
