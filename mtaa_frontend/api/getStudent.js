import { API_URL } from '../constants/Url'

export async function getStudent(id) {
  const response = await fetch(`${API_URL}/student/get/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
