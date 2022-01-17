import path from 'path';
import Log from './lib/log';
import Settings from './lib/settings';
import Stopwatch from './lib/stopwatch';
import { generateData } from './lib/notification';
import { app, BrowserWindow, powerMonitor, dialog } from 'electron';

const development = (process.env.NODE_ENV === 'development' ? true : false);

if(process.platform === 'win32') {
    app.setAppUserModelId('Work Time Logging Widget.exe');
}

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
const notification = settings.notificationIntervalSec;

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        x,
        y,
        movable,
        alwaysOnTop,
        width: 300,
        height: 200,
        show: false,
        frame: false,
        resizable: false,
        transparent: true,
        skipTaskbar: true,
        webPreferences: { preload: path.join(__dirname, 'preload.cjs') },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    if(development) { mainWindow.webContents.openDevTools(); }

    const stopwatch = new Stopwatch(async (second: number) => {
        if(second % 60 === 0) { Log.insertLog('idle', Date.now()); }
        if(second % notification === 0) { mainWindow.webContents.send('notification', generateData(second)); }
        mainWindow.webContents.send('time', second);
    });

    powerMonitor.on('unlock-screen', () => {
        stopwatch.start();
    });

    powerMonitor.on('lock-screen', () => {
        stopwatch.stop();
        stopwatch.reset();
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        stopwatch.start();
    });

    mainWindow.on('close', () => {
        const [ x, y ] = mainWindow.getPosition();
        Settings.setPosition(x, y);
    });
});
