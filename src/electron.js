
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.on('ready', createWindow);
