interface Window {
    api: API;
}

type powerMonitorType = 'idle';

type NotificationData = {
    body: string;
    title: string;
    tag?: string | undefined;
}

type API = {
    time: (listener: (second: number) => void) => void;
    notification: (listener: (data: NotificationData) => void) => void;
}