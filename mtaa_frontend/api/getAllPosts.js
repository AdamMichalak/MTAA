import { API_URL } from '../constants/Url'

export async function getAllPosts() {
  const response = await fetch(`${API_URL}/posts/get/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
