import { API_URL } from '../constants/Url'

export async function getPost(id) {
  const response = await fetch(`${API_URL}/post/get/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
