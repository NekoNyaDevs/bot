import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction } from 'discord.js';
import { IGuild } from '../../struct/typings';

export default class FullRestartCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'fullrestart',
            description: 'Restart the bot and the server',
            category: 'admin',
            usage: 'fullrestart',
            ownerOnly: true,
            nsfw: false,
            options: [],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction, data: IGuild): Promise<void> {
        await ctx.reply({
            content: client.makeReply('Restarting... See ya!', 'loading'),
        });
        await client.ptero.restartNeko();
    };
};