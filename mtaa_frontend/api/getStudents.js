import { API_URL } from '../constants/Url'
import cache from '../utility/cache'

export async function getStudents(id) {
  const url = `${API_URL}/students/get/${id}/`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => {})

  if (response && response.ok) {
    const data = await response.json()
    const temp = JSON.parse(JSON.stringify(data))
    const withoutImages = temp.map((x) => {
      x['file'] = 'storage-image'
      return x
    })

    await cache.store(url, withoutImages)

    return data
  }

  const data = await cache.get(url)
  return data ? data : response
}
