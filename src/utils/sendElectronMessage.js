const sendElectronMessage = (channel, message) => {
  window.electron.sendMessage(channel, message)
}

export default sendElectronMessage

