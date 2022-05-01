import { API_URL } from '../constants/Url'
import cache from '../utility/cache'

export async function getMessages(from, to) {
  const url = `${API_URL}/message/get/${from}/${to}/`
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
      x['attachment'] = x['attachment'] ? 'storage-image' : ''
      return x
    })

    await cache.store(url, withoutImages)

    return data
  } else if (response) {
    const data = await response.json()
    await cache.store(url, data)
    return data
  }

  const data = await cache.get(url)
  return data ? data : response
}
