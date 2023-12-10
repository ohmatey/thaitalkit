require('dotenv').config()

const path = require('path')
const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  clipboard
} = require('electron')
const isDev = true || process.env.NODE_ENV === 'development'

const {
  translateText,
  explainTranslation,
  generateAudio,
} = require('./openai')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  const startUrl = isDev
    ? 'http://localhost:3000' // URL of the dev server
    : `file://${path.join(__dirname, '../build/index.html')}`; // Path to your production build file

  win.loadURL(startUrl)

  return win
}

let appBrowser

app.whenReady().then(() => {
  appBrowser = createWindow()

  const ret = globalShortcut.register('Command+E', async () => {
    // get selected text
    const text = clipboard.readText()

    appBrowser.webContents.send('selected-text', text)

    try {
      const translation = await translateText({
        text,
      })

      appBrowser.webContents.send('translated-text', translation)

      const translationExplaination = await explainTranslation({
        originalText: text,
        translatedText: translation,
      })

      appBrowser.webContents.send('translated-text-explaination', translationExplaination)
      
      const explaination = JSON.parse(translationExplaination)

      if (explaination) {
        const audioBuffer = await generateAudio({
          input: explaination?.explanation,
        })

        appBrowser.webContents.send('audio-reply', audioBuffer)
      }
    } catch (error) {
      console.error(error)
    }

    appBrowser.show()
    appBrowser.focus()

  })

  if (!ret) {
    console.log('registration failed')
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()

  globalShortcut.unregisterAll()
})