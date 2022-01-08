import path from 'path';
import Settings from './lib/settings';
import { app, BrowserWindow, powerMonitor, dialog } from 'electron';

const development = (process.env.NODE_ENV === 'development' ? true : false);

const isMultipleLaunch = !app.requestSingleInstanceLock();
if(isMultipleLaunch) {
    const title = 'Multiple Launch Error';
    const content = 'The application is already running.';
    dialog.showErrorBox(title, content);
    app.quit();
}

const settings = Settings.getSettings();
const x = settings.position.x;
const y = settings.position.y;
const movable = settings.movable;
const alwaysOnTop = settings.alwaysOnTop;

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        x,
        y,
        movable,
        alwaysOnTop,
        width: 300,
        height: 200,
        frame: false,
        resizable: false,
        transparent: true,
        skipTaskbar: true,
        webPreferences: { preload: path.join(__dirname, 'preload.cjs') },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    if(development) { mainWindow.webContents.openDevTools(); }

    powerMonitor.on('unlock-screen', () => {
        mainWindow.webContents.send('powerMonitor', { type: 'resume' });
    });

    powerMonitor.on('lock-screen', () => {
        mainWindow.webContents.send('powerMonitor', { type: 'suspend' });
    });

    mainWindow.on('close', () => {
        const [ x, y ] = mainWindow.getPosition();
        Settings.setPosition(x, y);
    });
});
