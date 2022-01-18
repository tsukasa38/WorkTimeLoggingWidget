function format(timeSec: number): { hour: number, minute: number, second: number} {
    const hour: number = Math.floor(timeSec / 3600);
    const minute: number = Math.floor((timeSec % 3600) / 60);
    const second: number = timeSec % 60;
    return { hour, minute, second };
}

export function generateData(timeSec: number): NotificationData {
    const { hour, minute, second } = format(timeSec);

    const title = 'Work Time Logging Widget';
    const tag = 'WorkTimeLoggingWidget';

    if(hour === 0 && minute === 0 && second === 0) {
        const body = '記録を開始しました。';
        return { title, body, tag };
    }

    if(hour === 0 && minute === 0) {
        const body = `作業開始から${second}秒経過しました。`;
        return { title, body, tag };
    }

    if(hour === 0 && second === 0) {
        const body = `作業開始から${minute}分経過しました。`;
        return { title, body, tag };
    }

    if(minute === 0 && second === 0) {
        const body = `作業開始から${hour}時間経過しました。`;
        return { title, body, tag };
    }

    if(hour === 0) {
        const body = `作業開始から${minute}分${second}秒経過しました。`;
        return { title, body, tag };
    }

    if(minute === 0) {
        const body = `作業開始から${hour}時間${second}秒経過しました。`;
        return { title, body, tag };
    }

    if(second === 0) {
        const body = `作業開始から${hour}時間${minute}分経過しました。`;
        return { title, body, tag };
    }

    const body = `作業開始から${hour}時間${minute}分${second}秒経過しました。`;
    return { title, body, tag };
}