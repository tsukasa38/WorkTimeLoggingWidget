import { contextBridge, ipcRenderer } from 'electron';

const api: API = {
    // main -> renderer
    powerMonitor: (listener) => { ipcRenderer.on('powerMonitor', (_event, data: PowerMonitorData) => listener(data)); },
};

contextBridge.exposeInMainWorld('api', api);
