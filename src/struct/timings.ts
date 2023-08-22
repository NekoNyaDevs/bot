import Client from './client';
import { Timing } from './typings';

export class Queue {
    public queue: Array<Function> = [];
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    };

    public async add(callback: Function): Promise<void> {
        this.queue.push(callback);
    };

    public async run(): Promise<void> {
        for (const callback of this.queue) {
            await callback();
            await new Promise(r => setTimeout(r, this.client.config.queueInterval));
        }
    };

    public async clear(): Promise<void> {
        this.queue = [];
    };

    public async restart(): Promise<void> {
        await this.clear();
        await this.run();
    };

    public async stop(): Promise<void> {
        await this.clear();
    };

    public async get(): Promise<Array<Function>> {
        return this.queue;
    };

    public async getLength(): Promise<number> {
        return this.queue.length;
    };

    public async getFirst(): Promise<Function> {
        return this.queue[0];
    };

    public async getLast(): Promise<Function> {
        return this.queue[this.queue.length - 1];
    };

    public async getAt(index: number): Promise<Function> {
        return this.queue[index];
    };
}

export class Timings {
    public client: Client;
    public _queue: Queue;
    public _timings: Array<Timing> = [];

    public constructor(client: Client) {
        this.client = client;
        this._queue = new Queue(client);
    };

    public async add(timing: Timing): Promise<void> {
        this._timings.push(timing);
    };

    public async run(): Promise<void> {
        for (const timing of this._timings) {
            this._timings[this._timings.indexOf(timing)].interval = setInterval(async () => {
                await timing.cb();
            }, timing.time);
        }
    };

    public async clear(): Promise<void> {
        this._timings = [];
    };

    public async restart(): Promise<void> {
        await this.stop();
        await this.run();
    };

    public async stop(): Promise<void> {
        for (const timing of this._timings) {
            clearInterval(timing.interval);
        }
        await this.clear();
    };

    public async get(): Promise<Array<Timing>> {
        return this._timings;
    };

    public async getLength(): Promise<number> {
        return this._timings.length;
    };

    public async getTiming(name: string): Promise<Timing|undefined> {
        return this._timings.find(timing => timing.name === name);
    };

    public async getFirst(): Promise<Timing> {
        return this._timings[0];
    };
}