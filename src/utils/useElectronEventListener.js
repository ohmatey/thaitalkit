import { useEffect } from 'react'

const useElectronEventListener = (channelName, callback) => {
  useEffect(() => {
    if (!window.electron) {
      return
    }

    window.electron.receiveMessage(channelName, callback)

    // Optional: Clean up the listener when the component unmounts
    return () => {
      window.electron.removeListener(channelName)
    }
  }, [window.electron])

  return null
}

export default useElectronEventListener