
import { app, BrowserWindow, protocol } from 'electron';
import path from 'path';
import { setupApp, setupListeners, teardownListeners } from './main/';
import { ipcMain } from 'electron'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });


  let mainReady = false;
  ipcMain.on('main-status-check', (event, args) => {
      event.reply('main-status', { status: mainReady ? 'ok' : 'not ok' });
  });
  mainWindow.webContents.once('dom-ready', () => {
    setupApp().then(() => { mainReady = true; });
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.on('ready', () =>  {
  setupListeners();
  createWindow();
});

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = request.url.replace('file:///', '');
    callback(pathname);
  })
});

app.on('window-all-closed', () => {
  teardownListeners();
  app.quit()
})
