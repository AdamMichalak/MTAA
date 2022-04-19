import { API_URL } from '../constants/Url'

export async function getUser(id, token) {
  const response = await fetch(`${API_URL}/user/get/${id}/?token=${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
