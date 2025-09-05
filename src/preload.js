const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel) => ipcRenderer.send(channel)
  // we can also expose variables, not just functions
})