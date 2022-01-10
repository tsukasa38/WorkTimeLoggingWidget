interface Window {
    api: API;
}

type PowerMonitorData = {
    type: string;
}

type API = {
    powerMonitor: (listener: (data: PowerMonitorData) => void) => void;
}