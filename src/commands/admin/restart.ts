import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, Collection } from 'discord.js';
import { IGuild } from '../../struct/typings';
import { slashsync } from '../../struct/functions';

export default class RestartCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'restart',
            description: 'Restart the bot',
            category: 'admin',
            usage: 'restart',
            ownerOnly: true,
            nsfw: false,
            options: [],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction, data: IGuild): Promise<void> {
        await ctx.reply({
            content: client.makeReply('Restarting...', 'loading'),
        });
        await client.stop();
        console.log(client.commands.get('hello')?.run.toString())
        client.resetProperties();
        await client.start();
        await ctx.editReply({
            content: client.makeReply('Restarted, reloading commands...', 'success')
        });
        await slashsync(client, { debug: client.config.debug });
        console.log(client.commands.get('hello')?.run.toString())
        await ctx.editReply({
            content: client.makeReply('Reloaded commands, successfully restarted!', 'success')
        });
    };
};