class Stopwatch {
    #second: number;
    #id: NodeJS.Timer | null;
    #timestamp: number | null;
    #callback: (second: number) => Promise<void>;

    constructor(callback: (second: number) => Promise<void>) {
        this.#id = null;
        this.#second = -1;
        this.#timestamp = null;
        this.#callback = callback;
    }
    start(): void {
        if(this.#id !== null) { return; }

        const callback = () => {
            this.#second += 1;
            if(this.#callback !== null) { this.#callback(this.#second); }

            const now = Date.now();
            const delay = now - (this.#timestamp! + this.#second * 1000);
            this.#id = setTimeout(callback, 1000 - delay);
        };

        this.#timestamp ??= Date.now();
        this.#id = setTimeout(callback, 0);
    }
    stop(): void {
        if(this.#id === null) { return; }
        clearTimeout(this.#id);
        this.#id = null;
    }
    reset(): void {
        this.stop();
        this.#second = -1;
        this.#timestamp = null;
    }
}

export default Stopwatch;
