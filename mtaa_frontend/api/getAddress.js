import { API_URL } from '../constants/Url'
import cache from '../utility/cache'

export async function getAddress(id) {
  const url = `${API_URL}/address/get/${id}/`
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
