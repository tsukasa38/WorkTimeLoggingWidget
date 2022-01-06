const path = require('path');
const { app, BrowserWindow, powerMonitor } = require('electron');

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 200,
        frame: false,
        resizable: false,
        transparent: true,
        skipTaskbar: true,
        alwaysOnTop: false,
        webPreferences: { preload: path.join(__dirname, 'preload.cjs') }
    });

    mainWindow.loadFile(path.join(__dirname, 'public/index.html'));

    //mainWindow.webContents.openDevTools();

    powerMonitor.on('unlock-screen', () => {
        mainWindow.webContents.send('powerMonitor', { type: 'resume' });
    });

    powerMonitor.on('lock-screen', () => {
        mainWindow.webContents.send('powerMonitor', { type: 'suspend' });
    });
});
