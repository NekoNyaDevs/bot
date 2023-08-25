import Client from './client';
import * as Pterodactyl from 'pterodactyl.js';

export default class Ptero {
    public client: Client;
    public _ptero: Pterodactyl.UserClient;

    public constructor(client: Client) {
        this.client = client;
        this._ptero = new Pterodactyl.Builder(process.env.PTERO_URL as string, process.env.PTERO_KEY as string).asUser();
    };

    public async getServer(id: string): Promise<Pterodactyl.ClientServer> {
        return await this._ptero.getClientServer(id);
    };

    public async restartNeko(): Promise<void> {
        const server = await this.getServer(process.env.PTERO_SERVER as string);
        await server.restart();
    };

    public async stopNeko(): Promise<void> {
        const server = await this.getServer(process.env.PTERO_SERVER as string);
        await server.stop();
    }
}