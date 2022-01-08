export type Settings = {
    movable: boolean;
    fontColor: string;
    alwaysOnTop: boolean;
    backgroundColor: string;
    position: { x: number; y: number; };
};

export const defaults: Settings = {
    movable: true,
    alwaysOnTop: false,
    fontColor: '#bdc1c6',
    position: { x: 0, y: 0 },
    backgroundColor: '#202124',
};

export const name = 'settings';
export const fileExtension = '';