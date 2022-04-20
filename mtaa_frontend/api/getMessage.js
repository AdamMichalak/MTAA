import { API_URL } from '../constants/Url'

export async function getMessage(from, to) {
  const response = await fetch(`${API_URL}/message/get/${from}/${to}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
