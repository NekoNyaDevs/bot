import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction } from 'discord.js';
import { IGuild } from '../../struct/typings';

export default class StopCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'stop',
            description: 'Stop the bot',
            category: 'admin',
            usage: 'stop',
            ownerOnly: true,
            nsfw: false,
            options: [],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction, data: IGuild): Promise<void> {
        await ctx.reply({
            content: client.makeReply('Stopping... Goodbye!', 'loading'),
        });
        await client.ptero.stopNeko();
    };
};