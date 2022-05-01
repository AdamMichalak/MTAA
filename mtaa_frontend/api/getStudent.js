import { API_URL } from '../constants/Url'
import cache from '../utility/cache'

export async function getStudent(id) {
  const url = `${API_URL}/student/get/${id}/`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => {})

  if (response && response.ok) {
    const data = await response.json()
    const temp = JSON.parse(JSON.stringify(data))
    temp['file'] = 'storage-image'

    await cache.store(url, temp)

    return data
  }

  const data = await cache.get(url)
  return data ? data : response
}
