import path from 'path';
import { app, BrowserWindow, powerMonitor, dialog } from 'electron';

const development = (process.env.NODE_ENV === 'development' ? true : false);

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

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    if(development) { mainWindow.webContents.openDevTools(); }

    powerMonitor.on('unlock-screen', () => {
        mainWindow.webContents.send('powerMonitor', { type: 'resume' });
    });

    powerMonitor.on('lock-screen', () => {
        mainWindow.webContents.send('powerMonitor', { type: 'suspend' });
    });
});
