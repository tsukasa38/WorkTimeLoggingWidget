import path from 'path';
import { app } from 'electron';
import { LowSync, JSONFileSync } from 'lowdb';
import { name, fileExtension, defaults, type Log } from './log.config';

const userDataPath: string = app.getPath('userData');
const fileName: string = (fileExtension === '' ? name : `${name}.${fileExtension}`);
const filePath: string = path.join(userDataPath, fileName);

class Store {
    #db: LowSync<Log>;

    constructor() {
        const adapter = new JSONFileSync<Log>(filePath);
        this.#db = new LowSync<Log>(adapter);
    }
    getLog(): Log {
        try { this.#db.read(); }
        catch(e) { return defaults; }

        return this.#db.data ?? defaults;
    }
    insertLog(type: string, timestamp: number): boolean {
        try {
            this.#db.read();
            this.#db.data ??= defaults;
            this.#db.data.log.push({ type, timestamp });
            this.#db.write();
        } catch(error) {
            return false;
        }

        return true;
    }
}

export default new Store();