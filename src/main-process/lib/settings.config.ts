export type Settings = {
    movable: boolean;
    fontColor: string;
    alwaysOnTop: boolean;
    notification: boolean;
    backgroundColor: string;
    notificationIntervalSec: number;
    position: { x: number; y: number; };
};

export const defaults: Settings = {
    movable: true,
    alwaysOnTop: false,
    notification: true,
    fontColor: '#bdc1c6',
    position: { x: 0, y: 0 },
    backgroundColor: '#202124',
    notificationIntervalSec: 3600,
};

export const name = 'settings';
export const fileExtension = '';