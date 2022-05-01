import { API_URL } from '../constants/Url'
import cache from '../utility/cache'

export async function getUser(id, token) {
  const url = `${API_URL}/user/get/${id}/?token=${token}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => {})

  if (response && response.ok) {
    const data = await response.json()
    await cache.store(url, data)

    return data
  }

  const data = await cache.get(url)
  return data ? data : response
}
