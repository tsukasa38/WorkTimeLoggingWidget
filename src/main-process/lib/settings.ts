import path from 'path';
import { app } from 'electron';
import { LowSync, JSONFileSync } from 'lowdb';
import { name, fileExtension, defaults, type Settings } from './settings.config';

const userDataPath: string = app.getPath('userData');
const fileName: string = (fileExtension === '' ? name : `${name}.${fileExtension}`);
const filePath: string = path.join(userDataPath, fileName);

class Store {
    #db: LowSync<Settings>;

    constructor() {
        const adapter = new JSONFileSync<Settings>(filePath);
        this.#db = new LowSync<Settings>(adapter);
    }
    setPosition(x: number, y: number): boolean {
        try {
            this.#db.read();
            this.#db.data ??= defaults;
            this.#db.data.position = { x, y };
            this.#db.write();
        } catch(error) {
            return false;
        }

        return true;
    }
    setMovable(bool: boolean): boolean {
        try {
            this.#db.read();
            this.#db.data ??= defaults;
            this.#db.data.movable = bool;
            this.#db.write();
        } catch(error) {
            return false;
        }

        return true;
    }
    setFontColor(color: string): boolean {
        try {
            this.#db.read();
            this.#db.data ??= defaults;
            this.#db.data.fontColor = color;
            this.#db.write();
        } catch(error) {
            return false;
        }

        return true;
    }
    setAlwaysOnTop(bool: boolean): boolean {
        try {
            this.#db.read();
            this.#db.data ??= defaults;
            this.#db.data.alwaysOnTop = bool;
            this.#db.write();
        } catch(error) {
            return false;
        }

        return true;
    }
    setBackgroundColor(color: string): boolean {
        try {
            this.#db.read();
            this.#db.data ??= defaults;
            this.#db.data.backgroundColor = color;
            this.#db.write();
        } catch(error) {
            return false;
        }

        return true;
    }
    setNotification(bool: boolean): boolean {
        try {
            this.#db.read();
            this.#db.data ??= defaults;
            this.#db.data.notification = bool;
            this.#db.write();
        } catch(error) {
            return false;
        }

        return true;
    }
    setNotificationIntervalSec(second: number): boolean {
        try {
            this.#db.read();
            this.#db.data ??= defaults;
            this.#db.data.notificationIntervalSec = second;
            this.#db.write();
        } catch(error) {
            return false;
        }

        return true;
    }
    getSettings(): Settings {
        try { this.#db.read(); }
        catch(e) { return defaults; }

        return this.#db.data ?? defaults;
    }
}

export default new Store();