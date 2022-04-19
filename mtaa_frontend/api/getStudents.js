import { API_URL } from '../constants/Url'

export async function getStudents(id) {
  const response = await fetch(`${API_URL}/students/get/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
