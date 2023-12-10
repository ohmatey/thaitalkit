import { useState, useEffect } from 'react'

import useElectronEventListener from './utils/useElectronEventListener'

const App = () => {
  const [selectedText, setSelectedText] = useState('')
  const [translatedText, setTranslatedText] = useState({})
  const [translatedTextExplaination, setTranslatedTextExplaination] = useState({})
  const [audioReply, setAudioReply] = useState(null)
  const [loadingExplanation, setLoadingExplanation] = useState(false)

  useElectronEventListener('selected-text', (message) => {
    setSelectedText(message)

    setLoadingExplanation(true)

    setTranslatedText({})
    setTranslatedTextExplaination({})
    setAudioReply(null)
  })

  useElectronEventListener('translated-text', (message) => {
    setTranslatedText(JSON.parse(message))
  })

  useElectronEventListener('translated-text-explaination', (message) => {
    setTranslatedTextExplaination(JSON.parse(message))

    setLoadingExplanation(false)
  })

  useElectronEventListener('audio-reply', (message) => {
    setAudioReply(message)

    setLoadingExplanation(false)
  })

  useEffect(() => {
    if (audioReply) {
      // stop previous audio
      const audios = document.querySelectorAll('audio')

      audios.forEach((audio) => {
        audio.pause()
      })

      const blob = new Blob([audioReply], { type: 'audio/wav' });
      const url = window.URL.createObjectURL(blob)

      const audio = new Audio(url)
      
      audio.play()
    }
  }, [audioReply])

  return (
    <div
      style={{
        fontFamily: '"IBM Plex Sans Thai", sans-serif',
        padding: '1rem',
      }}
    >
      <h1>ThaiTalkIt</h1>

      <hr />

      <h5>Selected Text</h5>
      <p>{selectedText}</p>

      <hr />

      <h5>Translated Text</h5>
      <p>{translatedText?.thai}</p>

      <hr />

      <h5>Translated Text Explaination</h5>

      {loadingExplanation ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>{translatedTextExplaination?.explanation}</p>
      
          {translatedTextExplaination?.keywords?.length > 0 && (
            <>
              <h6>Keywords</h6>
              <ul>
                {translatedTextExplaination.keywords.map((keyword) => (
                  <li key={keyword}>{keyword}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default App