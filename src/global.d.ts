interface Window {
    api: API;
}

type powerMonitorType = 'idle';

type API = {
    time: (listener: (second: number) => void) => void;
}