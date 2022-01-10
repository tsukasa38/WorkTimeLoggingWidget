import path from 'path';
import Log from './lib/log';
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

    Log.insertLog('resume', Date.now());

    powerMonitor.on('unlock-screen', () => {
        const type = 'unlock';
        const timestamp = Date.now();
        Log.insertLog(type, timestamp);

        const data: PowerMonitorData = { type };
        mainWindow.webContents.send('powerMonitor', data);
    });

    powerMonitor.on('lock-screen', () => {
        const type = 'lock';
        const timestamp = Date.now();
        Log.insertLog(type, timestamp);

        const data: PowerMonitorData = { type };
        mainWindow.webContents.send('powerMonitor', data);
    });

    mainWindow.on('close', () => {
        const [ x, y ] = mainWindow.getPosition();
        Settings.setPosition(x, y);
    });
});
