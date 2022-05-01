import { useOffline } from '../hooks/useOffline'
import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect } from 'react'
import {
  showDefaultErrorMessage,
  showDefaultSuccessMessage,
} from '../helpers/showDefaultMessage'
import { Loader } from '../components/Loader'
import { navigate } from './RootNavigation'

export const SyncScreen = () => {
  const { queue } = useOffline()
  const { isInternetReachable } = useNetInfo()

  useEffect(() => {
    if (isInternetReachable) {
      if (Object.keys(queue).length > 0) {
        Object.keys(queue).map((url) => {
          fetch(url, JSON.parse(queue[url]))
            .then(() => {
              delete queue[url]
              showDefaultSuccessMessage('Sync request done')
            })
            .catch(() => {
              showDefaultErrorMessage('Sync request failed')
            })
        })
        navigate('Main')
      } else {
        navigate('Main')
      }
    }
  }, [isInternetReachable])

  return <Loader />
}
