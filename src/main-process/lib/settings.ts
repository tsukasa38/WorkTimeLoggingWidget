import ElectronStore from 'electron-store';
import { name, fileExtension, defaults, type Settings } from './settings.config';

class Store {
    #store: ElectronStore<Settings>;

    constructor() {
        this.#store = new ElectronStore<Settings>({
            name,
            defaults,
            fileExtension,
        });
    }
    setPosition(x: number, y: number): boolean {
        try { this.#store.set('position', { x, y }); }
        catch(error) { return false; }

        return true;
    }
    setMovable(bool: boolean): boolean {
        try {this.#store.set('movable', bool); }
        catch(error) { return false; }

        return true;
    }
    setFontColor(color: string): boolean {
        try { this.#store.set('fontColor', color); }
        catch(error) { return false; }

        return true;
    }
    setIsAlwaysOnTop(bool: boolean): boolean {
        try { this.#store.set('isAlwaysOnTop', bool); }
        catch(error) { return false; }

        return true;
    }
    setBackgroundColor(color: string): boolean {
        try { this.#store.set('backgroundColor', color); }
        catch(error) { return false; }

        return true;
    }
    setNotificationIntervalSec(second: number): boolean {
        try { this.#store.set('notificationIntervalSec', second); }
        catch(error) { return false; }

        return true;
    }
    getSettings(): Settings {
        const settings: Settings = this.#store.store;
        return settings;
    }
}

export default new Store();