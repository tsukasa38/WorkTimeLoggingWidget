import { contextBridge, ipcRenderer } from 'electron';

const api: API = {
    // main -> renderer
    time: (listener) => { ipcRenderer.on('time', (_event, second: number) => listener(second)); },
};

contextBridge.exposeInMainWorld('api', api);
