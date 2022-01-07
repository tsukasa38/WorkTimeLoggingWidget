const path = require('path');
const { app, BrowserWindow, powerMonitor, dialog } = require('electron');

const isMultipleLaunch = !app.requestSingleInstanceLock();
if(isMultipleLaunch) {
    const title = 'Multiple Launch Error';
    const content = 'The application is already running.';
    dialog.showErrorBox(title, content);
    app.quit();
}

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
