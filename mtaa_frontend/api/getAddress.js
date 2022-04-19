import { API_URL } from '../constants/Url'

export async function getAddress(id) {
  const response = await fetch(`${API_URL}/address/get/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
