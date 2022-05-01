import { createContext, useContext, useState } from 'react'

const offlineContext = createContext()

export const OfflineProvider = ({ children }) => {
  const offline = useProvideOffline()
  return (
    <offlineContext.Provider value={offline}>
      {children}
    </offlineContext.Provider>
  )
}

export const useOffline = () => {
  return useContext(offlineContext)
}

const useProvideOffline = () => {
  const [queue, setQueue] = useState([])

  return {
    queue,
    setQueue,
  }
}
