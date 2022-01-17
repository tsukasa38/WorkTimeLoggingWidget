import { contextBridge, ipcRenderer } from 'electron';

const api: API = {
    // main -> renderer
    time: (listener) => { ipcRenderer.on('time', (_event, second: number) => listener(second)); },
    notification: (listener) => { ipcRenderer.on('notification', (_event, data: NotificationData) => listener(data)); },
};

contextBridge.exposeInMainWorld('api', api);
