import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    on: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args)); },
});
