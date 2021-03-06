import path from 'path';
import Log from './lib/log';
import Settings from './lib/settings';
import Stopwatch from './lib/stopwatch';
import openAboutWindow from 'about-window';
import { generateData } from './lib/notification';
import { app, BrowserWindow, powerMonitor, dialog, Tray, Menu } from 'electron';

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
let movable: boolean = settings.movable;
let alwaysOnTop: boolean = settings.alwaysOnTop;
let notification: boolean = settings.notification;
let notificationIntervalSec: number = settings.notificationIntervalSec;

let tray: Tray | null = null;
let icon: string = 'icon.png';

if(process.platform === 'win32') {
    icon = 'icon.ico';
    app.setAppUserModelId('Work Time Logging Widget.exe');
}

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        x,
        y,
        movable,
        alwaysOnTop,
        width: 280,
        height: 180,
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
        //if(second % 60 === 0) { Log.insertLog('idle', Date.now()); }
        if(notification && second % notificationIntervalSec === 0) { mainWindow.webContents.send('notification', generateData(second)); }
        mainWindow.webContents.send('time', second);
    });

    const appClose = () => { app.quit(); };
    const hideMainWindow = () => { mainWindow.minimize(); };
    const showMainWindow = () => { mainWindow.restore(); mainWindow.focus(); };
    const changeNotification = () => { notification = !notification; Settings.setNotification(notification); }
    const changeMovable = () => { movable = !movable; mainWindow.setMovable(movable); Settings.setMovable(movable); }
    const changeNotificationIntervalSec = (second: number) => { notificationIntervalSec = second; Settings.setNotificationIntervalSec(second); };
    const changeAlwaysOnTop = () => { alwaysOnTop = !alwaysOnTop; mainWindow.setAlwaysOnTop(alwaysOnTop); Settings.setAlwaysOnTop(alwaysOnTop); };

    const notificationMenu = Menu.buildFromTemplate([
        { label: '15???', type: 'radio', click: () => changeNotificationIntervalSec(15*60), checked: (notificationIntervalSec === 15*60) },
        { label: '30???', type: 'radio', click: () => changeNotificationIntervalSec(30*60), checked: (notificationIntervalSec === 30*50) },
        { label: '60???', type: 'radio', click: () => changeNotificationIntervalSec(60*60), checked: (notificationIntervalSec === 60*60) },
        { label: '90???', type: 'radio', click: () => changeNotificationIntervalSec(90*60), checked: (notificationIntervalSec === 90*60) },
        { label: '120???', type: 'radio', click: () => changeNotificationIntervalSec(120*60), checked: (notificationIntervalSec === 120*60) },
    ]);

    const aboutWindow = () => openAboutWindow({
        icon_path: path.join(__dirname, 'icon.png'),
        copyright: 'Copyright (c) 2022 tsukasa38',
        product_name: 'Work Time Logging Widget',
        package_json_dir: __dirname,
        show_close_button: '?????????',
        use_version_info: true,
    });

    tray = new Tray(path.join(__dirname, icon));
    tray.addListener('double-click', showMainWindow);
    tray.setToolTip('Work Time Logging Widget');
    tray.setContextMenu(Menu.buildFromTemplate([
        { label: '??????', type: 'checkbox', checked: notification, click: changeNotification },
        { label: '????????????', type: 'submenu', submenu: notificationMenu },
        { label: '?????????????????????????????????', type: 'checkbox', checked: !movable, click: changeMovable },
        { label: '????????????????????????????????????', type: 'checkbox', checked: alwaysOnTop, click: changeAlwaysOnTop },
        { type: 'separator' },
        { label: '???????????????????????????', click: showMainWindow },
        { label: '??????????????????????????????', click: hideMainWindow },
        { type: 'separator' },
        { label: '??????????????????????????????????????????', click: aboutWindow },
        { type: 'separator' },
        { label: '??????', click: appClose },
    ]));

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
