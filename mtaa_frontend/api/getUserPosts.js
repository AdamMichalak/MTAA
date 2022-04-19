import { API_URL } from '../constants/Url'

export async function getUserPosts(id) {
  const response = await fetch(`${API_URL}/posts/get/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
