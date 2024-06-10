import Event from '../struct/event';
import Client from '../struct/client';
import { ActivityType } from 'discord.js';
import { slashsync, wait } from '../struct/functions';

export default class ReadyEvent extends Event {
    public constructor(client: Client) {
        super(client, {
            name: 'ready',
            once: true
        });
    };

    public async run(client: Client): Promise<void> {
        client.logger.info(`Logged in as ${client.user!.tag} (Ready and running)`, 'Ready');
        client.user!.setActivity(`/help`, { type: ActivityType.Playing });
        client.user!.setStatus('online');

        await wait('3s');

        await slashsync(client, { debug: client.config.debug });
        return;
    };
};