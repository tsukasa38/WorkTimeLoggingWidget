export type Log = {
    log: {
        type: powerMonitorType;
        timestamp: number;
    }[];
}

export const defaults: Log = {
    log: []
};

export const name = 'log';
export const fileExtension = '';