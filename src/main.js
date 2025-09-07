const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 358,
    height: 458,
    frame: false,
    transparent: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  win.loadFile('src/index.html');

  // Open DevTools (optional) // Debugging
  //win.webContents.openDevTools();

  ipcMain.on('minimize_window', () => {
    win.minimize();
  });

  ipcMain.on('exit_window', () => {
    win.close();
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})